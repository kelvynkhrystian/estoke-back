-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 25/04/2026 às 07:46
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `estoke`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `app_config`
--

DROP TABLE IF EXISTS `app_config`;
CREATE TABLE `app_config` (
  `id` int(11) NOT NULL,
  `app_name` varchar(150) DEFAULT NULL,
  `slogan` varchar(255) DEFAULT NULL,
  `theme` varchar(50) DEFAULT 'light',
  `logo_url` text DEFAULT NULL,
  `primary_color` varchar(20) DEFAULT NULL,
  `secondary_color` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `app_config`
--

INSERT INTO `app_config` (`id`, `app_name`, `slogan`, `theme`, `logo_url`, `primary_color`, `secondary_color`, `created_at`, `updated_at`) VALUES
(1, 'Pastelaria do J', 'Gestão inteligente', 'dark', '/uploads/logos/logo-1774765223515.png', '#0f172a', '#22c55e', '2026-03-23 17:24:04', '2026-03-29 03:20:23');

-- --------------------------------------------------------

--
-- Estrutura para tabela `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`, `is_active`) VALUES
(2, 'Refrigerante', '2026-03-20 14:58:32', '2026-03-28 14:25:58', 1),
(7, 'Bebidas', '2026-03-27 16:54:56', '2026-03-28 14:57:54', 0),
(11, 'Pastéis', '2026-03-29 21:26:56', '2026-03-29 21:26:56', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `insumos`
--

DROP TABLE IF EXISTS `insumos`;
CREATE TABLE `insumos` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `min_stock` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `insumos`
--

INSERT INTO `insumos` (`id`, `name`, `unit`, `min_stock`, `is_active`, `created_at`) VALUES
(14, 'Queijo', 'kg', 3.00, 1, '2026-03-29 21:11:36'),
(15, 'Tomate', 'kg', 2.00, 1, '2026-03-29 21:11:45');

-- --------------------------------------------------------

--
-- Estrutura para tabela `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `resale_price` decimal(10,2) DEFAULT 0.00,
  `min_stock` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `unit`, `cost_price`, `sale_price`, `resale_price`, `min_stock`, `is_active`, `created_at`, `updated_at`, `category_id`) VALUES
(18, 'Pastel de Queijo', '001', 'und', 5.00, 15.00, 9.00, 10, 1, '2026-03-29 21:06:22', '2026-03-29 21:06:22', 2),
(19, 'Pastel2', '002', 'und', 5.00, 6.00, 7.00, 6, 1, '2026-03-29 21:11:25', '2026-03-29 21:11:25', 7);

-- --------------------------------------------------------

--
-- Estrutura para tabela `product_insumos`
--

DROP TABLE IF EXISTS `product_insumos`;
CREATE TABLE `product_insumos` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `insumo_id` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `product_insumos`
--

INSERT INTO `product_insumos` (`id`, `product_id`, `insumo_id`, `quantity`, `created_at`) VALUES
(1, 1, 3, 1.00, '2026-03-28 19:23:58');

-- --------------------------------------------------------

--
-- Estrutura para tabela `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` text NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(66, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidG9rZW5JZCI6IjU4MmYyNWU1LWNjMWItNGNjZi1hN2E2LTViMzliNmZjYTVjMiIsImlhdCI6MTc3NDg1MTEyNCwiZXhwIjoxNzc1NDU1OTI0fQ.TBmiTJ182FwbexiPVTy5c9zSwXFxAZLqKIgYXWpCIxA', '2026-04-06 03:12:04', '2026-03-30 03:12:04');

-- --------------------------------------------------------

--
-- Estrutura para tabela `sales`
--

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `sales`
--

INSERT INTO `sales` (`id`, `store_id`, `total_amount`, `created_by`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, NULL, '2026-03-20 15:36:21', '2026-03-20 15:36:21');

-- --------------------------------------------------------

--
-- Estrutura para tabela `sale_items`
--

DROP TABLE IF EXISTS `sale_items`;
CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `price_type` enum('normal','resale','custom') DEFAULT 'normal',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `stock`
--

DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_type` enum('PRODUCT','INSUMO') NOT NULL,
  `quantity` decimal(10,2) DEFAULT 0.00,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `stock`
--

INSERT INTO `stock` (`id`, `store_id`, `item_id`, `item_type`, `quantity`, `created_at`, `updated_at`) VALUES
(32, 1, 18, 'PRODUCT', 7.00, '2026-03-29 21:06:22', '2026-03-30 03:12:39'),
(34, 1, 19, 'PRODUCT', 200.00, '2026-03-29 21:11:25', '2026-03-30 03:13:27'),
(35, 1, 14, 'INSUMO', 705.00, '2026-03-29 21:11:36', '2026-03-30 02:50:18'),
(36, 1, 15, 'INSUMO', 78.00, '2026-03-29 21:11:45', '2026-03-30 02:50:04'),
(38, 2, 18, 'PRODUCT', 22.00, '2026-03-29 23:30:28', '2026-03-29 23:46:58'),
(45, 2, 14, 'INSUMO', 3.00, '2026-03-29 23:54:12', '2026-03-29 23:54:28'),
(46, 3, 18, 'PRODUCT', 24.00, '2026-03-30 02:00:18', '2026-03-30 03:12:39'),
(47, 2, 19, 'PRODUCT', 34.00, '2026-03-30 03:13:27', '2026-03-30 03:13:27');

-- --------------------------------------------------------

--
-- Estrutura para tabela `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
CREATE TABLE `stock_movements` (
  `id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `type` enum('IN','OUT','ADJUST') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reason` enum('COMPRA','VENDA','PERDA','AJUSTE_POSITIVO','AJUSTE_NEGATIVO','TRANSFERENCIA','PRODUCAO','CONSUMO_INTERNO') DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `balance_after` int(11) DEFAULT NULL,
  `item_id` int(11) NOT NULL,
  `item_type` enum('PRODUCT','INSUMO') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `store_id`, `type`, `quantity`, `reference_type`, `reference_id`, `created_by`, `created_at`, `updated_at`, `reason`, `notes`, `balance_after`, `item_id`, `item_type`) VALUES
(13, 1, 'IN', 44, 'MANUAL', NULL, 1, '2026-03-29 22:57:51', '2026-03-29 22:57:51', 'PRODUCAO', 'ok', 0, 0, 'PRODUCT'),
(14, 1, 'IN', 90, 'MANUAL', NULL, 1, '2026-03-29 23:04:22', '2026-03-29 23:04:22', 'PRODUCAO', '', 90, 0, 'PRODUCT'),
(15, 1, 'IN', 234, 'MANUAL', NULL, 1, '2026-03-29 23:04:56', '2026-03-29 23:04:56', 'AJUSTE_POSITIVO', 'ok', 234, 0, 'PRODUCT'),
(19, 1, 'IN', 33, 'MANUAL', NULL, 1, '2026-03-29 23:18:32', '2026-03-29 23:18:32', 'COMPRA', '', 33, 14, 'INSUMO'),
(20, 1, 'IN', 55, 'MANUAL', NULL, 1, '2026-03-29 23:18:43', '2026-03-29 23:18:43', 'PRODUCAO', '', 145, 18, 'PRODUCT'),
(21, 1, 'IN', 5, 'MANUAL', NULL, 1, '2026-03-29 23:19:11', '2026-03-29 23:19:11', 'PRODUCAO', '', 150, 18, 'PRODUCT'),
(22, 1, 'IN', 55, 'MANUAL', NULL, 1, '2026-03-29 23:19:30', '2026-03-29 23:19:30', 'COMPRA', '', 88, 14, 'INSUMO'),
(23, 1, 'IN', 55, 'MANUAL', NULL, 1, '2026-03-29 23:19:41', '2026-03-29 23:19:41', 'COMPRA', '', 143, 14, 'INSUMO'),
(24, 1, 'IN', 67, 'MANUAL', NULL, 1, '2026-03-29 23:19:51', '2026-03-29 23:19:51', 'COMPRA', '', 67, 15, 'INSUMO'),
(25, 1, 'OUT', 20, NULL, NULL, 1, '2026-03-29 23:30:28', '2026-03-29 23:30:28', '', '', 130, 18, 'PRODUCT'),
(26, 2, 'IN', 20, NULL, NULL, 1, '2026-03-29 23:30:28', '2026-03-29 23:30:28', '', '', 20, 18, 'PRODUCT'),
(27, 1, 'OUT', 30, NULL, NULL, 1, '2026-03-29 23:31:46', '2026-03-29 23:31:46', '', '', 100, 18, 'PRODUCT'),
(28, 2, 'IN', 30, NULL, NULL, 1, '2026-03-29 23:31:46', '2026-03-29 23:31:46', '', '', 20, 18, 'PRODUCT'),
(29, 1, 'OUT', 2, NULL, NULL, 1, '2026-03-29 23:46:58', '2026-03-29 23:46:58', '', '', NULL, 18, 'PRODUCT'),
(30, 2, 'IN', 2, NULL, NULL, 1, '2026-03-29 23:46:58', '2026-03-29 23:46:58', '', '', NULL, 18, 'PRODUCT'),
(31, 1, 'OUT', 2, NULL, NULL, 1, '2026-03-29 23:54:12', '2026-03-29 23:54:12', '', '', NULL, 14, 'INSUMO'),
(32, 2, 'IN', 2, NULL, NULL, 1, '2026-03-29 23:54:12', '2026-03-29 23:54:12', '', '', NULL, 14, 'INSUMO'),
(33, 1, 'OUT', 1, NULL, NULL, 1, '2026-03-29 23:54:28', '2026-03-29 23:54:28', '', '', NULL, 14, 'INSUMO'),
(34, 2, 'IN', 1, NULL, NULL, 1, '2026-03-29 23:54:28', '2026-03-29 23:54:28', '', '', NULL, 14, 'INSUMO'),
(35, 1, 'OUT', 23, NULL, NULL, 1, '2026-03-30 02:00:18', '2026-03-30 02:00:18', '', 'ok', NULL, 18, 'PRODUCT'),
(36, 3, 'IN', 23, NULL, NULL, 1, '2026-03-30 02:00:18', '2026-03-30 02:00:18', '', 'ok', NULL, 18, 'PRODUCT'),
(37, 1, 'IN', 343, 'MANUAL', NULL, 1, '2026-03-30 02:17:08', '2026-03-30 02:17:08', 'COMPRA', '', 483, 14, 'INSUMO'),
(38, 1, 'IN', 223, 'MANUAL', NULL, 1, '2026-03-30 02:40:51', '2026-03-30 02:40:51', 'COMPRA', '', 706, 14, 'INSUMO'),
(39, 1, 'IN', 332, 'MANUAL', NULL, 1, '2026-03-30 02:41:06', '2026-03-30 02:41:06', 'COMPRA', '', 407, 18, 'PRODUCT'),
(40, 1, 'IN', 1, 'MANUAL', NULL, 1, '2026-03-30 02:48:49', '2026-03-30 02:48:49', 'COMPRA', '', 408, 18, 'PRODUCT'),
(41, 1, 'OUT', 400, 'MANUAL', NULL, 1, '2026-03-30 02:49:06', '2026-03-30 02:49:06', 'PERDA', '', 8, 18, 'PRODUCT'),
(42, 1, 'IN', 11, 'MANUAL', NULL, 1, '2026-03-30 02:50:04', '2026-03-30 02:50:04', 'COMPRA', '', 78, 15, 'INSUMO'),
(43, 1, 'OUT', 1, 'MANUAL', NULL, 1, '2026-03-30 02:50:18', '2026-03-30 02:50:18', 'PERDA', '', 705, 14, 'INSUMO'),
(44, 1, 'OUT', 1, NULL, NULL, 1, '2026-03-30 03:12:39', '2026-03-30 03:12:39', '', '', NULL, 18, 'PRODUCT'),
(45, 3, 'IN', 1, NULL, NULL, 1, '2026-03-30 03:12:39', '2026-03-30 03:12:39', '', '', NULL, 18, 'PRODUCT'),
(46, 1, 'OUT', 34, NULL, NULL, 1, '2026-03-30 03:13:27', '2026-03-30 03:13:27', '', '', NULL, 19, 'PRODUCT'),
(47, 2, 'IN', 34, NULL, NULL, 1, '2026-03-30 03:13:27', '2026-03-30 03:13:27', '', '', NULL, 19, 'PRODUCT');

-- --------------------------------------------------------

--
-- Estrutura para tabela `stock_transfers`
--

DROP TABLE IF EXISTS `stock_transfers`;
CREATE TABLE `stock_transfers` (
  `id` int(11) NOT NULL,
  `from_store_id` int(11) NOT NULL,
  `to_store_id` int(11) NOT NULL,
  `status` enum('PENDING','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  `created_by` int(11) NOT NULL,
  `confirmed_by` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `confirmed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `stock_transfers`
--

INSERT INTO `stock_transfers` (`id`, `from_store_id`, `to_store_id`, `status`, `created_by`, `confirmed_by`, `notes`, `created_at`, `updated_at`, `confirmed_at`) VALUES
(1, 1, 2, '', 1, NULL, 'Transferência de estoque', '2026-03-29 17:12:42', '2026-03-29 17:12:42', NULL),
(3, 1, 2, 'COMPLETED', 1, NULL, '', '2026-03-29 23:30:28', '2026-03-29 23:30:28', NULL),
(5, 1, 2, 'COMPLETED', 1, NULL, '', '2026-03-29 23:31:46', '2026-03-29 23:31:46', NULL),
(13, 1, 2, 'COMPLETED', 1, NULL, '', '2026-03-29 23:46:58', '2026-03-29 23:46:58', NULL),
(16, 1, 2, 'COMPLETED', 1, NULL, '', '2026-03-29 23:54:12', '2026-03-29 23:54:12', NULL),
(17, 1, 2, 'COMPLETED', 1, NULL, '', '2026-03-29 23:54:28', '2026-03-29 23:54:28', NULL),
(18, 1, 3, 'COMPLETED', 1, NULL, 'ok', '2026-03-30 02:00:18', '2026-03-30 02:00:18', NULL),
(23, 1, 3, 'COMPLETED', 1, NULL, '', '2026-03-30 03:12:39', '2026-03-30 03:12:39', NULL),
(24, 1, 2, 'COMPLETED', 1, NULL, '', '2026-03-30 03:13:27', '2026-03-30 03:13:27', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `stock_transfer_items`
--

DROP TABLE IF EXISTS `stock_transfer_items`;
CREATE TABLE `stock_transfer_items` (
  `id` int(11) NOT NULL,
  `transfer_id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `quantity_sent` int(11) NOT NULL,
  `quantity_received` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `item_type` enum('PRODUCT','INSUMO') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `stock_transfer_items`
--

INSERT INTO `stock_transfer_items` (`id`, `transfer_id`, `item_id`, `quantity_sent`, `quantity_received`, `created_at`, `updated_at`, `item_type`) VALUES
(1, 1, 1, 5, 5, '2026-03-29 17:13:55', '2026-03-29 17:13:55', 'PRODUCT'),
(2, 1, 2, 3, 3, '2026-03-29 17:13:55', '2026-03-29 17:13:55', 'PRODUCT'),
(3, 3, 18, 20, 20, '2026-03-29 23:30:28', '2026-03-29 23:30:28', 'PRODUCT'),
(5, 5, 18, 30, 30, '2026-03-29 23:31:46', '2026-03-29 23:31:46', 'PRODUCT'),
(7, 13, 18, 2, 2, '2026-03-29 23:46:58', '2026-03-29 23:46:58', 'PRODUCT'),
(10, 16, 14, 2, 2, '2026-03-29 23:54:12', '2026-03-29 23:54:12', 'INSUMO'),
(11, 17, 14, 1, 1, '2026-03-29 23:54:28', '2026-03-29 23:54:28', 'INSUMO'),
(12, 18, 18, 23, 23, '2026-03-30 02:00:18', '2026-03-30 02:00:18', 'PRODUCT'),
(13, 23, 18, 1, 1, '2026-03-30 03:12:39', '2026-03-30 03:12:39', 'PRODUCT'),
(14, 24, 19, 34, 34, '2026-03-30 03:13:27', '2026-03-30 03:13:27', 'PRODUCT');

-- --------------------------------------------------------

--
-- Estrutura para tabela `stores`
--

DROP TABLE IF EXISTS `stores`;
CREATE TABLE `stores` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `stores`
--

INSERT INTO `stores` (`id`, `name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Loja Principal', 1, '2026-03-20 15:46:23', '2026-03-20 15:46:23'),
(2, 'loja2', 1, '2026-03-28 22:50:47', '2026-03-29 18:12:24'),
(3, 'loja3', 1, '2026-03-28 22:50:51', '2026-03-29 18:12:29');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password_hash` text DEFAULT NULL,
  `role` enum('admin','manager','employee') DEFAULT 'employee',
  `store_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `store_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@admin.com', '$2b$10$R0nzZeIW8IFAVQznxQhave8vxDbWczFroha5Ba4krjMwnB4w7x6RK', 'admin', 1, 1, '2026-03-19 16:45:03', '2026-03-28 14:05:47'),
(2, 'Kelvyn', 'kel@gmail.com', '$2b$10$W779uO6Do8AYcuPR5EsArOk17deBZ3kFgZOhCpP6OGh6VWc/nFfIK', 'employee', 1, 1, '2026-03-20 17:00:55', '2026-03-20 17:00:55');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `app_config`
--
ALTER TABLE `app_config`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Índices de tabela `insumos`
--
ALTER TABLE `insumos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product_category` (`category_id`);

--
-- Índices de tabela `product_insumos`
--
ALTER TABLE `product_insumos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `insumo_id` (`insumo_id`);

--
-- Índices de tabela `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Índices de tabela `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sales_store` (`store_id`),
  ADD KEY `fk_sales_user` (`created_by`);

--
-- Índices de tabela `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Índices de tabela `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_store` (`store_id`),
  ADD KEY `idx_item` (`item_id`,`item_type`);

--
-- Índices de tabela `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mov_store` (`store_id`),
  ADD KEY `fk_mov_user` (`created_by`),
  ADD KEY `reference_id` (`reference_id`),
  ADD KEY `idx_movements_item` (`item_id`,`item_type`,`store_id`);

--
-- Índices de tabela `stock_transfers`
--
ALTER TABLE `stock_transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_store_id` (`from_store_id`),
  ADD KEY `to_store_id` (`to_store_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `confirmed_by` (`confirmed_by`);

--
-- Índices de tabela `stock_transfer_items`
--
ALTER TABLE `stock_transfer_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transfer_id` (`transfer_id`),
  ADD KEY `product_id` (`item_id`);

--
-- Índices de tabela `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `store_id` (`store_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `app_config`
--
ALTER TABLE `app_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `insumos`
--
ALTER TABLE `insumos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de tabela `product_insumos`
--
ALTER TABLE `product_insumos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de tabela `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de tabela `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de tabela `stock_transfers`
--
ALTER TABLE `stock_transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de tabela `stock_transfer_items`
--
ALTER TABLE `stock_transfer_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `stores`
--
ALTER TABLE `stores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Restrições para tabelas `product_insumos`
--
ALTER TABLE `product_insumos`
  ADD CONSTRAINT `product_insumos_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_insumos_ibfk_2` FOREIGN KEY (`insumo_id`) REFERENCES `insumos` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Restrições para tabelas `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `fk_sales_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  ADD CONSTRAINT `fk_sales_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Restrições para tabelas `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
  ADD CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Restrições para tabelas `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `fk_stock_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `fk_mov_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  ADD CONSTRAINT `fk_mov_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `stock_movements_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  ADD CONSTRAINT `stock_movements_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Restrições para tabelas `stock_transfers`
--
ALTER TABLE `stock_transfers`
  ADD CONSTRAINT `stock_transfers_ibfk_1` FOREIGN KEY (`from_store_id`) REFERENCES `stores` (`id`),
  ADD CONSTRAINT `stock_transfers_ibfk_2` FOREIGN KEY (`to_store_id`) REFERENCES `stores` (`id`),
  ADD CONSTRAINT `stock_transfers_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `stock_transfers_ibfk_4` FOREIGN KEY (`confirmed_by`) REFERENCES `users` (`id`);

--
-- Restrições para tabelas `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
