import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../config/database.js';
import {
  Stock,
  StockMovement,
  StockTransfer,
  StockTransferItem,
  Store,
  User,
  Product,
  Insumo,
} from '../models/index.js';

// 🔹 BUSCAR ESTOQUE (UNIFICADO)
export const getStock = async (filters, type) => {
  const { user_store_id, role, store_id } = filters;

  const where = {};

  if (type) {
    where.item_type = type;
  }

  if (store_id) {
    where.store_id = Number(store_id);
  } else if (role !== 'admin') {
    where.store_id = user_store_id;
  }

  const stock = await Stock.findAll({
    where,
    include: [
      {
        model: Store,
        attributes: ['id', 'name'],
      },
    ],
    order: [
      ['store_id', 'ASC'],
      ['item_type', 'ASC'],
      ['item_id', 'ASC'],
    ],
  });

  const result = await Promise.all(
    stock.map(async (item) => {
      const data = item.toJSON();

      let product = null;
      let insumo = null;

      if (data.item_type === 'PRODUCT') {
        product = await Product.findByPk(data.item_id, {
          attributes: ['id', 'name', 'sku', 'min_stock'],
        });
      }

      if (data.item_type === 'INSUMO') {
        insumo = await Insumo.findByPk(data.item_id, {
          attributes: ['id', 'name', 'min_stock'],
        });
      }

      return {
        id: data.id,
        store_id: data.store_id,
        item_id: data.item_id,
        item_type: data.item_type,
        quantity: data.quantity,
        store_name: data.Store?.name ?? null,
        name: product?.name ?? insumo?.name ?? null,
        sku: product?.sku ?? null,
        min_stock: product?.min_stock ?? insumo?.min_stock ?? null,
      };
    })
  );

  return result.sort((a, b) => {
    if (a.store_id !== b.store_id) return a.store_id - b.store_id;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });
};

