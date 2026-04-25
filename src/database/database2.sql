-- ================================
-- DATABASE
-- ================================
CREATE DATABASE IF NOT EXISTS estoke CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE estoke;

SET FOREIGN_KEY_CHECKS = 0;

-- ================================
-- DROP TABLES
-- ================================
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS stock_transfer_items;
DROP TABLE IF EXISTS stock_transfers;
DROP TABLE IF EXISTS stock_movements;
DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS product_insumos;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS app_config;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS stores;

SET FOREIGN_KEY_CHECKS = 1;

-- ================================
-- STORES
-- ================================
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- loja padrão
INSERT INTO stores (id, name, is_active) VALUES
(1, 'Loja Principal', 1);

-- ================================
-- USERS
-- ================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) DEFAULT NULL,
  email VARCHAR(150) DEFAULT NULL,
  password_hash TEXT DEFAULT NULL,
  role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
  store_id INT DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY email (email),
  KEY store_id (store_id),
  CONSTRAINT users_ibfk_1 FOREIGN KEY (store_id) REFERENCES stores(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- admin padrão
-- senha original do hash abaixo: admin
INSERT INTO users (id, name, email, password_hash, role, store_id, is_active) VALUES
(1, 'admin', 'admin@admin.com', '$2b$10$R0nzZeIW8IFAVQznxQhave8vxDbWczFroha5Ba4krjMwnB4w7x6RK', 'admin', 1, 1);

-- ================================
-- APP CONFIG
-- ================================
CREATE TABLE app_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_name VARCHAR(150) DEFAULT NULL,
  slogan VARCHAR(255) DEFAULT NULL,
  theme VARCHAR(50) DEFAULT 'light',
  logo_url TEXT DEFAULT NULL,
  primary_color VARCHAR(20) DEFAULT NULL,
  secondary_color VARCHAR(20) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- config inicial
INSERT INTO app_config (id, app_name, slogan, theme, logo_url, primary_color, secondary_color) VALUES
(1, 'Pastelaria do J', 'Gestão inteligente', 'dark', '/uploads/logos/logo-1774765223515.png', '#0f172a', '#22c55e');

-- ================================
-- CATEGORIES
-- ================================
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,

  UNIQUE KEY name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- categorias iniciais
INSERT INTO categories (id, name, is_active) VALUES
(2, 'Refrigerante', 1),
(7, 'Bebidas', 0),
(11, 'Pastéis', 1);

-- ================================
-- INSUMOS
-- ================================
CREATE TABLE insumos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) DEFAULT NULL,
  unit VARCHAR(50) DEFAULT NULL,
  min_stock DECIMAL(10,2) DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- insumos iniciais
INSERT INTO insumos (id, name, unit, min_stock, is_active) VALUES
(14, 'Queijo', 'kg', 3.00, 1),
(15, 'Tomate', 'kg', 2.00, 1);

-- ================================
-- PRODUCTS
-- ================================
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(50) DEFAULT NULL,
  unit VARCHAR(20) DEFAULT NULL,
  cost_price DECIMAL(10,2) DEFAULT NULL,
  sale_price DECIMAL(10,2) DEFAULT NULL,
  resale_price DECIMAL(10,2) DEFAULT 0.00,
  min_stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  category_id INT DEFAULT NULL,

  KEY fk_product_category (category_id),
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- produtos iniciais
INSERT INTO products (id, name, sku, unit, cost_price, sale_price, resale_price, min_stock, is_active, category_id) VALUES
(18, 'Pastel de Queijo', '001', 'und', 5.00, 15.00, 9.00, 10, 1, 2),
(19, 'Pastel2', '002', 'und', 5.00, 6.00, 7.00, 6, 1, 7);

-- ================================
-- PRODUCT INSUMOS
-- ================================
CREATE TABLE product_insumos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  insumo_id INT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY product_id (product_id),
  KEY insumo_id (insumo_id),
  CONSTRAINT product_insumos_ibfk_1 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT product_insumos_ibfk_2 FOREIGN KEY (insumo_id) REFERENCES insumos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- OBS: no backup havia vínculos antigos apontando para product_id/insumo_id inexistentes.
-- Eles foram removidos deste SQL base para evitar erro de chave estrangeira na importação.

-- ================================
-- STOCK
-- ================================
CREATE TABLE stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  item_id INT NOT NULL,
  item_type ENUM('PRODUCT', 'INSUMO') NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 0.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  KEY idx_store (store_id),
  KEY idx_item (item_id, item_type),
  CONSTRAINT fk_stock_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- estoque inicial
INSERT INTO stock (id, store_id, item_id, item_type, quantity) VALUES
(32, 1, 18, 'PRODUCT', 7.00),
(34, 1, 19, 'PRODUCT', 200.00),
(35, 1, 14, 'INSUMO', 705.00),
(36, 1, 15, 'INSUMO', 78.00);

