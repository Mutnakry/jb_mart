-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2025 at 04:37 AM
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
(2, 'Nakry', 2, '111220008776', 27.79, NULL, 'admin', 'admin', '2025-02-26 03:58:39', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'on'),
(4, 'ស្រីស្អាត', 3, '1000223888331', 110.00, 'លក់លុះខ្ស័យ', 'admin', 'admin', '2025-01-29 02:30:11', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'off'),
(5, 'Sok thin', 6, '1100093773733', 1987.00, 'លក់ទាល់តែអស់បានឈប់', 'admin', 'superadmin', '2025-05-16 02:29:54', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'on');

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
(5, 'ភេសជ្ជៈ', '', '2024-10-23 05:55:39', '2024-10-23 05:56:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cash_withdrawals`
--

CREATE TABLE `cash_withdrawals` (
  `id` int(11) NOT NULL,
  `cashier_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `transaction_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
  `opening_id` int(11) DEFAULT NULL,
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

INSERT INTO `cost` (`id`, `cost_type_id`, `account_id`, `opening_id`, `tax`, `price`, `payment`, `dob`, `decription`, `interval`, `interval_type`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`) VALUES
(13, 3, NULL, NULL, 10, 200, 200, '2024-12-17', NULL, 1, 'ខែ', 'admin', 'admin', '2024-12-17 07:26:19', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, 3, NULL, NULL, 0, 10, 10, '2024-12-18', NULL, 1, 'ថ្ងៃ', 'admin', 'admin', '2025-01-31 16:17:07', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, 1, NULL, NULL, 1, 10, 10, '2024-12-17', NULL, 1, 'ថ្ងៃ', 'admin', 'admin', '2024-12-17 08:01:51', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, 2, 5, 5, 1, 33, 3, '2025-02-05', NULL, 1, 'ថ្ងៃ', 'admin', 'admin', '2025-03-17 05:48:49', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, 2, NULL, 5, 0, 120, 0, '2025-01-06', NULL, 1, 'ឆ្នាំ', 'admin', 'admin', '2025-03-16 17:16:30', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, 3, NULL, NULL, 0, 6, 0, '2025-03-17', NULL, 1, 'ថ្ងៃ', 'admin', NULL, '2025-03-17 03:43:49', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

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
(3, 'ថ្លៃទឹក', '2024-10-20 05:03:28', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'Coffee', '2025-03-17 04:16:53', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, 'បាយ', '2025-03-17 04:17:04', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

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
(1, 'KHR', 4100.0000, '2024-12-06 02:52:31', '2025-04-08 08:40:17'),
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
(1, 'ផ្ទាល់ខ្លួន', NULL, NULL, '0965752080', NULL, 'អតិថិជនទូទៅ', NULL, 'ហាមលុប( Walk-In Customer​)', NULL, '', '', '2024-10-14 03:50:08', '2025-02-25 14:03:50', NULL),
(3, 'អជីវកម្ម', NULL, '123456789', NULL, 'ហាងបាយ', NULL, NULL, NULL, 'nakry@example.com', 'admin', 'admin', '2024-10-21 15:12:06', '2024-10-21 17:54:35', NULL),
(8, 'ផ្ទាល់ខ្លួន', 2, '9654322', '098765', NULL, 'nakry', 'Vp', 'yes', 'lv@gmail.com', 'admin', 'User', '2024-10-21 17:34:12', '2025-02-05 06:59:33', NULL),
(9, 'អជីវកម្ម', NULL, '០០៩៩៨៧៦៦៥៥៤', NULL, 'ហាងលក់កុំព្យូទ័រ', NULL, NULL, NULL, NULL, 'admin', 'admin', '2024-10-21 17:34:49', '2025-03-09 15:49:40', NULL),
(10, 'ផ្ទាល់ខ្លួន', 3, NULL, '0098765431234', '', 'KAKA FoodBall', 'kf', NULL, NULL, 'admin', 'admin', '2024-10-25 10:10:43', '2024-11-12 05:57:50', NULL),
(11, 'ផ្ទាល់ខ្លួន', NULL, NULL, '០៩៦៥៦៧៥២០៨០', '', 'មុត ណាគ្រី', NULL, NULL, NULL, 'admin', 'admin', '2024-12-17 09:28:43', '2025-03-12 03:47:15', NULL);

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
(2, 11, 12, NULL, 1.00, 1.00, 1.00, 'usd', 'Payment for order 12', 'admin', NULL, '2025-02-07 06:48:27', '2025-02-27 08:15:15'),
(4, 10, 10, NULL, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 15:30:40', '2025-02-14 15:30:40'),
(5, 10, 10, NULL, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 15:33:39', '2025-02-14 15:33:39'),
(6, 10, 10, NULL, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 15:46:55', '2025-02-14 15:46:55'),
(7, 10, 10, 2, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 15:50:47', '2025-02-14 15:50:47'),
(8, 10, 10, 2, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 16:02:26', '2025-02-14 16:02:26'),
(9, 10, 10, 2, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 16:27:03', '2025-02-14 16:27:03'),
(10, 10, 10, NULL, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 16:28:59', '2025-02-14 16:28:59'),
(11, 10, 10, 2, 5.00, 0.15, 35.00, 'thb', '', 'admin', NULL, '2025-02-14 16:30:39', '2025-02-14 16:30:39'),
(13, 1, 13, NULL, 1.00, 1.00, 1.00, 'usd', '', 'admin', NULL, '2025-02-14 18:27:15', '2025-02-14 18:27:15'),
(14, 10, 10, 2, 5.00, 0.14, 35.00, 'thb', '', 'admin', NULL, '2025-02-15 08:24:42', '2025-03-18 14:17:15'),
(16, 1, 22, NULL, 0.91, 0.91, 1.00, 'usd', '', 'admin', NULL, '2025-05-10 04:14:36', '2025-05-10 04:14:36'),
(17, 10, 10, NULL, 5.00, 0.15, 35.00, 'thb', '', 'SuperAdmin', NULL, '2025-05-15 14:34:38', '2025-05-15 14:34:38');

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
(3, 'Happy Student', 1.00, 'លកើដោយណាគ្រី', 'admin', 'SuperAdmin', '2024-10-21 08:58:24', '2025-05-11 17:36:12', NULL),
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
(12, 1, 9, 2, 1, 6.00, 1.00, 5.00, NULL, 'admin', NULL, '2025-02-06 13:30:06', '2025-03-13 08:02:59', NULL),
(13, 10, 10, 2, 1, 6.00, 1.00, 5.00, NULL, 'admin', NULL, '2025-02-06 15:17:56', '2025-02-06 15:17:56', NULL),
(14, 1, 11, 1, 2, 6.00, 0.50, 11.00, NULL, 'admin', NULL, '2025-02-06 15:39:40', '2025-02-06 15:39:40', NULL),
(15, 11, 12, 1, 2, 6.00, 0.50, 11.00, NULL, 'admin', NULL, '2025-02-07 04:27:57', '2025-02-07 04:27:57', NULL),
(16, 1, 13, 12, 2, 1.79, 1.50, 0.58, NULL, 'admin', NULL, '2025-02-13 06:45:47', '2025-02-13 06:45:47', NULL),
(17, 1, 13, 11, 2, 1.50, 0.00, 3.00, NULL, 'admin', NULL, '2025-02-13 06:45:48', '2025-02-13 06:45:48', NULL),
(18, 1, 13, 9, 3, 30.00, 0.00, 90.00, NULL, 'admin', NULL, '2025-02-13 06:45:48', '2025-02-13 06:45:48', NULL),
(19, 1, 14, 12, 1, 1.79, 1.50, 0.29, NULL, 'admin', NULL, '2025-02-14 04:11:34', '2025-02-14 04:11:34', NULL),
(20, 1, 15, 2, 2, 6.00, 1.00, 10.00, NULL, 'admin', NULL, '2025-02-26 03:50:55', '2025-02-26 03:50:55', NULL),
(21, 1, 17, 9, 1, 35.00, 0.00, 35.00, NULL, 'admin', NULL, '2025-02-26 03:51:57', '2025-03-01 16:01:12', NULL),
(22, 1, 17, 11, 1, 1.50, 0.00, 1.50, NULL, 'admin', NULL, '2025-02-26 03:58:39', '2025-02-26 03:58:39', NULL),
(23, 1, 18, 9, 3, 35.00, 0.00, 105.00, NULL, 'admin', NULL, '2025-03-07 04:24:26', '2025-03-07 04:24:26', NULL),
(24, 1, 19, 12, 1, 1.79, 1.50, 0.29, NULL, 'admin', NULL, '2025-03-07 04:43:59', '2025-03-07 04:43:59', NULL),
(25, 1, 20, 9, 2, 35.00, 0.00, 70.00, NULL, 'admin', NULL, '2025-03-07 06:15:25', '2025-03-07 06:15:25', NULL),
(26, 1, 21, 9, 1, 35.00, 10.09, 24.91, NULL, 'admin', NULL, '2025-05-05 13:48:17', '2025-05-05 13:48:17', NULL),
(27, 1, 22, 9, 1, 35.00, 10.09, 24.91, NULL, 'admin', NULL, '2025-05-09 17:26:05', '2025-05-09 17:26:05', NULL),
(28, 1, 23, 8, 5, 4.00, 3.00, 5.00, NULL, 'admin', NULL, '2025-05-10 04:16:30', '2025-05-10 04:16:30', NULL),
(29, 1, 23, 2, 1, 6.00, 1.00, 5.00, NULL, 'admin', NULL, '2025-05-10 04:16:30', '2025-05-10 04:16:30', NULL),
(30, 8, 24, 2, 1, 6.00, 1.00, 5.00, NULL, 'SuperAdmin', NULL, '2025-05-15 14:35:07', '2025-05-15 14:35:07', NULL),
(31, 8, 24, 13, 1, 11.89, 0.00, 11.89, NULL, 'SuperAdmin', NULL, '2025-05-15 14:35:07', '2025-05-15 14:35:07', NULL),
(32, 8, 24, 8, 1, 4.00, 3.00, 1.00, NULL, 'SuperAdmin', NULL, '2025-05-15 14:35:07', '2025-05-15 14:35:07', NULL);

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
  `balance_amount_usd` decimal(8,2) DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT 0.00,
  `type_currency` enum('usd','khr','thb') NOT NULL DEFAULT 'usd',
  `user_at` mediumtext DEFAULT NULL,
  `user_update` mediumtext DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_at` timestamp NULL DEFAULT NULL,
  `description` text DEFAULT NULL,
  `opening_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`id`, `account_id`, `paymenttype_id`, `total_amount`, `total_amount_dola`, `balance_amount`, `changes`, `balance_amount_usd`, `discount`, `type_currency`, `user_at`, `user_update`, `create_at`, `update_at`, `delete_at`, `description`, `opening_id`) VALUES
(8, 5, 4, 11.00, 11.00, 11.00, 1.00, 1.00, 0.00, 'usd', 'admin', NULL, '2025-02-06 13:27:03', '2025-02-26 02:50:06', NULL, '', NULL),
(9, NULL, NULL, 21000.00, 5.00, 21000.00, 4200.00, 5.00, 0.00, 'khr', 'admin', NULL, '2025-02-06 13:30:06', '2025-02-26 02:50:11', NULL, '', NULL),
(10, NULL, NULL, 140.00, 4.00, 140.00, 35.00, 4.00, 1.00, 'thb', 'admin', NULL, '2025-02-06 15:17:56', '2025-05-15 14:34:38', NULL, '', NULL),
(11, NULL, NULL, 11.00, 11.00, 11.00, 1.00, 11.00, 0.00, 'usd', 'admin', NULL, '2025-02-06 15:39:40', '2025-02-26 02:50:50', NULL, '', NULL),
(12, NULL, NULL, 11.00, 11.00, 6.00, 1.00, 6.00, 0.00, 'usd', 'admin', NULL, '2025-02-07 04:27:57', '2025-02-26 02:50:58', NULL, 'នៅជុំពាក់', NULL),
(13, NULL, NULL, 93.58, 93.58, 93.58, 1.00, 93.58, 1.00, 'usd', 'admin', NULL, '2025-02-13 06:45:47', '2025-03-17 05:28:40', NULL, '', 5),
(14, NULL, NULL, 0.29, 0.29, 0.29, 1.00, 0.29, 0.00, 'usd', 'admin', NULL, '2025-02-14 04:11:34', '2025-02-26 02:51:36', NULL, '', NULL),
(15, NULL, NULL, 10.00, 10.00, 10.00, 1.00, 0.00, 0.00, 'usd', 'admin', NULL, '2025-02-26 03:50:55', '2025-02-26 03:50:55', NULL, '', NULL),
(16, 2, 4, 35.00, 35.00, 35.00, 1.00, 3.00, 0.00, 'usd', 'admin', NULL, '2025-02-26 03:51:57', '2025-02-26 03:55:58', NULL, '', NULL),
(17, 2, 4, 1.50, 1.50, 1.50, 1.00, 1.50, 0.00, 'usd', 'admin', NULL, '2025-02-26 03:58:39', '2025-02-26 03:58:39', NULL, '', NULL),
(18, NULL, NULL, 105.00, 105.00, 105.00, 1.00, 105.00, 0.00, 'usd', 'admin', NULL, '2025-03-07 04:24:26', '2025-03-16 17:02:28', NULL, '', 5),
(19, NULL, NULL, 0.29, 0.29, 0.29, 1.00, 0.29, 0.00, 'usd', 'admin', NULL, '2025-03-07 04:43:58', '2025-03-07 04:43:58', NULL, '', NULL),
(20, NULL, NULL, 70.00, 70.00, 70.00, 1.00, 70.00, 0.00, 'usd', 'admin', NULL, '2025-03-07 06:15:25', '2025-03-29 08:14:57', NULL, '', 5),
(21, NULL, NULL, 24.91, 24.91, 24.91, 1.00, 24.91, 0.00, 'usd', 'admin', NULL, '2025-05-05 13:48:17', '2025-05-05 13:48:17', NULL, '', 15),
(22, NULL, NULL, 24.91, 24.91, 24.91, 1.00, 24.00, 0.00, 'usd', 'admin', NULL, '2025-05-09 17:26:05', '2025-05-10 04:14:36', NULL, '', 16),
(23, NULL, NULL, 10.00, 10.00, 10.00, 1.00, 10.00, 0.00, 'usd', 'admin', NULL, '2025-05-10 04:16:30', '2025-05-10 04:16:30', NULL, '', 17),
(24, NULL, NULL, 7.89, 7.89, 7.89, 1.00, 7.89, 10.00, 'usd', 'SuperAdmin', NULL, '2025-05-15 14:35:07', '2025-05-15 14:35:07', NULL, '', 19);

--
-- Triggers `order_detail`
--
DELIMITER $$
CREATE TRIGGER `123` AFTER UPDATE ON `order_detail` FOR EACH ROW BEGIN
    UPDATE acount
    SET balance = balance + NEW.balance_amount_usd
    WHERE id = NEW.account_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_order_get_account_sum_baleabe_acount` AFTER INSERT ON `order_detail` FOR EACH ROW BEGIN
    UPDATE acount
    SET balance = balance + NEW.balance_amount_usd
    WHERE id = NEW.account_id;
END
$$
DELIMITER ;

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
(6, 2, 8, 1, 6.00, 1.00, 5.00, 'នៅដូចដើម'),
(7, 2, 9, 1, 6.00, 1.00, 5.00, 'នៅដូចដើម');

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
  `order_detail_id` int(11) DEFAULT NULL,
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

INSERT INTO `order_repay_detail` (`id`, `customer_id`, `order_detail_id`, `account_id`, `payment_date`, `total_amount`, `discount_amount`, `balance_payment`, `user_at`, `user_update`, `created_at`, `updated_at`) VALUES
(8, 1, NULL, NULL, '2025-02-14', 5.00, 0.00, 5.00, 'admin', NULL, '2025-02-14 04:02:47', '2025-02-27 07:57:11'),
(9, 10, 10, NULL, '2025-03-18', 5.00, NULL, 5.00, NULL, NULL, '2025-03-18 08:59:32', '2025-03-18 08:59:32');

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
(2, 'តាមធនាគារ', '2024-10-29 03:35:31', '2025-05-15 17:57:00'),
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
(1, 'ស្រាបៀABCដប', 1, 1, 1, 11, 13, 0.00, 5, 'disable', 3.00, NULL, 2.00, 7.00, 1.00, NULL, 'inactive', 'ផ្ដាច់មុខ', 'មួយ', '1746703889848_DSC_9483 (2).jpg', 'A062512875', '', 'admin', 'admin', '2024-10-23 07:25:20', '2025-05-16 18:14:24', NULL, NULL),
(2, 'ការហ្វេ', 1, 1, 1, 0, 3, 0.00, 1, 'enable', 2.50, NULL, 0.00, 6.00, 1.00, NULL, 'active', 'រួមបញ្ចូលគ្នា', 'មួយ', '1746811515496_namecoin_7080495.png', 'B062512875', '', 'admin', 'admin', '2024-10-23 07:28:46', '2025-05-15 18:25:32', NULL, NULL),
(5, 'ឆាក្ដៅសាច់ទា', 1, 4, 2, 3, 10, 0.00, 31, 'enable', 11.90, NULL, 0.00, 31.00, 1.10, NULL, 'inactive', 'ផ្ដាច់មុខ', 'អថេរ', '1729710113801_images (13).jpg', 'C06275', NULL, 'admin', 'admin1', '2024-10-23 17:35:48', '2025-02-15 03:59:44', NULL, NULL),
(6, 'ប្រហុកអាំង', 11, 5, 4, 3, 4, 0.00, 10, 'enable', 1.00, NULL, 0.00, 1.50, 0.50, '2026-06-24', 'inactive', 'រួមបញ្ចូលគ្នា', 'មួយ', '1738294086034_images (16).jpg', 'D00012875', 'yes', 'admin', 'admin', '2024-10-23 18:01:51', '2025-02-25 07:46:13', NULL, NULL),
(8, 'Pizza', 1, 1, 1, 0, 6, 0.00, 1, 'enable', 2.50, NULL, 1.00, 4.00, 1.00, '2024-11-01', 'active', 'រួមបញ្ចូលគ្នា', 'មួយ', NULL, 'G00012875', 'null', 'admin', NULL, '2024-10-28 06:59:30', '2025-05-19 19:03:45', NULL, NULL),
(9, 'ABC', 4, 5, 3, -4, 6, 0.00, 1, 'disable', 30.00, NULL, 0.00, 35.00, 8.00, '2025-01-31', 'active', 'រួមបញ្ចូលគ្នា', 'មួយ', NULL, '00000000299', NULL, 'admin', NULL, '2025-01-30 06:47:34', '2025-05-19 19:03:45', NULL, 'Code-128'),
(11, 'ប្រហិតអាំង', NULL, NULL, 3, 1, 5, 0.00, 1, 'enable', 1.00, NULL, 0.00, 1.50, 0.50, '2025-02-03', 'active', 'ផ្ដាច់មុខ', 'មួយ', '1738220986787_food1.jpg', '00000665798', '', 'admin', 'admin', '2025-01-30 07:09:46', '2025-02-26 03:58:39', NULL, NULL),
(12, 'ជើងមានអាំង', 8, 1, 2, 1, 1, 1.00, 1, 'disable', 0.99, NULL, 0.00, 1.79, 0.80, '2025-02-01', 'active', 'ផ្ដាច់មុខ', 'មួយ', '1738221609109_download (13).jpg', '00062512875', '', 'admin', 'admin', '2025-01-30 07:20:09', '2025-05-15 19:02:22', NULL, NULL),
(13, 'មាន់ដុតកូកាកូឡា', 4, 1, 2, 0, 1, 0.00, 1, 'enable', 4.92, NULL, 4.00, 11.89, 2.97, '2025-02-10', 'active', 'ផ្ដាច់មុខ', 'មួយ', '1738223019885_Meatballs.jpg', '00069607756', 'មាន់ដុតកូកាកូឡា', 'admin', 'admin', '2025-01-30 07:43:39', '2025-05-28 18:39:44', NULL, NULL),
(16, 'កញ្ញាបុផ្ផាស្រស់', NULL, NULL, 3, 1, 1, 0.00, 1, 'enable', 0.00, NULL, 0.00, 0.00, 0.00, NULL, 'inactive', 'ផ្ដាច់មុខ', 'មួយ', NULL, '00020336606', NULL, 'admin', NULL, '2025-01-31 04:34:03', '2025-03-13 16:12:38', NULL, 'Code-128');

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
(44, 8, 1, 1.50, '2025-03-05', '2025-04-12', 'admin', 'SuperAdmin', '2025-02-13 05:00:15', '2025-05-15 12:32:46', NULL),
(47, 15, 8, 3.00, '2025-02-19', '2025-02-27', 'SuperAdmin', 'admin', '2025-04-28 18:58:35', '2025-05-08 13:23:18', NULL),
(51, 20, 16, 0.00, '2025-02-12', '2025-02-15', 'SuperAdmin', 'SuperAdmin', '2025-05-12 04:50:01', '2025-05-12 04:50:05', NULL),
(52, 20, 13, 0.00, '2025-02-12', '2025-02-15', 'SuperAdmin', 'SuperAdmin', '2025-05-12 04:50:01', '2025-05-12 04:50:05', NULL),
(69, 19, 16, 0.00, '2025-03-05', '2025-04-05', 'SuperAdmin', NULL, '2025-05-15 12:32:33', '2025-05-15 12:32:33', NULL),
(90, 37, 12, 1.00, '2025-05-16', '2025-05-23', 'SuperAdmin', NULL, '2025-05-15 19:01:32', '2025-05-15 19:01:32', NULL);

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
(20, 'ក្រែម'),
(21, 'ស្រាបៀABCដប'),
(26, 'AFAFGADF'),
(34, 'AF'),
(35, 'sana'),
(36, 'AF'),
(37, '001');

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
(78, 6, 1, 107, '2025-03-17', 5, 0.00, 3.00, 0.00, 7.00, NULL, 15.00, 'completed', 'admin', 'SuperAdmin', '2025-02-25 07:40:58', '2025-04-28 18:34:29', NULL),
(79, 5, 1, 108, '2025-05-08', 1, 0.00, 3.00, 0.00, 7.00, NULL, 3.00, 'active', 'SuperAdmin', NULL, '2025-04-28 18:36:00', '2025-04-28 18:36:00', NULL),
(80, 5, 8, 108, '2025-05-08', 1, 0.00, 2.50, 0.00, 4.00, NULL, 2.50, 'active', 'SuperAdmin', NULL, '2025-04-28 18:36:00', '2025-04-28 18:36:00', NULL),
(81, 4, 1, 109, '2025-04-28', 1, 0.00, 3.00, 0.00, 7.00, NULL, 3.00, 'active', 'SuperAdmin', 'SuperAdmin', '2025-04-28 18:53:02', '2025-04-28 18:53:32', NULL),
(82, 5, 8, 110, '2025-05-05', 1, 0.00, 2.50, 0.00, 4.00, NULL, 2.50, 'completed', 'admin', 'SuperAdmin', '2025-05-05 14:28:03', '2025-05-11 18:29:59', NULL),
(83, 5, 8, 111, '2025-05-10', 3, 0.00, 2.50, 0.00, 4.00, NULL, 7.50, 'completed', 'admin', 'SuperAdmin', '2025-05-10 03:55:10', '2025-05-11 18:30:28', NULL),
(84, 5, 1, 112, '2025-05-11', 1, 0.00, 3.00, 2.00, 7.00, NULL, 1.00, 'completed', 'SuperAdmin', NULL, '2025-05-11 18:11:33', '2025-05-11 18:51:52', NULL),
(85, 5, 8, 112, '2025-05-11', 1, 0.00, 2.50, 1.00, 4.00, NULL, 1.50, 'completed', 'SuperAdmin', NULL, '2025-05-11 18:11:33', '2025-05-11 18:51:52', NULL),
(86, 5, 1, 113, '2025-05-11', 1, 0.00, 3.00, 1.00, 7.00, NULL, 4.00, 'active', 'SuperAdmin', 'SuperAdmin', '2025-05-11 18:19:28', '2025-05-11 18:58:10', NULL),
(87, 5, 8, 113, '2025-05-11', 1, 0.00, 2.50, 1.00, 4.00, NULL, 3.50, 'active', 'SuperAdmin', 'SuperAdmin', '2025-05-11 18:19:28', '2025-05-11 18:58:10', NULL),
(88, 4, 8, 114, '2025-05-11', 1, 0.00, 2.50, 0.00, 4.00, NULL, 2.50, 'active', 'SuperAdmin', 'SuperAdmin', '2025-05-11 18:36:36', '2025-05-11 18:36:43', NULL),
(89, 4, 1, 114, '2025-05-11', 1, 0.00, 3.00, 0.00, 7.00, NULL, 3.00, 'active', 'SuperAdmin', 'SuperAdmin', '2025-05-11 18:37:20', '2025-05-11 18:56:40', NULL),
(90, 4, 9, 114, '2025-05-11', 1, 0.00, 30.00, 0.00, 35.00, NULL, 30.00, 'active', 'SuperAdmin', 'SuperAdmin', '2025-05-11 18:37:20', '2025-05-11 18:56:40', NULL),
(91, 4, 1, 115, '2025-05-11', 1, 0.00, 3.00, 0.00, 7.00, NULL, 3.00, 'active', 'SuperAdmin', NULL, '2025-05-11 19:02:52', '2025-05-11 19:02:52', NULL),
(92, 4, 8, 115, '2025-05-11', 1, 0.00, 2.50, 0.00, 4.00, NULL, 2.50, 'active', 'SuperAdmin', NULL, '2025-05-11 19:02:52', '2025-05-11 19:02:52', NULL),
(93, 4, 9, 115, '2025-05-11', 2, 0.00, 30.00, 0.00, 35.00, NULL, 60.00, 'active', 'SuperAdmin', NULL, '2025-05-11 19:02:52', '2025-05-11 19:02:52', NULL);

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
(107, NULL, NULL, 15.00, 0.00, 15.00, '2025-02-25', '2025-02-25 07:40:58', '2025-05-11 18:41:15'),
(108, 4, 5, 5.50, 2.00, 3.50, '2025-04-28', '2025-04-28 18:36:00', '2025-04-28 18:36:00'),
(109, NULL, NULL, 3.00, 0.00, 3.00, '2025-04-28', '2025-04-28 18:53:02', '2025-05-11 18:26:36'),
(110, NULL, NULL, 2.50, 0.00, 2.50, '2025-05-05', '2025-05-05 14:28:03', '2025-05-11 18:30:49'),
(111, NULL, 5, 7.50, 0.00, 7.50, '2025-05-10', '2025-05-10 03:55:10', '2025-05-10 03:55:10'),
(112, NULL, NULL, 2.50, 2.00, 0.50, '2025-05-11', '2025-05-11 18:11:33', '2025-05-11 18:11:33'),
(113, NULL, NULL, 7.50, 2.00, 1.50, '2025-05-11', '2025-05-11 18:19:28', '2025-05-11 18:58:10'),
(114, NULL, 5, 35.50, 0.00, 35.50, '2025-05-11', '2025-05-11 18:36:36', '2025-05-11 18:37:20'),
(115, NULL, NULL, 65.50, 5.00, 60.50, '2025-05-11', '2025-05-11 19:02:52', '2025-05-11 19:02:52');

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
CREATE TRIGGER `after_purchase_detail_update` AFTER UPDATE ON `purchase_detail` FOR EACH ROW BEGIN
    DECLARE purchase_status VARCHAR(50);

    -- Safely get the status from the related `purchase` row (LIMIT 1 prevents multiple row error)
    SELECT p.status INTO purchase_status
    FROM purchase p
    WHERE p.purchasedetail_id = NEW.id
    LIMIT 1;

    -- Update account balance only if the purchase status is 'completed' or 'active'
    IF purchase_status IS NOT NULL AND (purchase_status = 'completed' OR purchase_status = 'active') THEN
        -- Adjust balance: subtract new payment, add back the old one (reversing the previous effect)
        UPDATE acount
        SET balance = balance + OLD.amount_pay - NEW.amount_pay
        WHERE id = NEW.account_id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `sales_opening_report`
--

CREATE TABLE `sales_opening_report` (
  `id` int(11) NOT NULL,
  `opening_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `shift` varchar(50) NOT NULL,
  `cashier_id` int(11) NOT NULL,
  `opening_balance` decimal(10,2) NOT NULL,
  `expected_sales` decimal(10,2) DEFAULT 0.00,
  `actual_sales` decimal(10,2) DEFAULT 0.00,
  `cash_in` decimal(10,2) DEFAULT 0.00,
  `cash_out` decimal(8,2) NOT NULL DEFAULT 0.00,
  `closing_balance` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_update` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sales_opening_report`
--

INSERT INTO `sales_opening_report` (`id`, `opening_date`, `end_date`, `shift`, `cashier_id`, `opening_balance`, `expected_sales`, `actual_sales`, `cash_in`, `cash_out`, `closing_balance`, `created_at`, `updated_at`, `user_update`) VALUES
(1, '2025-03-09 00:00:11', '2025-03-12 00:21:55', 'Morning', 1, 120.00, 0.00, 0.00, 0.00, 0.00, -10.00, '2025-03-16 17:00:11', '2025-03-23 16:29:43', 1),
(2, '2025-03-28 05:40:47', '2025-03-29 11:50:35', 'Morning', 1, 100.00, 0.00, 0.00, 0.00, 0.00, 160.00, '2025-03-28 04:41:10', '2025-03-28 05:08:31', 2),
(3, '2025-03-28 12:58:06', '2025-03-28 12:58:39', 'Morning', 3, 100.00, 0.00, 0.00, 0.00, 0.00, 0.00, '2025-03-28 05:58:06', '2025-03-28 06:20:14', NULL),
(4, '2025-03-28 13:24:27', '2025-03-28 13:24:34', 'Morning', 3, 100.00, 0.00, 0.00, 0.00, 0.00, -100.00, '2025-03-28 06:24:27', '2025-03-28 06:25:35', NULL),
(5, '2025-03-17 00:00:11', '2025-03-21 00:21:55', 'Morning', 1, 20.00, 0.00, 0.00, 0.00, 0.00, 120.00, '2025-03-16 17:00:11', '2025-03-23 16:29:46', 1),
(15, '2025-05-05 20:46:05', '2025-05-05 20:49:10', 'Morning', 1, 100.00, 0.00, 0.00, 24.91, 0.00, -75.09, '2025-05-05 13:46:05', '2025-05-05 13:49:10', NULL),
(16, '2025-05-10 00:24:00', '2025-05-10 01:01:14', 'Morning', 1, 100.00, 0.00, 0.00, 24.91, 0.00, -75.09, '2025-05-09 17:24:00', '2025-05-09 18:01:14', NULL),
(17, '2025-05-10 11:09:11', '2025-05-10 11:20:49', 'Morning', 1, 100.00, 0.00, 0.00, 10.00, 0.00, -90.00, '2025-05-10 04:09:11', '2025-05-10 04:20:49', NULL),
(18, '2025-05-12 12:28:13', '2025-05-15 19:33:39', 'Morning', 3, 12.00, 0.00, 0.00, 0.00, 0.00, -12.00, '2025-05-12 05:28:13', '2025-05-15 12:33:39', NULL),
(19, '2025-05-15 20:08:55', '2025-05-15 21:58:47', 'Morning', 3, 100.00, 0.00, 0.00, 7.89, 0.00, -92.11, '2025-05-15 13:08:55', '2025-05-15 14:58:47', NULL);

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
(1, 'អជីវកម្ម', '0123456789', '0965752080', 'ហាងបាយ', NULL, 'SR', 'មានរស់ជាតិឆ្ងាញ់', 'nakry@example.com', 'admin', 'SuperAdmin', '2024-10-22 03:48:38', '2025-05-11 17:34:14', NULL),
(3, 'អជីវកម្ម', '9654322', NULL, 'ហាងលក់កុំព្យូទ័រ', NULL, NULL, '11', NULL, 'admin', 'SuperAdmin', '2024-10-22 04:24:18', '2025-03-22 05:59:05', NULL),
(4, 'ផ្ទាល់ខ្លួន', NULL, '098765', NULL, 'Shop phone', NULL, '1', NULL, 'admin', 'admin', '2024-10-28 06:27:18', '2025-03-06 15:28:38', NULL),
(5, 'ផ្ទាល់ខ្លួន', NULL, '0974882673', NULL, 'My shop 311', '311', 'shop', 'myshop311@gmail.com', 'admin', 'SuperAdmin', '2025-02-24 13:20:20', '2025-05-11 17:25:01', NULL),
(6, 'ផ្ទាល់ខ្លួន', NULL, '097643', NULL, 'LV', NULL, NULL, NULL, 'admin', 'admin', '2025-02-24 13:32:09', '2025-03-06 15:28:29', NULL);

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
,`unit_id` int(11)
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
(9, 12, 23, 'ខែ', 'wef', NULL, NULL, NULL);

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

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_nameproducts`  AS SELECT `pro`.`id` AS `id`, `pro`.`qty` AS `stock_qty`, `pro`.`brand_id` AS `brand_id`, `pro`.`unit_id` AS `unit_id`, `pro`.`mg_stock` AS `mg_stock`, `pro`.`pro_names` AS `pro_names`, `cat`.`cat_names` AS `cat_names`, `pro`.`category_id` AS `category_id`, `u`.`names` AS `unit_names`, `b`.`brand_names` AS `brand_names` FROM (((`products` `pro` left join `category` `cat` on(`pro`.`category_id` = `cat`.`id`)) left join `unit` `u` on(`pro`.`unit_id` = `u`.`id`)) left join `brands` `b` on(`pro`.`brand_id` = `b`.`id`)) ;

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
-- Indexes for table `cash_withdrawals`
--
ALTER TABLE `cash_withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cashier_id` (`cashier_id`);

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
  ADD KEY `cost_ibfk_2` (`account_id`),
  ADD KEY `opening_id` (`opening_id`);

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
  ADD KEY `paymenttype_id` (`paymenttype_id`),
  ADD KEY `opening_id` (`opening_id`);

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
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `order_detail_id` (`order_detail_id`);

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
  ADD KEY `product_discount_ibfk_2` (`product_discount_detail_id`);

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
  ADD KEY `purchase_ibfk_4` (`purchasedetail_id`),
  ADD KEY `purchase_ibfk_2` (`product_id`),
  ADD KEY `purchase_ibfk_5` (`supplier_id`);

--
-- Indexes for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paymenttype_id` (`paymenttype_id`),
  ADD KEY `purchase_detail_ibfk_2` (`account_id`);

--
-- Indexes for table `sales_opening_report`
--
ALTER TABLE `sales_opening_report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sales_opening_report_ibfk_1` (`cashier_id`),
  ADD KEY `user_update` (`user_update`);

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
-- AUTO_INCREMENT for table `cash_withdrawals`
--
ALTER TABLE `cash_withdrawals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cost`
--
ALTER TABLE `cost`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `cost_type`
--
ALTER TABLE `cost_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `order_repay`
--
ALTER TABLE `order_repay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_repay_detail`
--
ALTER TABLE `order_repay_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `product_discount_detail`
--
ALTER TABLE `product_discount_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `purchase_detail`
--
ALTER TABLE `purchase_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `sales_opening_report`
--
ALTER TABLE `sales_opening_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

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
  ADD CONSTRAINT `cost_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `acount` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `cost_ibfk_3` FOREIGN KEY (`opening_id`) REFERENCES `sales_opening_report` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

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
  ADD CONSTRAINT `order_detail_ibfk_2` FOREIGN KEY (`paymenttype_id`) REFERENCES `payment_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_detail_ibfk_3` FOREIGN KEY (`opening_id`) REFERENCES `sales_opening_report` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
  ADD CONSTRAINT `order_repay_detail_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `order_repay_detail_ibfk_3` FOREIGN KEY (`order_detail_id`) REFERENCES `order_detail` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

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
  ADD CONSTRAINT `product_discount_ibfk_2` FOREIGN KEY (`product_discount_detail_id`) REFERENCES `product_discount_detail` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `purchase_detail_ibfk_1` FOREIGN KEY (`paymenttype_id`) REFERENCES `payment_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_detail_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `acount` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sales_opening_report`
--
ALTER TABLE `sales_opening_report`
  ADD CONSTRAINT `sales_opening_report_ibfk_1` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `sales_opening_report_ibfk_3` FOREIGN KEY (`user_update`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

CREATE DEFINER=`root`@`localhost` EVENT `update_product_discounts` ON SCHEDULE EVERY 2 SECOND STARTS '2025-05-16 01:59:22' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    -- Step 1: Apply current discounts based on date range
    UPDATE products p
    JOIN (
        SELECT product_id, MAX(discount_amount) AS discount
        FROM product_discount
        WHERE CURDATE() BETWEEN date_start AND date_end
        GROUP BY product_id
    ) valid_discounts ON p.id = valid_discounts.product_id
    SET p.discount = valid_discounts.discount;

    -- Step 2: Reset discount if no valid discount exists today
    UPDATE products p
    LEFT JOIN (
        SELECT DISTINCT product_id
        FROM product_discount
        WHERE CURDATE() BETWEEN date_start AND date_end
    ) active ON p.id = active.product_id
    SET p.discount = 0.00
    WHERE active.product_id IS NULL;
END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
