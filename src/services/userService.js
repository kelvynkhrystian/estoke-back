import bcrypt from 'bcrypt';
import pool from '../config/database.js';

// Admin cria usuário/admin
export const create = async ({
  name,
  email,
  password,
  role = 'employee',
  store_id = null,
}) => {
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [
    email,
  ]);

  if (existing.length > 0) {
    throw new Error('E-mail já cadastrado');
  }

  const password_hash = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `
    INSERT INTO users (name, email, password_hash, role, store_id, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
    `,
    [name, email, password_hash, role, store_id]
  );

  return {
    id: result.insertId,
    name,
    email,
    role,
    store_id,
    is_active: 1,
  };
};

// Admin lista usuários
export const list = async () => {
  const [rows] = await pool.query(
    `
    SELECT id, name, email, role, store_id, is_active, created_at, updated_at
    FROM users
    ORDER BY id DESC
    `
  );

  return rows;
};

// Admin busca usuário por ID
export const findById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT id, name, email, role, store_id, is_active, created_at, updated_at
    FROM users
    WHERE id = ?
    `,
    [id]
  );

  if (rows.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  return rows[0];
};

// Admin edita usuário
export const update = async (id, { name, email, role, store_id }) => {
  const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);

  if (users.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  if (email) {
    const [existingEmail] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existingEmail.length > 0) {
      throw new Error('E-mail já está em uso');
    }
  }

  await pool.query(
    `
    UPDATE users
    SET 
      name = COALESCE(?, name),
      email = COALESCE(?, email),
      role = COALESCE(?, role),
      store_id = ?
    WHERE id = ?
    `,
    [name, email, role, store_id ?? null, id]
  );

  return await findById(id);
};

// Admin ativa/desativa usuário
export const updateStatus = async (id, { is_active }) => {
  const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [id]);

  if (users.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [
    is_active ? 1 : 0,
    id,
  ]);

  return {
    id: Number(id),
    is_active: is_active ? 1 : 0,
  };
};

// Usuário logado troca o próprio email
export const updateEmail = async (userId, { new_email, password }) => {
  const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [
    userId,
  ]);

  if (users.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error('Senha inválida');
  }

  const [existingEmail] = await pool.query(
    'SELECT id FROM users WHERE email = ? AND id != ?',
    [new_email, userId]
  );

  if (existingEmail.length > 0) {
    throw new Error('E-mail já está em uso');
  }

  await pool.query('UPDATE users SET email = ? WHERE id = ?', [
    new_email,
    userId,
  ]);

  return { email: new_email };
};

// Usuário logado troca a própria senha
export const updatePassword = async (
  userId,
  { current_password, new_password }
) => {
  const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [
    userId,
  ]);

  if (users.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(current_password, user.password_hash);

  if (!isMatch) {
    throw new Error('Senha atual inválida');
  }

  const newHash = await bcrypt.hash(new_password, 10);

  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [
    newHash,
    userId,
  ]);

  return { message: 'Senha atualizada com sucesso' };
};
