-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2025 at 02:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_detail`
--

CREATE TABLE `account_detail` (
  `detail_id` int(11) NOT NULL,
  `account_in` int(11) DEFAULT NULL,
  `account_out` int(11) DEFAULT NULL,
  `detail_balance` decimal(15,2) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `account_detail`
--

INSERT INTO `account_detail` (`detail_id`, `account_in`, `account_out`, `detail_balance`, `description`, `created_at`, `updated_at`, `deleted_at`) VALUES
(2, 2, 4, 50.00, 'my love', '2025-01-28 06:23:45', '2025-01-28 06:23:45', '0000-00-00 00:00:00'),
(10, 2, 4, 5.00, 'ys', '2025-01-28 06:52:54', '2025-01-28 06:52:54', '0000-00-00 00:00:00'),
(11, 2, 4, 5.00, NULL, '2025-01-28 06:54:25', '2025-01-28 06:54:25', '0000-00-00 00:00:00'),
(12, 4, 2, 15.00, 'my love', '2025-01-28 06:55:21', '2025-01-28 06:55:21', '0000-00-00 00:00:00'),
(13, 2, 5, 10.00, 'k', '2025-01-28 07:06:27', '2025-01-28 07:06:27', '0000-00-00 00:00:00'),
(14, 2, 5, 10.00, '', '2025-01-28 07:23:09', '2025-01-28 07:23:09', '0000-00-00 00:00:00'),
(15, 2, NULL, 10.00, 'nakry i want to pay', '2025-01-28 07:39:46', '2025-01-28 07:39:46', '0000-00-00 00:00:00'),
(16, 2, NULL, 60.00, '', '2025-01-28 07:40:45', '2025-01-28 07:40:45', '0000-00-00 00:00:00'),
(17, 4, 5, 10.00, '', '2025-01-28 07:41:44', '2025-01-28 07:41:44', '0000-00-00 00:00:00'),
(18, 2, 5, 10.00, '', '2025-01-28 17:58:40', '2025-01-28 17:58:40', '0000-00-00 00:00:00'),
(19, 5, 2, 10.00, '', '2025-01-28 18:00:08', '2025-01-28 18:00:08', '0000-00-00 00:00:00'),
(20, 5, 2, 50.00, '', '2025-02-13 15:51:39', '2025-02-13 15:51:39', '0000-00-00 00:00:00');

--
-- Triggers `account_detail`
--
DELIMITER $$
CREATE TRIGGER `after_account_detail_insert` AFTER INSERT ON `account_detail` FOR EACH ROW BEGIN
    -- Deduct the amount from the account_out balance
    UPDATE acount
    SET balance = balance - NEW.detail_balance
    WHERE id = NEW.account_out;

    -- Add the amount to the account_in balance
    UPDATE acount
    SET balance = balance + NEW.detail_balance
    WHERE id = NEW.account_in;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_account_detail_update` BEFORE UPDATE ON `account_detail` FOR EACH ROW BEGIN
    -- Deduct the amount from the account_out balance
    UPDATE `acount`
    SET `balance` = `balance` - NEW.`detail_balance`
    WHERE `id` = NEW.`account_out`;

    -- Add the amount to the account_in balance
    UPDATE `acount`
    SET `balance` = `balance` + NEW.`detail_balance`
    WHERE `id` = NEW.`account_in`;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `acount`
--

CREATE TABLE `acount` (
  `id` int(11) NOT NULL,
  `acc_names` varchar(255) DEFAULT NULL,
  `bank_id` int(11) DEFAULT NULL,
  `acc_num` varchar(255) DEFAULT NULL,
  `balance` decimal(8,2) DEFAULT 0.00,
  `description` mediumtext DEFAULT NULL,
  `user_at` mediumtext DEFAULT NULL,
  `user_update` mediumtext DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `delete_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `status` enum('off','on') NOT NULL DEFAULT 'on'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `acount`
--

INSERT INTO `acount` (`id`, `acc_names`, `bank_id`, `acc_num`, `balance`, `description`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`, `status`) VALUES
(2, 'Nakry', 2, '111220008776', 22.29, NULL, 'admin', 'admin', '2025-02-16 04:54:46', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'on'),
(4, 'ស្រីស្អាត', 3, '1000223888331', 110.00, 'លក់លុះខ្ស័យ', 'admin', 'admin', '2025-01-29 02:30:11', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'off'),
(5, 'កញ្ញាបុផ្ផាស្រស់', 6, '1100093773733', 2020.00, 'លក់ទាល់តែអស់បានឈប់', 'admin', 'user', '2025-02-13 15:51:39', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'on');

-- --------------------------------------------------------

--
-- Table structure for table `bank`
--

