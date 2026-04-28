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

// Store
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
Sale.hasMany(SaleItem, { foreignKey: 'sale_id' });
SaleItem.belongsTo(Sale, { foreignKey: 'sale_id' });

Product.hasMany(SaleItem, { foreignKey: 'product_id' });
SaleItem.belongsTo(Product, { foreignKey: 'product_id' });

// Refresh tokens
User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

// Stock transfers
StockTransfer.hasMany(StockTransferItem, { foreignKey: 'transfer_id' });
StockTransferItem.belongsTo(StockTransfer, { foreignKey: 'transfer_id' });

// Stock movements
Store.hasMany(StockMovement, { foreignKey: 'store_id' });
StockMovement.belongsTo(Store, { foreignKey: 'store_id' });

User.hasMany(StockMovement, { foreignKey: 'created_by' });
StockMovement.belongsTo(User, { foreignKey: 'created_by' });

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