// 🔹 BUSCAR MOVIMENTOS (UNIFICADO)
export const getMovements = async (store_id, type) => {
  const where = {
    store_id,
  };

  if (type) {
    where.item_type = type;
  }

  const movements = await StockMovement.findAll({
    where,
    include: [
      {
        model: User,
        attributes: ['id', 'name'],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  const result = await Promise.all(
    movements.map(async (movement) => {
      const data = movement.toJSON();

      let product = null;
      let insumo = null;

      if (data.item_type === 'PRODUCT') {
        product = await Product.findByPk(data.item_id, {
          attributes: ['id', 'name'],
        });
      }

      if (data.item_type === 'INSUMO') {
        insumo = await Insumo.findByPk(data.item_id, {
          attributes: ['id', 'name'],
        });
      }

      return {
        ...data,
        user_name: data.User?.name ?? null,
        name: product?.name ?? insumo?.name ?? null,
      };
    })
  );

  return result;
};

// 🔹 ATUALIZA ESTOQUE
async function updateStock(data, transaction) {
  const { item_id, store_id, quantity, type, item_type } = data;

  if (!['PRODUCT', 'INSUMO'].includes(item_type)) {
    throw new Error('Tipo inválido');
  }

  if (!['IN', 'OUT', 'ADJUST'].includes(type)) {
    throw new Error('Tipo de movimentação inválido');
  }

  const id = Number(item_id);
  const qty = Number(quantity);

  if (!id || !store_id || !qty || qty <= 0) {
    throw new Error('Dados de estoque inválidos');
  }

  const stock = await Stock.findOne({
    where: {
      item_id: id,
      store_id,
      item_type,
    },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  const current = stock ? Number(stock.quantity) : 0;

  let newQty = current;

  if (type === 'IN') {
    newQty = current + qty;
  }

  if (type === 'OUT') {
    if (current < qty) {
      throw new Error('Estoque insuficiente');
    }

    newQty = current - qty;
  }

  if (type === 'ADJUST') {
    newQty = qty;
  }

  if (stock) {
    await stock.update(
      {
        quantity: newQty,
      },
      { transaction }
    );
  } else {
    await Stock.create(
      {
        item_id: id,
        store_id,
        item_type,
        quantity: newQty,
      },
      { transaction }
    );
  }

  return newQty;
}

// 🔹 INSERE MOVIMENTO
async function insertMovement(data, transaction) {
  const {
    item_id,
    item_type,
    store_id,
    quantity,
    type,
    created_by,
    reason,
    notes,
    reference_type,
    reference_id,
    balance_after,
  } = data;

  if (!['PRODUCT', 'INSUMO'].includes(item_type)) {
    throw new Error('Tipo inválido');
  }

  await StockMovement.create(
    {
      item_id: Number(item_id),
      item_type,
      store_id,
      quantity,
      type,
      created_by,
      reason,
      notes,
      reference_type,
      reference_id: reference_id || null,
      balance_after,
    },
    { transaction }
  );
}

// 🔹 MOVIMENTAÇÃO
export const movimentStock = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const newQty = await updateStock(data, transaction);

    await insertMovement(
      {
        ...data,
        balance_after: newQty,
      },
      transaction
    );

    await transaction.commit();

    return { message: 'Movimentação realizada com sucesso' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 🔥 TRANSFERÊNCIA (FUNCIONA PRA PRODUTOS E INSUMOS)
export const transferStock = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      from_store_id,
      to_store_id,
      items,
      item_type,
      notes,
      created_by = 1,
    } = data;

    if (!from_store_id || !to_store_id) {
      throw new Error('Lojas de origem e destino são obrigatórias');
    }

    if (Number(from_store_id) === Number(to_store_id)) {
      throw new Error('A loja de origem não pode ser igual à loja de destino');
    }

    if (!['PRODUCT', 'INSUMO'].includes(item_type)) {
      throw new Error('Tipo inválido');
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Nenhum item informado');
    }

    const transfer = await StockTransfer.create(
      {
        from_store_id,
        to_store_id,
        status: 'COMPLETED',
        created_by,
        confirmed_by: created_by,
        notes,
        confirmed_at: new Date(),
      },
      { transaction }
    );

    for (const item of items) {
      const itemId = Number(item.item_id);
      const quantity = Number(item.quantity);

      if (!itemId || !quantity || quantity <= 0) {
        throw new Error('Item inválido na transferência');
      }

      const originStock = await Stock.findOne({
        where: {
          item_id: itemId,
          item_type,
          store_id: from_store_id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!originStock || Number(originStock.quantity) < quantity) {
        throw new Error('Estoque insuficiente na origem');
      }

      const originNewQty = Number(originStock.quantity) - quantity;

      await originStock.update(
        {
          quantity: originNewQty,
        },
        { transaction }
      );

      let destStock = await Stock.findOne({
        where: {
          item_id: itemId,
          item_type,
          store_id: to_store_id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      let destNewQty = quantity;

      if (destStock) {
        destNewQty = Number(destStock.quantity) + quantity;

        await destStock.update(
          {
            quantity: destNewQty,
          },
          { transaction }
        );
      } else {
        destStock = await Stock.create(
          {
            store_id: to_store_id,
            item_id: itemId,
            item_type,
            quantity,
          },
          { transaction }
        );
      }

      await StockTransferItem.create(
        {
          transfer_id: transfer.id,
          item_id: itemId,
          item_type,
          quantity_sent: quantity,
          quantity_received: quantity,
        },
        { transaction }
      );

      await StockMovement.create(
        {
          item_id: itemId,
          item_type,
          store_id: from_store_id,
          type: 'OUT',
          quantity,
          reason: 'TRANSFERENCIA',
          notes,
          created_by,
          reference_type: 'STOCK_TRANSFER',
          reference_id: transfer.id,
          balance_after: originNewQty,
        },
        { transaction }
      );

      await StockMovement.create(
        {
          item_id: itemId,
          item_type,
          store_id: to_store_id,
          type: 'IN',
          quantity,
          reason: 'TRANSFERENCIA',
          notes,
          created_by,
          reference_type: 'STOCK_TRANSFER',
          reference_id: transfer.id,
          balance_after: destNewQty,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return {
      message: 'Transferência realizada com sucesso',
      transfer_id: transfer.id,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
