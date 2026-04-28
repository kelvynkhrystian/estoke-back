import sequelize from '../config/database.js';
import {
  Product,
  Category,
  ProductInsumo,
  Insumo,
  Stock,
} from '../models/index.js';

// ============================
// LISTAR TODOS (COM INSUMOS)
// ============================
export const getAllProducts = async () => {
  const products = await Product.findAll({
    include: [
      {
        model: Category,
        attributes: ['id', 'name'],
      },
      {
        model: ProductInsumo,
        include: [
          {
            model: Insumo,
            attributes: ['id', 'name', 'unit'],
          },
        ],
      },
    ],
  });

  return products;
};

// ============================
// BUSCAR POR ID
// ============================
export const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    include: [
      Category,
      {
        model: ProductInsumo,
        include: [Insumo],
      },
    ],
  });

  return product;
};

// ============================
// CRIAR
// ============================
export const createProduct = async (data) => {
  const t = await sequelize.transaction();

  try {
    const {
      name,
      sku,
      unit,
      cost_price,
      sale_price,
      resale_price,
      min_stock,
      category_id,
      is_active,
      insumos = [],
    } = data;

    // 🔥 1. cria produto
    const product = await Product.create(
      {
        name,
        sku,
        unit,
        cost_price: cost_price || 0,
        sale_price: sale_price || 0,
        resale_price: resale_price || 0,
        min_stock: min_stock || 0,
        category_id,
        is_active: is_active ?? true,
      },
      { transaction: t }
    );

    // 🔥 2. salva insumos
    if (insumos.length > 0) {
      const insumosData = insumos.map((item) => ({
        product_id: product.id,
        insumo_id: item.insumo_id,
        quantity: item.quantity,
      }));

      await ProductInsumo.bulkCreate(insumosData, { transaction: t });
    }

    // 🔥 3. cria estoque automático
    await Stock.create(
      {
        store_id: 1,
        item_id: product.id,
        item_type: 'PRODUCT',
        quantity: 0,
      },
      { transaction: t }
    );

    await t.commit();

    return product;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// ============================
// UPDATE
// ============================
export const updateProduct = async (id, data) => {
  const t = await sequelize.transaction();

  try {
    const product = await Product.findByPk(id);

    if (!product) throw new Error('Produto não encontrado');

    const {
      name,
      sku,
      unit,
      cost_price,
      sale_price,
      resale_price,
      min_stock,
      category_id,
      is_active,
      insumos = [],
    } = data;

    // 🔥 update produto
    await product.update(
      {
        name,
        sku,
        unit,
        cost_price,
        sale_price,
        resale_price,
        min_stock,
        category_id,
        is_active,
      },
      { transaction: t }
    );

    // 🔥 remove antigos
    await ProductInsumo.destroy({
      where: { product_id: id },
      transaction: t,
    });

    // 🔥 recria
    if (insumos.length > 0) {
      const insumosData = insumos.map((item) => ({
        product_id: id,
        insumo_id: item.insumo_id,
        quantity: item.quantity,
      }));

      await ProductInsumo.bulkCreate(insumosData, { transaction: t });
    }

    await t.commit();

    return product;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// ============================
// DELETE
// ============================
export const deleteProduct = async (id) => {
  const t = await sequelize.transaction();

  try {
    // 🔥 remove vínculos
    await ProductInsumo.destroy({
      where: { product_id: id },
      transaction: t,
    });

    await Stock.destroy({
      where: {
        item_id: id,
        item_type: 'PRODUCT',
      },
      transaction: t,
    });

    await Product.destroy({
      where: { id },
      transaction: t,
    });

    await t.commit();

    return { message: 'Produto deletado com sucesso' };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
