-- ================================
-- DATABASE
-- ================================
CREATE DATABASE estoke;
USE estoke;

-- ================================
-- STORES
-- ================================
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- loja padrão
INSERT INTO stores (name) VALUES ('Loja Principal');

-- ================================
-- USERS
-- ================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password_hash TEXT,
  role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
  store_id INT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- admin padrão
INSERT INTO users (name, email, password_hash, role, store_id)
VALUES (
  'admin',
  'admin@gmail.com',
  '$2b$10$DFdNFmz5iM9QJJtk/vaQeuFvBzdr/MfBmQdPszdCGatiiM.6QEGJG',
  'admin',
  1
);

-- ================================
-- APP CONFIG
-- ================================
CREATE TABLE app_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_name VARCHAR(150),
  slogan VARCHAR(255),
  theme VARCHAR(50) DEFAULT 'light',
  logo_url TEXT,
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- config inicial opcional
INSERT INTO app_config (app_name, slogan, theme)
VALUES ('Estoke', 'Seu sistema de estoque', 'light');

-- ================================
-- CATEGORIES
-- ================================
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE (name)
);

-- ================================
-- PRODUCTS
-- ================================
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(50),
  unit VARCHAR(20),
  cost_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  min_stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  category_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ================================
-- STOCK
-- ================================
CREATE TABLE stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  store_id INT NOT NULL,
  quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE(product_id, store_id),

  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- ================================
-- STOCK MOVEMENTS
-- ================================
CREATE TABLE stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  store_id INT NOT NULL,
  type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
  quantity INT NOT NULL,
  reference_type VARCHAR(50),
  reference_id INT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ================================
-- SALES
-- ================================
CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  total_amount DECIMAL(10,2) DEFAULT 0,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ================================
-- SALE ITEMS
-- ================================
CREATE TABLE sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (sale_id) REFERENCES sales(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);



-- token
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token TEXT NOT NULL,
  expires_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id)
);


-- ================================
-- INDEXES (PERFORMANCE)
-- ================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_stock_product_store ON stock(product_id, store_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_sales_store ON sales(store_id);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_refresh_user ON refresh_tokens(user_id);