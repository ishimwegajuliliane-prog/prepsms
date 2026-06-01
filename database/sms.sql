-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2026 at 10:58 AM
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
-- Database: `sms`
--

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productcode` varchar(50) NOT NULL,
  `productname` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `quantityinstock` int(11) DEFAULT 0,
  `unitprice` decimal(10,2) NOT NULL,
  `suppliername` varchar(100) DEFAULT NULL,
  `datereceived` date NOT NULL,
  `warehousecode` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productcode`, `productname`, `category`, `quantityinstock`, `unitprice`, `suppliername`, `datereceived`, `warehousecode`) VALUES
('3', 'mango', 'juice', 5, 0.03, 'kgl', '2026-06-01', 'WH-02'),
('5', 'cake', 'solid', 10, 0.04, 'nyanza', '2026-06-01', 'WH-01');

-- --------------------------------------------------------

--
-- Table structure for table `stocktransaction`
--

CREATE TABLE `stocktransaction` (
  `transactioncode` varchar(50) NOT NULL,
  `productcode` varchar(50) DEFAULT NULL,
  `warehousecode` varchar(50) DEFAULT NULL,
  `quantitymoved` int(11) NOT NULL,
  `transactiontype` enum('Stock In','Stock Out') NOT NULL,
  `transactiondate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocktransaction`
--

INSERT INTO `stocktransaction` (`transactioncode`, `productcode`, `warehousecode`, `quantitymoved`, `transactiontype`, `transactiondate`) VALUES
('7', '5', '2', 6, 'Stock In', '2026-06-01 07:52:24');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'admin', 'admin123');

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `warehousecode` varchar(50) NOT NULL,
  `warehousename` varchar(100) NOT NULL,
  `warehouselocation` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`warehousecode`, `warehousename`, `warehouselocation`) VALUES
('2', 'qwer', 'asdfg'),
('23456789', '.,kmjnhbgvfcx', 'sdfghjk'),
('5', 'i nyange', ' kgl'),
('567', 'tyui', 'fghj'),
('WH-01', 'Main Warehouse', 'Location A'),
('WH-02', 'Secondary Warehouse', 'Location B');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productcode`);

--
-- Indexes for table `stocktransaction`
--
ALTER TABLE `stocktransaction`
  ADD PRIMARY KEY (`transactioncode`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`warehousecode`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
