import sequelize from '../config/database.js';
import { Sale, SaleItem, Product, User } from '../models/index.js';

// CRIAR VENDA
export const createSale = async ({ items, store_id, created_by }) => {
  const transaction = await sequelize.transaction();

  try {
    const sale = await Sale.create(
      {
        store_id,
        created_by,
        total_amount: 0,
      },
      { transaction }
    );

    let totalAmount = 0;

    for (const item of items) {
      const { product_id, quantity, unit_price, price_type } = item;

      if (!product_id || !quantity || unit_price === undefined) {
        throw new Error('Item inválido');
      }

      totalAmount += Number(quantity) * Number(unit_price);

      await SaleItem.create(
        {
          sale_id: sale.id,
          product_id,
          quantity,
          unit_price,
          price_type: price_type || 'normal',
        },
        { transaction }
      );
    }

    await sale.update(
      {
        total_amount: totalAmount,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      message: 'Venda realizada com sucesso',
      sale_id: sale.id,
      total: totalAmount,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// LISTAR VENDAS
export const getSales = async (store_id, role) => {
  const where = {};

  if (role !== 'admin') {
    where.store_id = store_id;
  }

  const sales = await Sale.findAll({
    where,
    include: [
      {
        model: User,
        attributes: ['id', 'name'],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return sales;
};

// DETALHE DA VENDA
export const getSaleById = async (id, store_id, role) => {
  const where = { id };

  if (role !== 'admin') {
    where.store_id = store_id;
  }

  const sale = await Sale.findOne({
    where,
    include: [
      {
        model: SaleItem,
        include: [
          {
            model: Product,
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  });

  return sale;
};
