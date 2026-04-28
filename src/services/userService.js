import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { User } from '../models/index.js';

// Admin cria usuário/admin
export const create = async ({
  name,
  email,
  password,
  role = 'employee',
  store_id = null,
}) => {
  const existing = await User.findOne({
    where: { email },
    attributes: ['id'],
  });

  if (existing) {
    throw new Error('E-mail já cadastrado');
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password_hash,
    role,
    store_id,
    is_active: true,
  });

  const data = user.toJSON();
  delete data.password_hash;

  return data;
};

// Admin lista usuários
export const list = async () => {
  return await User.findAll({
    attributes: [
      'id',
      'name',
      'email',
      'role',
      'store_id',
      'is_active',
      'created_at',
      'updated_at',
    ],
    order: [['id', 'DESC']],
  });
};

// Admin busca usuário por ID
export const findById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: [
      'id',
      'name',
      'email',
      'role',
      'store_id',
      'is_active',
      'created_at',
      'updated_at',
    ],
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
};

// Admin edita usuário
export const update = async (id, { name, email, role, store_id }) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (email) {
    const existingEmail = await User.findOne({
      where: {
        email,
        id: {
          [Op.ne]: id,
        },
      },
      attributes: ['id'],
    });

    if (existingEmail) {
      throw new Error('E-mail já está em uso');
    }
  }

  await user.update({
    name: name ?? user.name,
    email: email ?? user.email,
    role: role ?? user.role,
    store_id: store_id ?? null,
  });

  return await findById(id);
};

// Admin ativa/desativa usuário
export const updateStatus = async (id, { is_active }) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  await user.update({
    is_active: Boolean(is_active),
  });

  return {
    id: Number(id),
    is_active: Boolean(is_active),
  };
};

// Usuário logado troca o próprio email
export const updateEmail = async (userId, { new_email, password }) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error('Senha inválida');
  }

  const existingEmail = await User.findOne({
    where: {
      email: new_email,
      id: {
        [Op.ne]: userId,
      },
    },
    attributes: ['id'],
  });

  if (existingEmail) {
    throw new Error('E-mail já está em uso');
  }

  await user.update({
    email: new_email,
  });

  return { email: new_email };
};

// Usuário logado troca a própria senha
export const updatePassword = async (
  userId,
  { current_password, new_password }
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const isMatch = await bcrypt.compare(current_password, user.password_hash);

  if (!isMatch) {
    throw new Error('Senha atual inválida');
  }

  const password_hash = await bcrypt.hash(new_password, 10);

  await user.update({
    password_hash,
  });

  return { message: 'Senha atualizada com sucesso' };
};