-- ================================
-- STOCK MOVEMENTS
-- ================================
CREATE TABLE stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  type ENUM('IN', 'OUT', 'ADJUST') NOT NULL,
  quantity INT NOT NULL,
  reference_type VARCHAR(50) DEFAULT NULL,
  reference_id INT DEFAULT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  reason ENUM('COMPRA', 'VENDA', 'PERDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO', 'TRANSFERENCIA', 'PRODUCAO', 'CONSUMO_INTERNO') DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  balance_after INT DEFAULT NULL,
  item_id INT NOT NULL,
  item_type ENUM('PRODUCT', 'INSUMO') NOT NULL,

  KEY fk_mov_store (store_id),
  KEY fk_mov_user (created_by),
  KEY reference_id (reference_id),
  KEY idx_movements_item (item_id, item_type, store_id),
  CONSTRAINT fk_mov_store FOREIGN KEY (store_id) REFERENCES stores(id),
  CONSTRAINT fk_mov_user FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ================================
-- SALES
-- ================================
CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT DEFAULT NULL,
  total_amount DECIMAL(10,2) DEFAULT NULL,
  created_by INT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  KEY fk_sales_store (store_id),
  KEY fk_sales_user (created_by),
  CONSTRAINT fk_sales_store FOREIGN KEY (store_id) REFERENCES stores(id),
  CONSTRAINT fk_sales_user FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ================================
-- SALE ITEMS
-- ================================
CREATE TABLE sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT DEFAULT NULL,
  product_id INT DEFAULT NULL,
  quantity INT DEFAULT NULL,
  unit_price DECIMAL(10,2) DEFAULT NULL,
  price_type ENUM('normal', 'resale', 'custom') DEFAULT 'normal',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  KEY sale_id (sale_id),
  KEY product_id (product_id),
  CONSTRAINT sale_items_ibfk_1 FOREIGN KEY (sale_id) REFERENCES sales(id),
  CONSTRAINT sale_items_ibfk_2 FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ================================
-- STOCK TRANSFERS
-- ================================
CREATE TABLE stock_transfers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_store_id INT NOT NULL,
  to_store_id INT NOT NULL,
  status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  created_by INT NOT NULL,
  confirmed_by INT DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL DEFAULT NULL,

  KEY from_store_id (from_store_id),
  KEY to_store_id (to_store_id),
  KEY created_by (created_by),
  KEY confirmed_by (confirmed_by),
  CONSTRAINT stock_transfers_ibfk_1 FOREIGN KEY (from_store_id) REFERENCES stores(id),
  CONSTRAINT stock_transfers_ibfk_2 FOREIGN KEY (to_store_id) REFERENCES stores(id),
  CONSTRAINT stock_transfers_ibfk_3 FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT stock_transfers_ibfk_4 FOREIGN KEY (confirmed_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ================================
-- STOCK TRANSFER ITEMS
-- ================================
CREATE TABLE stock_transfer_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transfer_id INT NOT NULL,
  item_id INT DEFAULT NULL,
  quantity_sent INT NOT NULL,
  quantity_received INT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  item_type ENUM('PRODUCT', 'INSUMO') NOT NULL,

  KEY transfer_id (transfer_id),
  KEY product_id (item_id),
  CONSTRAINT stock_transfer_items_ibfk_1 FOREIGN KEY (transfer_id) REFERENCES stock_transfers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ================================
-- REFRESH TOKENS
-- ================================
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token TEXT NOT NULL,
  expires_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_refresh_user (user_id),
  CONSTRAINT refresh_tokens_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ================================
-- AUTO_INCREMENT BASE
-- ================================
ALTER TABLE stores AUTO_INCREMENT = 7;
ALTER TABLE users AUTO_INCREMENT = 3;
ALTER TABLE app_config AUTO_INCREMENT = 2;
ALTER TABLE categories AUTO_INCREMENT = 12;
ALTER TABLE insumos AUTO_INCREMENT = 16;
ALTER TABLE products AUTO_INCREMENT = 20;
ALTER TABLE product_insumos AUTO_INCREMENT = 2;
ALTER TABLE stock AUTO_INCREMENT = 48;
ALTER TABLE stock_movements AUTO_INCREMENT = 48;
ALTER TABLE sales AUTO_INCREMENT = 2;
ALTER TABLE sale_items AUTO_INCREMENT = 1;
ALTER TABLE stock_transfers AUTO_INCREMENT = 25;
ALTER TABLE stock_transfer_items AUTO_INCREMENT = 15;
ALTER TABLE refresh_tokens AUTO_INCREMENT = 67;
