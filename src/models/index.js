import Store from './Store.js';
import User from './User.js';
import Category from './Category.js';
import AppConfig from './AppConfig.js';
import Insumo from './Insumo.js';
import Product from './Product.js';
import ProductInsumo from './ProductInsumo.js';
import Stock from './Stock.js';
import StockMovement from './StockMovement.js';
import StockTransfer from './StockTransfer.js';
import StockTransferItem from './StockTransferItem.js';
import Sale from './Sale.js';
import SaleItem from './SaleItem.js';
import RefreshToken from './RefreshToken.js';

// Store / User
Store.hasMany(User, { foreignKey: 'store_id' });
User.belongsTo(Store, { foreignKey: 'store_id' });

// Category / Product
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

// Product / Insumo
Product.hasMany(ProductInsumo, { foreignKey: 'product_id' });
ProductInsumo.belongsTo(Product, { foreignKey: 'product_id' });

Insumo.hasMany(ProductInsumo, { foreignKey: 'insumo_id' });
ProductInsumo.belongsTo(Insumo, { foreignKey: 'insumo_id' });

// Sales
User.hasMany(Sale, { foreignKey: 'created_by' });
Sale.belongsTo(User, { foreignKey: 'created_by' });

Store.hasMany(Sale, { foreignKey: 'store_id' });
Sale.belongsTo(Store, { foreignKey: 'store_id' });

Sale.hasMany(SaleItem, { foreignKey: 'sale_id' });
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id' });

Product.hasMany(SaleItem, { foreignKey: 'product_id' });
SaleItem.belongsTo(Product, { foreignKey: 'product_id' });

// Refresh tokens
User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

// Stock
Store.hasMany(Stock, { foreignKey: 'store_id' });
Stock.belongsTo(Store, { foreignKey: 'store_id' });

// Stock movements
Store.hasMany(StockMovement, { foreignKey: 'store_id' });
StockMovement.belongsTo(Store, { foreignKey: 'store_id' });

User.hasMany(StockMovement, { foreignKey: 'created_by' });
StockMovement.belongsTo(User, { foreignKey: 'created_by' });

// Stock transfers
Store.hasMany(StockTransfer, {
  foreignKey: 'from_store_id',
  as: 'transfersSent',
});
Store.hasMany(StockTransfer, {
  foreignKey: 'to_store_id',
  as: 'transfersReceived',
});

StockTransfer.belongsTo(Store, {
  foreignKey: 'from_store_id',
  as: 'fromStore',
});

StockTransfer.belongsTo(Store, {
  foreignKey: 'to_store_id',
  as: 'toStore',
});

User.hasMany(StockTransfer, {
  foreignKey: 'created_by',
  as: 'createdTransfers',
});
User.hasMany(StockTransfer, {
  foreignKey: 'confirmed_by',
  as: 'confirmedTransfers',
});

StockTransfer.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'createdByUser',
});
StockTransfer.belongsTo(User, {
  foreignKey: 'confirmed_by',
  as: 'confirmedByUser',
});

StockTransfer.hasMany(StockTransferItem, { foreignKey: 'transfer_id' });
StockTransferItem.belongsTo(StockTransfer, { foreignKey: 'transfer_id' });

export {
  Store,
  User,
  Category,
  AppConfig,
  Insumo,
  Product,
  ProductInsumo,
  Stock,
  StockMovement,
  StockTransfer,
  StockTransferItem,
  Sale,
  SaleItem,
  RefreshToken,
};