CREATE TABLE `bank` (
  `id` int(11) NOT NULL,
  `bank_names` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `delete_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bank`
--

INSERT INTO `bank` (`id`, `bank_names`, `created_at`, `update_at`, `delete_at`) VALUES
(2, 'ប្រាសាក់', '2024-10-18 13:33:45', '2024-10-18 13:33:45', '0000-00-00 00:00:00'),
(3, 'អម្រឹត', '2024-10-18 14:35:00', '2024-10-18 14:35:00', '0000-00-00 00:00:00'),
(4, 'Vatanac', '2024-10-18 14:38:10', '2024-10-18 14:38:10', '0000-00-00 00:00:00'),
(6, 'PPCBank', '2024-10-18 14:41:49', '2024-10-18 14:41:49', '0000-00-00 00:00:00'),
(7, 'ABA', '2024-10-18 14:48:56', '2024-10-18 14:48:56', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `brand_names` varchar(255) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `brand_names`, `description`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'LV', 'ថ្មី', '2024-10-18 04:25:59', '2024-10-18 04:25:59', NULL),
(4, 'Gatsby', '', '2024-10-18 05:17:03', '2024-10-18 05:17:20', NULL),
(5, 'ភេសជ្ជៈ', '', '2024-10-23 05:55:39', '2024-10-23 05:56:23', NULL),
(6, 'ទឹកអប់', '', '2024-10-23 05:57:19', '2024-10-23 06:02:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `cat_names` varchar(255) DEFAULT NULL,
  `detail` mediumtext DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `cat_names`, `detail`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'ក្រែម', '2', '2024-10-16 06:34:15', '2024-10-16 08:33:39', NULL),
(4, 'ស្រាបៀដប', '1', '2024-10-16 08:16:37', '2024-10-23 05:25:20', NULL),
(5, 'ស្ព្រាយបាញ់ខ្លួន', '1', '2024-10-16 08:17:01', '2024-10-17 15:47:18', NULL),
(7, 'ឡេលាបខ្លួន', '', '2024-10-16 08:24:35', '2024-10-16 08:42:23', NULL),
(8, 'ស្រាបៀកំប៉ុង', 'មានរស់ជាតិឆ្ងុយខ្ងាញ់', '2024-10-16 08:41:32', '2024-10-23 09:20:42', NULL),
(9, NULL, NULL, '2024-10-18 05:14:37', '2024-10-18 05:14:37', NULL),
(11, 'Frute', '', '2024-12-29 04:06:30', '2024-12-29 04:06:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cost`
--

CREATE TABLE `cost` (
  `id` int(11) NOT NULL,
  `cost_type_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `tax` int(10) DEFAULT 0,
  `price` int(10) DEFAULT 0,
  `payment` int(10) DEFAULT 0,
  `dob` date DEFAULT NULL,
  `decription` text DEFAULT NULL,
  `interval` int(11) DEFAULT NULL,
  `interval_type` varchar(10) DEFAULT NULL,
  `user_at` mediumtext DEFAULT NULL,
  `user_update` mediumtext DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `delete_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cost`
--

INSERT INTO `cost` (`id`, `cost_type_id`, `account_id`, `tax`, `price`, `payment`, `dob`, `decription`, `interval`, `interval_type`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`) VALUES
(13, 3, NULL, 10, 200, 200, '2024-12-17', NULL, 1, 'ខែ', 'admin', 'admin', '2024-12-17 07:26:19', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 3, NULL, 0, 10, 10, '2024-12-18', NULL, 1, 'ថ្ងៃ', 'admin', 'admin', '2025-01-31 16:17:07', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 1, NULL, 1, 10, 10, '2024-12-17', NULL, 1, 'ថ្ងៃ', 'admin', 'admin', '2024-12-17 08:01:51', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 2, 5, 1, 33, 3, '2025-02-05', NULL, 1, 'ថ្ងៃ', 'admin', 'admin', '2025-02-04 16:56:49', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 2, NULL, 0, 1200000, 0, '2025-01-06', NULL, 1, 'ឆ្នាំ', 'admin', 'admin', '2025-01-30 04:59:04', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `cost_type`
--

CREATE TABLE `cost_type` (
  `id` int(11) NOT NULL,
  `type_names` varchar(255) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `delete_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cost_type`
--

INSERT INTO `cost_type` (`id`, `type_names`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'បង់ភ្លើង', '2024-10-20 05:02:12', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'ថ្លៃសម្រាម', '2024-10-20 05:11:34', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'ថ្លៃទឹក', '2024-10-20 05:03:28', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `currency`
--

CREATE TABLE `currency` (
  `id` int(11) NOT NULL,
  `us` decimal(10,2) NOT NULL,
  `khr` decimal(10,2) NOT NULL,
  `thb` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `currency`
--

INSERT INTO `currency` (`id`, `us`, `khr`, `thb`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1.00, 4100.00, 130.00, '2024-12-06 02:27:01', '2024-12-06 02:41:07', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `currency_rates`
--

CREATE TABLE `currency_rates` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `rate` decimal(10,4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `currency_rates`
--

INSERT INTO `currency_rates` (`id`, `name`, `rate`, `created_at`, `updated_at`) VALUES
(1, 'KHR', 4200.0000, '2024-12-06 02:52:31', '2025-02-15 04:24:36'),
(2, 'THB', 120.0000, '2024-12-06 02:52:31', '2024-12-06 04:41:57'),
(3, 'USD', 1.0000, '2024-12-06 02:52:31', '2024-12-06 04:14:47');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `contect_type` enum('ផ្ទាល់ខ្លួន','អជីវកម្ម') DEFAULT 'ផ្ទាល់ខ្លួន',
  `group_id` int(11) DEFAULT NULL,
  `contect_phone` varchar(20) DEFAULT NULL,
  `mobile_phone` varchar(20) DEFAULT NULL,
  `business_names` varchar(255) DEFAULT NULL,
  `full_names` varchar(255) DEFAULT NULL,
  `half_names` varchar(255) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `user_at` text DEFAULT NULL,
  `user_update` text DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `contect_type`, `group_id`, `contect_phone`, `mobile_phone`, `business_names`, `full_names`, `half_names`, `description`, `email`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'ផ្ទាល់ខ្លួន', NULL, NULL, '0965752080', NULL, 'Walk-In Customer', NULL, 'ហាមលុប( Walk-In Customer​)', NULL, '', '', '2024-10-14 03:50:08', '2024-10-24 17:53:20', NULL),
(3, 'អជីវកម្ម', NULL, '123456789', NULL, 'ហាងបាយ', NULL, NULL, NULL, 'nakry@example.com', 'admin', 'admin', '2024-10-21 15:12:06', '2024-10-21 17:54:35', NULL),
(8, 'ផ្ទាល់ខ្លួន', 2, '9654322', '098765', NULL, 'nakry', 'Vp', 'yes', 'lv@gmail.com', 'admin', 'User', '2024-10-21 17:34:12', '2025-02-05 06:59:33', NULL),
(9, 'អជីវកម្ម', NULL, '០០៩៩៨៧៦៦៥៥៤', NULL, 'ហាងលក់កុំព្យូទ័រ', NULL, NULL, NULL, NULL, 'admin', NULL, '2024-10-21 17:34:49', '2024-10-21 17:34:49', NULL),
(10, 'ផ្ទាល់ខ្លួន', 3, NULL, '0098765431234', '', 'KAKA FoodBall', 'kf', NULL, NULL, 'admin', 'admin', '2024-10-25 10:10:43', '2024-11-12 05:57:50', NULL),
(11, 'ផ្ទាល់ខ្លួន', NULL, NULL, '០៩៦៥៦៧៥២០៨០', '', 'មុត ណាគ្រី', NULL, NULL, NULL, 'admin', 'User', '2024-12-17 09:28:43', '2025-02-10 13:52:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_payment`
--

CREATE TABLE `customer_payment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_detail_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `balance_usd` decimal(10,2) DEFAULT 0.00,
  `cash_change` decimal(10,2) DEFAULT 0.00,
  `type_currency` enum('usd','khr','thb') DEFAULT 'usd',
  `description` text CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `user_at` text DEFAULT NULL,
  `user_update` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_payment`
--

INSERT INTO `customer_payment` (`id`, `customer_id`, `order_detail_id`, `account_id`, `balance`, `balance_usd`, `cash_change`, `type_currency`, `description`, `user_at`, `user_update`, `created_at`, `updated_at`) VALUES
(2, 11, 12, NULL, 1.00, 0.00, 1.00, 'usd', 'Payment for order 12', 'admin', NULL, '2025-02-07 06:48:27', '2025-02-07 06:51:39'),
(4, 10, 10, NULL, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 15:30:40', '2025-02-14 15:30:40'),
(5, 10, 10, NULL, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 15:33:39', '2025-02-14 15:33:39'),
(6, 10, 10, NULL, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 15:46:55', '2025-02-14 15:46:55'),
(7, 10, 10, 2, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 15:50:47', '2025-02-14 15:50:47'),
(8, 10, 10, 2, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 16:02:26', '2025-02-14 16:02:26'),
(9, 10, 10, 2, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 16:27:03', '2025-02-14 16:27:03'),
(10, 10, 10, NULL, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 16:28:59', '2025-02-14 16:28:59'),
(11, 10, 10, 2, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 16:30:39', '2025-02-14 16:30:39'),
(13, 1, 13, NULL, 1.00, 1.00, 1.00, 'usd', '', 'admin', NULL, '2025-02-14 18:27:15', '2025-02-14 18:27:15'),
(14, 10, 10, 2, 5.00, 0.14, 35.00, 'thb', '', 'admin', NULL, '2025-02-15 08:24:42', '2025-02-15 08:24:42');

--
-- Triggers `customer_payment`
--
DELIMITER $$
CREATE TRIGGER `	insert_customer_payment_update_balance_on_account` AFTER INSERT ON `customer_payment` FOR EACH ROW BEGIN
    UPDATE acount
    SET balance = balance + NEW.balance_usd
    WHERE id = NEW.account_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_customer_payment_update` BEFORE UPDATE ON `customer_payment` FOR EACH ROW BEGIN
    -- Adjust balance_amount in order_detail when customer_payment is updated
    UPDATE order_detail 
    SET balance_amount = balance_amount - OLD.balance + NEW.balance
    WHERE id = NEW.order_detail_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_customer_payment_update_balance_amount_on_order_detail` BEFORE INSERT ON `customer_payment` FOR EACH ROW BEGIN
    UPDATE order_detail 
    SET balance_amount = balance_amount + NEW.balance
    WHERE id = NEW.order_detail_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `edit_stock`
--

CREATE TABLE `edit_stock` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `by_date` date DEFAULT NULL,
  `user_at` text DEFAULT NULL,
  `user_update` text DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group_customer`
--

CREATE TABLE `group_customer` (
  `id` int(11) NOT NULL,
  `group_names` varchar(255) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT 0.00,
  `detail` mediumtext DEFAULT NULL,
  `user_at` mediumtext DEFAULT NULL,
  `user_update` mediumtext DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `group_customer`
--

INSERT INTO `group_customer` (`id`, `group_names`, `discount`, `detail`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'មិនមាន', 0.00, 'ហាមលុប', 'supperadmin', NULL, '2024-10-14 03:46:27', '2024-10-21 09:04:14', NULL),
(2, 'VIP', 10.00, NULL, 'admin', 'admin', '2024-10-21 08:56:42', '2025-02-05 07:24:49', NULL),
(3, 'Happy Student', 1.00, 'លកើដោយណាគ្រី', 'admin', 'admin', '2024-10-21 08:58:24', '2025-02-06 13:38:59', NULL),
(4, 'Foodball', 2.00, '', 'admin', 'admin', '2024-10-21 13:49:31', '2024-10-21 13:55:15', NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `monthly_summary`
-- (See below for the actual view)
--
CREATE TABLE `monthly_summary` (
`month` int(2)
,`purchase_total` decimal(32,2)
,`order_total` decimal(30,2)
,`cost_total` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `order_detail_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `date_by` datetime DEFAULT NULL,
  `user_at` mediumtext DEFAULT NULL,
  `user_update` text DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `customer_id`, `order_detail_id`, `product_id`, `qty`, `price`, `discount`, `total`, `date_by`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`) VALUES
(11, 1, 8, 1, 2, 6.00, 0.50, 11.00, NULL, 'admin', NULL, '2025-02-06 13:27:03', '2025-02-06 13:27:03', NULL),
(12, 1, 9, 2, 1, 6.00, 1.00, 5.00, NULL, 'admin', NULL, '2025-02-06 13:30:06', '2025-02-06 13:30:06', NULL),
(13, 10, 10, 2, 1, 6.00, 1.00, 5.00, NULL, 'admin', NULL, '2025-02-06 15:17:56', '2025-02-06 15:17:56', NULL),
(14, 1, 11, 1, 2, 6.00, 0.50, 11.00, NULL, 'admin', NULL, '2025-02-06 15:39:40', '2025-02-06 15:39:40', NULL),
(15, 11, 12, 1, 2, 6.00, 0.50, 11.00, NULL, 'admin', NULL, '2025-02-07 04:27:57', '2025-02-07 04:27:57', NULL),
(16, 1, 13, 12, 2, 1.79, 1.50, 0.58, NULL, 'admin', NULL, '2025-02-13 06:45:47', '2025-02-13 06:45:47', NULL),
(17, 1, 13, 11, 2, 1.50, 0.00, 3.00, NULL, 'admin', NULL, '2025-02-13 06:45:48', '2025-02-13 06:45:48', NULL),
(18, 1, 13, 9, 3, 30.00, 0.00, 90.00, NULL, 'admin', NULL, '2025-02-13 06:45:48', '2025-02-13 06:45:48', NULL),
(19, 1, 14, 12, 1, 1.79, 1.50, 0.29, NULL, 'admin', NULL, '2025-02-14 04:11:34', '2025-02-14 04:11:34', NULL);

--
-- Triggers `order`
--
DELIMITER $$
CREATE TRIGGER `after_order_insert_cut_qty_in_products` AFTER INSERT ON `order` FOR EACH ROW BEGIN
    -- Update the quantity of the product in the products table
    UPDATE products
    SET qty = qty - NEW.qty
    WHERE id = NEW.product_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `paymenttype_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `total_amount_dola` decimal(8,2) NOT NULL DEFAULT 0.00,
  `balance_amount` decimal(10,2) DEFAULT 0.00,
  `changes` decimal(10,2) DEFAULT 0.00,
  `status` varchar(50) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT 0.00,
  `type_currency` enum('usd','khr','thb') NOT NULL DEFAULT 'usd',
  `user_at` mediumtext DEFAULT NULL,
  `user_update` mediumtext DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`id`, `account_id`, `paymenttype_id`, `total_amount`, `total_amount_dola`, `balance_amount`, `changes`, `status`, `discount`, `type_currency`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`, `description`) VALUES
(8, 5, 4, 11.00, 11.00, 11.00, 1.00, NULL, 0.00, 'usd', 'admin', NULL, '2025-02-06 13:27:03', '2025-02-14 15:29:17', NULL, ''),
(9, NULL, NULL, 21000.00, 5.00, 21000.00, 4200.00, NULL, 0.00, 'khr', 'admin', NULL, '2025-02-06 13:30:06', '2025-02-14 15:29:13', NULL, ''),
(10, NULL, NULL, 140.00, 4.00, 135.00, 35.00, NULL, 1.00, 'thb', 'admin', NULL, '2025-02-06 15:17:56', '2025-02-15 08:24:42', NULL, ''),
(11, NULL, NULL, 11.00, 11.00, 11.00, 1.00, NULL, 0.00, 'usd', 'admin', NULL, '2025-02-06 15:39:40', '2025-02-14 15:28:57', NULL, ''),
(12, NULL, NULL, 11.00, 11.00, 6.00, 1.00, NULL, 0.00, 'usd', 'admin', NULL, '2025-02-07 04:27:57', '2025-02-14 15:23:15', NULL, 'នៅជុំពាក់'),
(13, NULL, NULL, 93.58, 93.58, 93.58, 1.00, NULL, 1.00, 'usd', 'admin', NULL, '2025-02-13 06:45:47', '2025-02-14 18:27:15', NULL, ''),
(14, NULL, NULL, 0.29, 0.29, 0.29, 1.00, NULL, 0.00, 'usd', 'admin', NULL, '2025-02-14 04:11:34', '2025-02-14 15:29:19', NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `order_repay`
--

CREATE TABLE `order_repay` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_repay_detail_id` int(11) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `order_repay`
--

INSERT INTO `order_repay` (`id`, `product_id`, `order_repay_detail_id`, `qty`, `price`, `discount`, `total`, `description`) VALUES
(6, 2, 8, 1, 6.00, 1.00, 5.00, 'នៅដូចដើម');

--
-- Triggers `order_repay`
--
DELIMITER $$
CREATE TRIGGER `update_product_qty_after_order` AFTER INSERT ON `order_repay` FOR EACH ROW BEGIN
    -- Update the quantity of the product in the products table
    UPDATE products
    SET qty = qty + NEW.qty
    WHERE id = NEW.product_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `order_repay_detail`
--

CREATE TABLE `order_repay_detail` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `balance_payment` decimal(10,2) NOT NULL,
  `user_at` varchar(255) DEFAULT NULL,
  `user_update` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `order_repay_detail`
--

INSERT INTO `order_repay_detail` (`id`, `customer_id`, `account_id`, `payment_date`, `total_amount`, `discount_amount`, `balance_payment`, `user_at`, `user_update`, `created_at`, `updated_at`) VALUES
(8, 1, NULL, '2025-02-14', 5.00, 0.00, 5.00, 'admin', NULL, '2025-02-14 04:02:47', '2025-02-14 04:02:47');

-- --------------------------------------------------------

--
-- Table structure for table `payment_type`
--

CREATE TABLE `payment_type` (
  `id` int(11) NOT NULL,
  `pay_manes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `payment_type`
--

INSERT INTO `payment_type` (`id`, `pay_manes`, `create_at`, `updated_at`) VALUES
(1, 'សាច់ប្រាក់', '2024-10-29 03:29:44', '2024-10-29 03:32:37'),
(2, 'ជាមុខ', '2024-10-29 03:35:31', '2024-10-29 03:35:31'),
(4, 'កាត', '2024-10-29 03:41:09', '2024-10-29 03:41:09');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `pro_names` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `discount` decimal(8,2) DEFAULT 0.00,
  `note_qty` int(11) NOT NULL DEFAULT 1,
  `mg_stock` enum('disable','enable') NOT NULL DEFAULT 'enable',
  `cost_price` decimal(10,2) DEFAULT NULL,
  `included_tax` enum('Rank','AB','Big Rate','none','') DEFAULT NULL,
  `include_tax` decimal(8,2) NOT NULL DEFAULT 0.00,
  `exclude_tax` decimal(10,2) DEFAULT NULL,
  `profit` decimal(10,2) DEFAULT NULL,
  `expiry` date DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `type_of_tax` enum('ផ្ដាច់មុខ','រួមបញ្ចូលគ្នា','none') DEFAULT 'ផ្ដាច់មុខ',
  `product_type` enum('មួយ','អថេរ','បណ្ដុំ') DEFAULT 'មួយ',
  `image` varchar(255) DEFAULT NULL,
  `barcode` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `user_at` mediumtext DEFAULT NULL,
  `user_update` text DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL,
  `barcode_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `pro_names`, `category_id`, `brand_id`, `unit_id`, `qty`, `stock`, `discount`, `note_qty`, `mg_stock`, `cost_price`, `included_tax`, `include_tax`, `exclude_tax`, `profit`, `expiry`, `status`, `type_of_tax`, `product_type`, `image`, `barcode`, `description`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`, `barcode_type`) VALUES
(1, 'ស្រាបៀABCដប', 1, 1, 1, 10, 12, 0.50, 5, 'disable', 3.00, NULL, 0.00, 7.00, 1.00, NULL, 'inactive', 'ផ្ដាច់មុខ', 'មួយ', '1729669329976_download (10).jpg', 'A062512875', NULL, 'admin', 'admin', '2024-10-23 07:25:20', '2025-02-25 13:47:52', NULL, NULL),
(2, 'ការហ្វេ', 1, 1, 1, 2, 3, 1.00, 1, 'enable', 2.50, NULL, 0.00, 6.00, 1.00, NULL, 'active', 'រួមបញ្ចូលគ្នា', 'មួយ', '1729668526878_coffee.jpg', 'B062512875', NULL, 'admin', 'admin', '2024-10-23 07:28:46', '2025-02-25 07:46:00', NULL, NULL),
(3, 'ក្រែម', 1, 5, 1, 5, 6, 0.50, 10, 'enable', 10.00, NULL, 0.00, 12.00, 2.00, '2024-10-25', 'inactive', 'ផ្ដាច់មុខ', 'បណ្ដុំ', '1729704000068_images (1).jpg', 'B012875', NULL, 'admin', NULL, '2024-10-23 17:20:00', '2025-02-25 07:45:28', NULL, NULL),
(5, 'ឆាក្ដៅសាច់ទា', 1, 4, 2, 3, 10, 0.00, 31, 'enable', 11.90, NULL, 0.00, 31.00, 1.10, NULL, 'inactive', 'ផ្ដាច់មុខ', 'អថេរ', '1729710113801_images (13).jpg', 'C06275', NULL, 'admin', 'admin1', '2024-10-23 17:35:48', '2025-02-15 03:59:44', NULL, NULL),
(6, 'ប្រហុកអាំង', 11, 5, 4, 3, 4, 0.00, 10, 'enable', 1.00, NULL, 0.00, 1.50, 0.50, '2026-06-24', 'inactive', 'រួមបញ្ចូលគ្នា', 'មួយ', '1738294086034_images (16).jpg', 'D00012875', 'yes', 'admin', 'admin', '2024-10-23 18:01:51', '2025-02-25 07:46:13', NULL, NULL),
(7, 'ត្រី', 8, 5, 2, 1, 5, 1.20, 1, 'enable', 10.00, NULL, 0.00, 13.00, 3.00, NULL, 'inactive', 'ផ្ដាច់មុខ', 'មួយ', '1729741995726_images (17).jpg', 'F00512875', '', 'admin', 'admin', '2024-10-23 19:08:08', '2025-02-09 14:08:22', NULL, NULL),
(8, 'Pizza', 1, 1, 1, 0, 0, 3.00, 1, 'enable', 2.50, NULL, 0.00, 4.00, 1.00, '2024-11-01', 'inactive', 'រួមបញ្ចូលគ្នា', 'មួយ', NULL, 'G00012875', 'null', 'admin', NULL, '2024-10-28 06:59:30', '2025-02-09 07:09:22', NULL, NULL),
(9, 'ABC', 4, 5, 3, 4, 6, 0.00, 1, 'disable', 30.00, NULL, 0.00, 35.00, 8.00, '2025-01-31', 'active', 'រួមបញ្ចូលគ្នា', 'មួយ', NULL, '00000000299', NULL, 'admin', NULL, '2025-01-30 06:47:34', '2025-02-25 13:49:31', NULL, 'Code-128'),
(10, 'ត្រីខមំប៉ុង', 8, 1, 4, 0, 0, 0.00, 1, 'enable', 10.00, NULL, 0.00, 15.00, 5.00, '2025-02-01', 'inactive', 'ផ្ដាច់មុខ', 'មួយ', NULL, '00000706363', '', 'admin', 'admin', '2025-01-30 07:04:32', '2025-01-31 16:04:10', NULL, NULL),
(11, 'ប្រហិតអាំង', NULL, NULL, 3, 2, 5, 0.00, 1, 'enable', 1.00, NULL, 0.00, 1.50, 0.50, '2025-02-03', 'active', 'ផ្ដាច់មុខ', 'មួយ', '1738220986787_food1.jpg', '00000665798', '', 'admin', 'admin', '2025-01-30 07:09:46', '2025-02-25 07:46:09', NULL, NULL),
(12, 'ជើងមានអាំង', 8, 1, 2, 1, 1, 1.50, 1, 'disable', 0.99, NULL, 0.00, 1.79, 0.80, '2025-02-01', 'active', 'ផ្ដាច់មុខ', 'មួយ', '1738221609109_download (13).jpg', '00062512875', '', 'admin', 'admin', '2025-01-30 07:20:09', '2025-02-25 07:45:20', NULL, NULL),
(13, 'មាន់ដុតកូកាកូឡា', 4, 1, 2, 0, 0, 0.00, 1, 'enable', 4.92, NULL, 4.00, 11.89, 2.97, '2025-02-10', 'active', 'ផ្ដាច់មុខ', 'មួយ', '1738223019885_Meatballs.jpg', '00069607756', 'មាន់ដុតកូកាកូឡា', 'admin', 'admin', '2025-01-30 07:43:39', '2025-02-06 02:41:03', NULL, NULL),
(14, 'មាន់ដុតស្ទឹង', NULL, NULL, 2, 0, 0, 0.00, 2, 'disable', 200.00, NULL, 1.00, 6.00, 3.00, '2025-03-01', 'inactive', 'ផ្ដាច់មុខ', 'មួយ', NULL, '00000950632', '', 'admin', 'admin', '2025-01-30 07:58:52', '2025-02-15 18:39:57', NULL, NULL),
(16, 'កញ្ញាបុផ្ផាស្រស់', NULL, NULL, 3, 0, 0, 0.00, 1, 'enable', 0.00, NULL, 0.00, 0.00, 0.00, NULL, 'inactive', 'ផ្ដាច់មុខ', 'មួយ', NULL, '00020336606', NULL, 'admin', NULL, '2025-01-31 04:34:03', '2025-01-31 07:08:03', NULL, 'Code-128'),
(17, 'មាន់ដុត', NULL, NULL, 4, 0, 0, 0.00, 1, 'enable', 1.00, NULL, 0.00, 2.00, 1.00, NULL, 'inactive', 'ផ្ដាច់មុខ', 'មួយ', NULL, '00036062028', '', 'admin', 'admin', '2025-01-31 04:38:48', '2025-01-31 07:08:05', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_discount`
--

CREATE TABLE `product_discount` (
  `id` int(11) NOT NULL,
  `product_discount_detail_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `date_start` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `user_at` mediumtext DEFAULT NULL,
  `user_update` mediumtext DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_discount`
--

INSERT INTO `product_discount` (`id`, `product_discount_detail_id`, `product_id`, `discount_amount`, `date_start`, `date_end`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`) VALUES
(29, 15, 5, 0.00, '2025-02-19', '2025-02-27', 'admin', NULL, '2025-02-12 05:14:52', '2025-02-12 05:14:52', NULL),
(30, 15, 10, 2.50, '2025-02-19', '2025-02-27', 'admin', NULL, '2025-02-12 05:14:52', '2025-02-12 05:14:52', NULL),
(34, 15, 11, 4.50, '2025-02-19', '2025-02-27', 'admin', NULL, '2025-02-12 05:27:35', '2025-02-12 05:27:35', NULL),
(38, 19, 9, 10.09, '2025-03-05', '2025-04-05', 'admin', NULL, '2025-02-12 05:53:54', '2025-02-12 06:05:00', NULL),
(43, 8, 8, 3.00, '2025-03-05', '2025-04-12', 'admin', 'admin', '2025-02-13 04:51:18', '2025-02-13 05:05:09', NULL),
(44, 8, 1, 1.50, '2025-03-05', '2025-04-12', 'admin', 'admin', '2025-02-13 05:00:15', '2025-02-13 05:05:09', NULL),
(45, 20, 11, 0.00, '2025-02-12', '2025-02-15', 'admin', 'admin', '2025-02-13 05:17:49', '2025-02-13 05:28:43', NULL),
(46, 20, 17, 0.00, '2025-02-12', '2025-02-15', 'admin', 'admin', '2025-02-13 05:17:49', '2025-02-13 05:28:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_discount_detail`
--

CREATE TABLE `product_discount_detail` (
  `id` int(11) NOT NULL,
  `detail_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_discount_detail`
--

INSERT INTO `product_discount_detail` (`id`, `detail_name`) VALUES
(8, 'កញ្ញាបុផ្ផាស្រស់'),
(15, 'កញ្ញាបុផ្ផាស្រស់1'),
(19, 'កញ្ញាបុផ្ផាស្រស់4'),
(20, 'ក្រែម');

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `purchasedetail_id` int(11) DEFAULT NULL,
  `date_by` date DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `include_tax` decimal(10,2) DEFAULT NULL,
  `exclude_tax` decimal(10,2) DEFAULT NULL,
  `profit` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `status` enum('completed','active','pending') NOT NULL DEFAULT 'completed',
  `user_at` text DEFAULT NULL,
  `user_update` text DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `purchase`
--

INSERT INTO `purchase` (`id`, `supplier_id`, `product_id`, `purchasedetail_id`, `date_by`, `qty`, `discount`, `cost_price`, `include_tax`, `exclude_tax`, `profit`, `total`, `status`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`) VALUES
(44, 1, 1, 94, '2024-10-31', 3, 1.00, 2.22, 2.00, 8.80, NULL, 7.66, 'pending', 'admin1', 'admin', '2024-10-31 08:40:05', '2025-02-12 05:36:08', NULL),
(53, 3, 7, 98, '2025-01-08', 2, 0.00, 10.00, 0.00, 30.00, NULL, 20.00, 'active', 'admin', 'admin', '2025-01-08 07:23:41', '2025-02-15 19:36:25', NULL),
(55, 3, 1, 98, '2025-01-08', 1, 0.00, 3.00, 0.00, 6.00, NULL, 6.00, 'active', 'admin', 'admin', '2025-02-02 06:49:00', '2025-02-25 07:01:38', NULL),
(56, 3, 9, 98, '2025-01-08', 2, 0.00, 200.00, 0.00, 30.00, NULL, 400.00, 'active', 'admin', 'admin', '2025-02-02 07:16:07', '2025-02-15 19:36:25', NULL),
(65, 4, 9, 100, '2025-02-03', 1, 0.00, 20.00, 0.00, 30.00, NULL, 20.00, 'pending', 'admin', 'admin', '2025-02-03 18:20:56', '2025-02-05 14:30:20', NULL),
(69, 4, 1, 100, '2025-02-03', 3, 0.00, 2.50, 0.00, 6.00, NULL, 7.50, 'pending', 'admin', 'admin', '2025-02-03 18:59:04', '2025-02-05 14:30:20', NULL),
(70, 4, 8, 100, '2025-02-03', 5, 0.00, 2.51, 0.00, 4.00, NULL, 12.55, 'pending', 'admin', 'admin', '2025-02-03 18:59:04', '2025-02-05 14:30:40', NULL),
(71, 1, 8, 94, '2024-10-31', 1, 0.00, 2.50, 0.00, 4.00, NULL, 2.50, 'pending', 'admin', NULL, '2025-02-12 05:36:08', '2025-02-12 05:36:08', NULL),
(72, 3, 9, 101, '2025-02-16', 1, 0.00, 20.00, 0.00, 30.00, NULL, 20.00, 'pending', 'admin', 'admin', '2025-02-16 02:43:07', '2025-02-25 04:50:06', NULL),
(73, 1, 8, 102, '2025-02-16', 1, 0.00, 2.50, 0.00, 4.00, NULL, 2.50, 'active', 'admin', 'admin', '2025-02-16 03:18:12', '2025-02-16 03:18:37', NULL),
(74, 4, 9, 103, '2025-02-16', 1, 0.00, 30.00, 0.00, 35.00, NULL, 30.00, 'completed', 'admin', 'admin', '2025-02-16 03:23:04', '2025-02-25 13:49:31', NULL),
(75, 4, 9, 104, '2025-02-16', 1, 0.00, 20.00, 0.00, 30.00, NULL, 20.00, 'completed', 'admin', 'admin', '2025-02-16 03:47:39', '2025-02-25 07:35:13', NULL),
(76, 4, 3, 105, '2025-02-16', 4, 0.00, 10.00, 0.00, 12.00, NULL, 40.00, 'completed', 'admin', 'admin', '2025-02-16 03:59:08', '2025-02-25 07:28:05', NULL),
(77, 5, 1, 106, '2025-02-25', 4, 0.00, 2.50, 0.00, 6.00, NULL, 10.00, 'completed', 'admin', 'admin', '2025-02-25 05:02:19', '2025-02-25 07:39:15', NULL),
(78, 6, 1, 107, '2025-02-25', 5, 0.00, 3.00, 0.00, 7.00, NULL, 15.00, 'completed', 'admin', 'admin', '2025-02-25 07:40:58', '2025-02-25 13:47:52', NULL);

--
-- Triggers `purchase`
--
DELIMITER $$
CREATE TRIGGER `adjust_qty_on_complete` AFTER UPDATE ON `purchase` FOR EACH ROW BEGIN
    -- If status changes from 'active' or 'pending' to 'completed', adjust qty
    IF NEW.status = 'completed' AND (OLD.status = 'active' OR OLD.status = 'pending') THEN
        UPDATE products
        SET qty = qty + NEW.qty,
         stock = stock + NEW.qty,
         cost_price =  NEW.cost_price,
		 exclude_tax =  new.exclude_tax,
		 include_tax =  new.include_tax
        WHERE id = NEW.product_id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `adjust_qty_on_inactive` AFTER UPDATE ON `purchase` FOR EACH ROW BEGIN
    IF OLD.status = 'completed' AND (NEW.status = 'active' OR NEW.status = 'pending') THEN
        UPDATE products
        SET qty = qty - NEW.qty,
          stock = stock - NEW.qty,
            cost_price =  NEW.cost_price,
		 exclude_tax =  new.exclude_tax,
		 include_tax =  new.include_tax
        WHERE id = NEW.product_id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_qty_purchase_status_completed_` AFTER UPDATE ON `purchase` FOR EACH ROW BEGIN
    -- Update the quantity in the products table
     UPDATE products
        SET qty = qty - OLD.qty + NEW.qty,
  			stock = stock - OLD.qty + NEW.qty,
              cost_price =  NEW.cost_price,
		 exclude_tax =  new.exclude_tax,
		 include_tax =  new.include_tax
    WHERE id = NEW.product_id AND New.status ='completed'; -- Check status in the products table
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `insert_data_purchase_update_qty_product` AFTER INSERT ON `purchase` FOR EACH ROW BEGIN
    -- Update the quantity in the products table
    UPDATE products
    SET qty = qty + NEW.qty,
       stock = stock + NEW.qty,
        cost_price =  NEW.cost_price,
		 exclude_tax =  new.exclude_tax,
		 include_tax =  new.include_tax
    WHERE id = NEW.product_id AND New.status = 'completed'; -- Check status in the products table
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_detail`
--

CREATE TABLE `purchase_detail` (
  `id` int(11) NOT NULL,
  `paymenttype_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `amount_total` decimal(10,2) NOT NULL,
  `amount_discount` decimal(10,2) DEFAULT 0.00,
  `amount_pay` decimal(10,2) NOT NULL,
  `pay_date` date NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `purchase_detail`
--

INSERT INTO `purchase_detail` (`id`, `paymenttype_id`, `account_id`, `amount_total`, `amount_discount`, `amount_pay`, `pay_date`, `create_at`, `update_at`) VALUES
(89, NULL, NULL, 2.00, 0.00, 0.00, '2024-10-31', '2024-10-31 06:00:00', '2025-02-04 07:40:10'),
(94, 1, 5, 10.16, 0.00, 6.00, '2024-10-31', '2024-10-31 08:40:05', '2025-02-12 05:36:08'),
(96, 1, 5, 43.50, 5.00, 38.50, '2024-11-19', '2024-11-19 05:54:20', '2025-02-04 07:19:15'),
(97, NULL, NULL, 4.00, 0.00, 4.00, '2024-11-20', '2024-11-20 03:56:32', '2025-02-03 16:35:18'),
(98, 4, 5, 426.00, 12.00, 26.00, '2025-01-08', '2025-01-08 07:23:41', '2025-02-03 07:31:55'),
(99, 4, 4, 31.98, 1.00, 2.00, '2025-01-27', '2025-01-27 16:35:40', '2025-02-05 14:04:38'),
(100, NULL, NULL, 40.05, 0.00, 40.05, '2025-02-03', '2025-02-03 18:20:56', '2025-02-05 14:30:40'),
(101, NULL, 2, 20.00, 0.00, 13.00, '2025-02-16', '2025-02-16 02:43:07', '2025-02-16 02:59:21'),
(102, NULL, 2, 2.50, 0.00, 0.50, '2025-02-16', '2025-02-16 03:18:12', '2025-02-16 03:18:12'),
(103, NULL, 2, 30.00, 0.00, 30.00, '2025-02-16', '2025-02-16 03:23:04', '2025-02-25 13:49:09'),
(104, NULL, 2, 20.00, 0.00, 13.00, '2025-02-16', '2025-02-16 03:47:39', '2025-02-25 07:35:13'),
(105, NULL, NULL, 40.00, 0.00, 6.00, '2025-02-16', '2025-02-16 03:59:08', '2025-02-25 05:07:26'),
(106, NULL, NULL, 10.00, 0.00, 10.00, '2025-02-25', '2025-02-25 05:02:19', '2025-02-25 05:02:19'),
(107, NULL, NULL, 15.00, 0.00, 15.00, '2025-02-25', '2025-02-25 07:40:58', '2025-02-25 13:47:52');

--
-- Triggers `purchase_detail`
--
DELIMITER $$
CREATE TRIGGER `after_purchase_detail_insert` AFTER INSERT ON `purchase_detail` FOR EACH ROW BEGIN
    DECLARE purchase_status VARCHAR(50);

    -- Get the status of the corresponding purchase
    SELECT p.status INTO purchase_status
    FROM purchase p
    WHERE p.purchasedetail_id = NEW.id;

    -- Debug: Print the purchase_status (for testing purposes)
    -- SELECT purchase_status;

    -- Update the account balance if the status is 'completed' or 'active'
    IF purchase_status IS NOT NULL AND (purchase_status = 'completed' OR purchase_status = 'active') THEN
        UPDATE acount
        SET balance = balance - NEW.amount_pay
        WHERE id = NEW.account_id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `updatet_on_purchase-detail_Subtract_account` AFTER UPDATE ON `purchase_detail` FOR EACH ROW BEGIN
    DECLARE purchase_status VARCHAR(50);

    -- Get the status of the corresponding purchase
    SELECT p.status INTO purchase_status
    FROM purchase p
    WHERE p.purchasedetail_id = NEW.id;

    -- Update the account balance if the status is 'completed' or 'active'
     IF purchase_status IS NOT NULL AND (purchase_status = 'completed' OR purchase_status = 'active') THEN
        -- Subtract the new amount_pay and add the old amount_pay (to handle changes)
        UPDATE acount
        SET  balance = balance + OLD.amount_pay - NEW.amount_pay
        WHERE id = NEW.account_id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL,
  `contect_type` enum('ផ្ទាល់ខ្លួន','អជីវកម្ម') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contect_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_names` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_names` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `half_names` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_at` varchar(255) DEFAULT NULL,
  `user_update` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `contect_type`, `contect_phone`, `mobile_phone`, `business_names`, `full_names`, `half_names`, `description`, `email`, `user_at`, `user_update`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'អជីវកម្ម', '0123456789', '0965752080', 'ហាងបាយ', '', 'SR', 'មានរស់ជាតិឆ្ងាញ់', 'nakry@example.com', 'admin', 'User', '2024-10-22 03:48:38', '2025-02-05 06:52:55', NULL),
(3, 'អជីវកម្ម', '9654322', '', 'ហាងលក់កុំព្យូទ័រ', '', '', '', '', 'admin', 'admin', '2024-10-22 04:24:18', '2024-10-28 05:48:08', NULL),
(4, 'ផ្ទាល់ខ្លួន', '', '098765', '', 'Shop phone', '', '', '', 'admin', 'admin', '2024-10-28 06:27:18', '2024-10-28 06:27:39', NULL),
(5, 'ផ្ទាល់ខ្លួន', NULL, '0974882673', '', 'My shop 311', '311', 'shop', 'myshop311@gmail.com', 'admin', 'admin', '2025-02-24 13:20:20', '2025-02-24 13:28:22', NULL),
(6, 'ផ្ទាល់ខ្លួន', NULL, '097643', '', 'LV', NULL, NULL, NULL, 'admin', NULL, '2025-02-24 13:32:09', '2025-02-24 13:32:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `unit`
--

CREATE TABLE `unit` (
  `id` int(11) NOT NULL,
  `names` varchar(255) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `unit`
--

INSERT INTO `unit` (`id`, `names`, `description`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'គ្រាប់', 'ថ្មី', '2024-10-18 08:08:20', '2024-10-18 08:08:20', NULL),
(2, 'កញ្ចប់', '', '2024-10-18 08:08:43', '2024-10-18 08:10:15', NULL),
(3, 'ដប', '', '2024-10-18 08:10:31', '2024-10-23 05:34:07', NULL),
(4, 'កំប៉ុង', '', '2024-10-18 08:26:36', '2024-10-18 08:29:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_names` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `user_rol` enum('user','cashier','admin','superadmin') DEFAULT 'user',
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_names`, `user_email`, `user_pass`, `user_rol`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'admin', 'admin@gmail.com', '$2a$08$IjdaOfXus6FUhr6D04Fg3ei60p/aOcT41jfwmy1b6W9fNVhbgqSZm', 'admin', '2024-10-15 05:14:32', '2024-10-15 13:10:48', NULL),
(2, 'User', 'user@gmail.com', '$2a$08$Ib.idtd7dcyWTsoHZGlea.B0afXAdVIwL7shmuYSLUrlFU6gIkYJW', 'user', '2024-10-15 05:20:01', '2024-10-15 05:20:01', NULL),
(3, 'SuperAdmin', 'superadmin@gmail.com', '$2a$08$W3B2AnU2doEHxYmB4ZJtTO8tP17p6h7xbCwhcRV.ohr1ZGschdtiK', 'superadmin', '2024-10-15 13:09:51', '2024-10-15 13:09:51', NULL),
(4, '12345678', '12345678@gmail.com', '$2a$10$qX47MIL.c9sZeStpFoHK/OgcMFSagsxJc5Q4cABCOXg2Mk2NdA50C', 'admin', '2025-02-05 03:05:48', '2025-02-05 04:36:05', NULL),
(5, 'phong', 'phong@gmail.com', '$2a$08$3dg5l1.x2OfzBZ64.gi2rORCjQyUZLqE1ETjR/9EEiaXVy5s7r.AK', 'admin', '2025-02-09 06:25:15', '2025-02-09 06:25:15', NULL),
(6, 'Chitra', 'Chitra@gmail.com', '$2a$08$FfklwpUYhC5hLR4G.la9AeOPbrjpnCjl6zRNwuF4WTj9uYNlcvHNS', 'admin', '2025-02-09 06:27:09', '2025-02-09 06:27:09', NULL),
(7, 'sale', 'sale@gmail.com', '$2a$08$Gd9SLj/WAZKt9V0XKZL8F.ZgWZrA2vR5Bt4aELz43JYc8hsidSnU6', 'cashier', '2025-02-24 13:48:19', '2025-02-24 13:48:19', NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_customer_group`
-- (See below for the actual view)
--
CREATE TABLE `v_customer_group` (
`id` int(11)
,`contect_type` enum('ផ្ទាល់ខ្លួន','អជីវកម្ម')
,`group_id` int(11)
,`business_names` varchar(255)
,`full_names` varchar(255)
,`half_names` varchar(255)
,`group_names` varchar(255)
,`discount` decimal(10,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_nameproducts`
-- (See below for the actual view)
--
CREATE TABLE `v_nameproducts` (
`id` int(11)
,`stock_qty` int(11)
,`brand_id` int(11)
,`mg_stock` enum('disable','enable')
,`pro_names` varchar(255)
,`cat_names` varchar(255)
,`category_id` int(11)
,`unit_names` varchar(255)
,`brand_names` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_totalamount_di_customer`
-- (See below for the actual view)
--
CREATE TABLE `v_totalamount_di_customer` (
`customer_id` int(11)
,`type_currency` enum('usd','khr','thb')
,`order_detail_id` int(11)
,`total_amount_sum` decimal(32,2)
,`balance_amount_sum` decimal(32,2)
,`total_amount_difference_sum` decimal(33,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `warranty`
--

CREATE TABLE `warranty` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `create_at` bigint(20) DEFAULT NULL,
  `update_at` bigint(20) DEFAULT NULL,
  `delete_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `warranty`
--

INSERT INTO `warranty` (`id`, `product_id`, `duration`, `type`, `description`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 1, 12, 'months', 'One-year full coverage warranty', NULL, NULL, NULL),
(6, 5, 11, 'ថ្ងៃ', 'y1', NULL, NULL, NULL),
(7, 14, 12, 'months', 'One-year full coverage warranty', NULL, NULL, NULL),
(8, 10, 12, 'ខែ', 'fvar', NULL, NULL, NULL),
(9, 12, 23, 'ខែ', 'wef', NULL, NULL, NULL),
(10, 14, 2, 'ថ្ងៃ', 'waf', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure for view `monthly_summary`
--
DROP TABLE IF EXISTS `monthly_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `monthly_summary`  AS SELECT `months`.`month` AS `month`, coalesce(`p`.`total_amount`,0) AS `purchase_total`, coalesce(`o`.`total_amount`,0) AS `order_total`, coalesce(`c`.`total_amount`,0) AS `cost_total` FROM ((((select 1 AS `month` union select 2 AS `2` union select 3 AS `3` union select 4 AS `4` union select 5 AS `5` union select 6 AS `6` union select 7 AS `7` union select 8 AS `8` union select 9 AS `9` union select 10 AS `10` union select 11 AS `11` union select 12 AS `12`) `months` left join (select month(`p`.`create_at`) AS `month`,sum(`p`.`amount_total`) AS `total_amount` from `purchase_detail` `p` where year(`p`.`pay_date`) = year(curdate()) group by month(`p`.`pay_date`)) `p` on(`months`.`month` = `p`.`month`)) left join (select month(`o`.`create_at`) AS `month`,sum(`o`.`total_amount_dola`) AS `total_amount` from `order_detail` `o` where year(`o`.`create_at`) = year(curdate()) group by month(`o`.`create_at`)) `o` on(`months`.`month` = `o`.`month`)) left join (select month(`c`.`dob`) AS `month`,sum(`c`.`price`) AS `total_amount` from `cost` `c` where year(`c`.`dob`) = year(curdate()) group by month(`c`.`dob`)) `c` on(`months`.`month` = `c`.`month`)) ORDER BY `months`.`month` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `v_customer_group`
--
DROP TABLE IF EXISTS `v_customer_group`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_customer_group`  AS SELECT `c`.`id` AS `id`, `c`.`contect_type` AS `contect_type`, `c`.`group_id` AS `group_id`, `c`.`business_names` AS `business_names`, `c`.`full_names` AS `full_names`, `c`.`half_names` AS `half_names`, `g`.`group_names` AS `group_names`, `g`.`discount` AS `discount` FROM (`customer` `c` left join `group_customer` `g` on(`g`.`id` = `c`.`group_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_nameproducts`
--
DROP TABLE IF EXISTS `v_nameproducts`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_nameproducts`  AS SELECT `pro`.`id` AS `id`, `pro`.`qty` AS `stock_qty`, `pro`.`brand_id` AS `brand_id`, `pro`.`mg_stock` AS `mg_stock`, `pro`.`pro_names` AS `pro_names`, `cat`.`cat_names` AS `cat_names`, `pro`.`category_id` AS `category_id`, `u`.`names` AS `unit_names`, `b`.`brand_names` AS `brand_names` FROM (((`products` `pro` left join `category` `cat` on(`pro`.`category_id` = `cat`.`id`)) left join `unit` `u` on(`pro`.`unit_id` = `u`.`id`)) left join `brands` `b` on(`pro`.`brand_id` = `b`.`id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_totalamount_di_customer`
--
DROP TABLE IF EXISTS `v_totalamount_di_customer`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_totalamount_di_customer`  AS SELECT `o`.`customer_id` AS `customer_id`, `od`.`type_currency` AS `type_currency`, `o`.`order_detail_id` AS `order_detail_id`, sum(`od`.`total_amount`) AS `total_amount_sum`, sum(`od`.`balance_amount`) AS `balance_amount_sum`, sum(`od`.`total_amount` - `od`.`balance_amount`) AS `total_amount_difference_sum` FROM (`order` `o` join `order_detail` `od` on(`od`.`id` = `o`.`order_detail_id`)) GROUP BY `o`.`customer_id` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_detail`
--
ALTER TABLE `account_detail`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `account_in` (`account_in`),
  ADD KEY `account_out` (`account_out`);

--
-- Indexes for table `acount`
--
ALTER TABLE `acount`
  ADD PRIMARY KEY (`id`),
  ADD KEY `acount_ibfk_1` (`bank_id`);

--
-- Indexes for table `bank`
--
ALTER TABLE `bank`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cost`
--
ALTER TABLE `cost`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cost_ibfk_1` (`cost_type_id`),
  ADD KEY `cost_ibfk_2` (`account_id`);

--
-- Indexes for table `cost_type`
--
ALTER TABLE `cost_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `currency`
--
ALTER TABLE `currency`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `currency_rates`
--
ALTER TABLE `currency_rates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_ibfk_1` (`group_id`);

--
-- Indexes for table `customer_payment`
--
ALTER TABLE `customer_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `order_detail_id` (`order_detail_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `edit_stock`
--
ALTER TABLE `edit_stock`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `group_customer`
--
ALTER TABLE `group_customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_ibfk_3` (`order_detail_id`),
  ADD KEY `order_ibfk_2` (`product_id`),
  ADD KEY `order_ibfk_1` (`customer_id`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `paymenttype_id` (`paymenttype_id`);

--
-- Indexes for table `order_repay`
--
ALTER TABLE `order_repay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_repay_ibfk_1` (`product_id`);

--
-- Indexes for table `order_repay_detail`
--
ALTER TABLE `order_repay_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_repay_detail_ibfk_1` (`account_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `payment_type`
--
ALTER TABLE `payment_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_ibfk_1` (`category_id`),
  ADD KEY `products_ibfk_2` (`brand_id`),
  ADD KEY `products_ibfk_3` (`unit_id`);

--
-- Indexes for table `product_discount`
--
ALTER TABLE `product_discount`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `product_discount_detail_id` (`product_discount_detail_id`);

--
-- Indexes for table `product_discount_detail`
--
ALTER TABLE `product_discount_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_ibfk_2` (`product_id`),
  ADD KEY `purchase_ibfk_4` (`purchasedetail_id`),
  ADD KEY `purchase_ibfk_5` (`supplier_id`);

--
-- Indexes for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paymenttype_id` (`paymenttype_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `unit`
--
ALTER TABLE `unit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- Indexes for table `warranty`
--
ALTER TABLE `warranty`
  ADD PRIMARY KEY (`id`),
  ADD KEY `warranty_ibfk_1` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_detail`
--
ALTER TABLE `account_detail`
  MODIFY `detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `acount`
--
ALTER TABLE `acount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `bank`
--
ALTER TABLE `bank`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cost`
--
ALTER TABLE `cost`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `cost_type`
--
ALTER TABLE `cost_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `currency`
--
ALTER TABLE `currency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `currency_rates`
--
ALTER TABLE `currency_rates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `customer_payment`
--
ALTER TABLE `customer_payment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `edit_stock`
--
ALTER TABLE `edit_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `group_customer`
--
ALTER TABLE `group_customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `order_repay`
--
ALTER TABLE `order_repay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order_repay_detail`
--
ALTER TABLE `order_repay_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payment_type`
--
ALTER TABLE `payment_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `product_discount`
--
ALTER TABLE `product_discount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `product_discount_detail`
--
ALTER TABLE `product_discount_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `unit`
--
ALTER TABLE `unit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `warranty`
--
ALTER TABLE `warranty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_detail`
--
ALTER TABLE `account_detail`
  ADD CONSTRAINT `account_detail_ibfk_1` FOREIGN KEY (`account_in`) REFERENCES `acount` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `account_detail_ibfk_2` FOREIGN KEY (`account_out`) REFERENCES `acount` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `acount`
--
ALTER TABLE `acount`
  ADD CONSTRAINT `acount_ibfk_1` FOREIGN KEY (`bank_id`) REFERENCES `bank` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `cost`
--
ALTER TABLE `cost`
  ADD CONSTRAINT `cost_ibfk_1` FOREIGN KEY (`cost_type_id`) REFERENCES `cost_type` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `cost_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `acount` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `group_customer` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `customer_payment`
--
ALTER TABLE `customer_payment`
  ADD CONSTRAINT `customer_payment_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `customer_payment_ibfk_2` FOREIGN KEY (`order_detail_id`) REFERENCES `order_detail` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `customer_payment_ibfk_3` FOREIGN KEY (`account_id`) REFERENCES `acount` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`order_detail_id`) REFERENCES `order_detail` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `acount` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`paymenttype_id`) REFERENCES `payment_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order_repay`
--
ALTER TABLE `order_repay`
  ADD CONSTRAINT `order_repay_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `order_repay_detail`
--
ALTER TABLE `order_repay_detail`
  ADD CONSTRAINT `order_repay_detail_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `acount` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `order_repay_detail_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `product_discount`
--
ALTER TABLE `product_discount`
  ADD CONSTRAINT `product_discount_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_discount_ibfk_2` FOREIGN KEY (`product_discount_detail_id`) REFERENCES `product_discount_detail` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_ibfk_4` FOREIGN KEY (`purchasedetail_id`) REFERENCES `purchase_detail` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_ibfk_5` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  ADD CONSTRAINT `purchase_detail_ibfk_1` FOREIGN KEY (`paymenttype_id`) REFERENCES `payment_type` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_detail_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `acount` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `warranty`
--
ALTER TABLE `warranty`
  ADD CONSTRAINT `warranty_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `reset_expired_discounts` ON SCHEDULE EVERY 1 SECOND STARTS '2025-02-07 21:00:44' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE products
    SET discount = 0
    WHERE id IN (SELECT product_id FROM product_discount WHERE date_end < CURDATE());
END$$

CREATE DEFINER=`root`@`localhost` EVENT `update_product_discounts` ON SCHEDULE EVERY 1 SECOND STARTS '2025-02-07 21:26:57' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    -- Apply active discounts
    UPDATE products p
    JOIN product_discount pd ON p.id = pd.product_id
    SET p.discount = pd.discount_amount
    WHERE CURDATE() BETWEEN pd.date_start AND pd.date_end;

    -- Reset expired discounts
    UPDATE products p
    SET p.discount = 0
    WHERE p.id IN (SELECT product_id FROM product_discount WHERE date_end < CURDATE());
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
