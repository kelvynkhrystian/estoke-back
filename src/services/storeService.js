import { fn, col } from 'sequelize';
import sequelize from '../config/database.js';
import { Store, User } from '../models/index.js';

// 🔍 LISTAR LOJAS (ATIVAS + CONTAGEM DE USUÁRIOS)
export const getStores = async () => {
  const stores = await Store.findAll({
    attributes: [
      'id',
      'name',
      'is_active',
      [fn('COUNT', col('Users.id')), 'total_users'],
    ],
    include: [
      {
        model: User,
        attributes: [],
        required: false,
        where: {
          is_active: true,
        },
      },
    ],
    group: ['Store.id'],
    order: [['id', 'ASC']],
  });

  return stores;
};

// 🔍 BUSCAR POR ID
export const getStoreById = async (id) => {
  return await Store.findOne({
    where: {
      id,
      is_active: true,
    },
  });
};

// ➕ CRIAR LOJA
export const createStore = async ({ name, is_active = true }) => {
  const store = await Store.create({
    name,
    is_active,
  });

  const data = store.toJSON();

  return {
    ...data,
    total_users: 0,
  };
};

// ✏️ ATUALIZAR LOJA
export const updateStore = async (id, { name, is_active }) => {
  const store = await Store.findByPk(id);

  if (!store) return null;

  await store.update({
    name: name ?? store.name,
    is_active: is_active ?? store.is_active,
  });

  return store;
};

// 🗑️ REMOVER LOJA
export const removeStore = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const store = await Store.findByPk(id, { transaction });

    if (!store) {
      await transaction.rollback();
      return null;
    }

    // Mantém sua lógica antiga: apaga usuários vinculados
    await User.destroy({
      where: { store_id: id },
      transaction,
    });

    await store.destroy({ transaction });

    await transaction.commit();

    return { id };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
