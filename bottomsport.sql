-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2025 at 04:58 PM
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
-- Database: `bottomsport`
--
CREATE DATABASE IF NOT EXISTS `bottomsport` DEFAULT CHARACTER SET utf8 COLLATE utf8_lithuanian_ci;
USE `bottomsport`;

-- --------------------------------------------------------

--
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
CREATE TABLE `actions` (
  `id` int(11) NOT NULL,
  `action_type` enum('hit','stand','double','split','dealer') DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `rank` varchar(10) DEFAULT NULL,
  `symbol` varchar(10) DEFAULT NULL,
  `is_hidden` tinyint(1) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `actions`:
--   `user_id`
--       `users` -> `id`
--   `game_id`
--       `games` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `bets`
--

DROP TABLE IF EXISTS `bets`;
CREATE TABLE `bets` (
  `id` int(11) NOT NULL,
  `sum` float DEFAULT NULL,
  `bet_time` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `bets`:
--   `user_id`
--       `users` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `bots`
--

DROP TABLE IF EXISTS `bots`;
CREATE TABLE `bots` (
  `id` int(11) NOT NULL,
  `strategy` enum('aggressive','conservative') DEFAULT NULL,
  `betting_sum` float DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `bots`:
--   `user_id`
--       `users` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `card_placement_hash` varchar(255) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `games`:
--   `room_id`
--       `rooms` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `mcstats`
--

DROP TABLE IF EXISTS `mcstats`;
CREATE TABLE `mcstats` (
  `id` int(11) NOT NULL,
  `game_num` int(11) DEFAULT NULL,
  `game_date` date DEFAULT NULL,
  `steps_done` int(11) DEFAULT NULL,
  `bet_amount` float DEFAULT NULL,
  `winnings` float DEFAULT NULL,
  `result` enum('win','loss') DEFAULT NULL,
  `mission_game_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `mcstats`:
--   `mission_game_id`
--       `missioncrossablegames` -> `id`
--   `user_id`
--       `users` -> `id`
--

--
-- Dumping data for table `mcstats`
--

INSERT INTO `mcstats` (`id`, `game_num`, `game_date`, `steps_done`, `bet_amount`, `winnings`, `result`, `mission_game_id`, `user_id`) VALUES
(1, 1, '2025-05-14', 4, 22.12, 30.968, 'win', 3, 7),
(2, 2, '2025-05-14', 3, 53.43, 96.174, 'win', 4, 7),
(3, 3, '2025-05-14', 5, 21.75, 32.625, 'win', 5, 7),
(4, 4, '2025-05-14', 2, 100, 220, 'win', 6, 7),
(5, 5, '2025-05-14', 3, 100, 250, 'win', 7, 7),
(6, 6, '2025-05-14', 0, 100, 0, 'loss', 8, 7),
(7, 7, '2025-05-14', 4, 100, 280, 'win', 9, 7),
(8, 8, '2025-05-14', 3, 100, 0, 'loss', 10, 7),
(9, 9, '2025-05-14', 9, 100, 0, 'loss', 11, 7),
(10, 10, '2025-05-14', 7, 100, 0, 'loss', 12, 7),
(11, 11, '2025-05-14', 2, 0.01, 0, 'loss', 13, 7),
(12, 12, '2025-05-14', 33, 0.01, 0, 'loss', 14, 7),
(13, 13, '2025-05-14', 13, 1, 0, 'loss', 15, 7),
(14, 14, '2025-05-14', 25, 1, 3.5, 'win', 16, 7),
(15, 15, '2025-05-14', 6, 1, 0, 'loss', 17, 7),
(16, 16, '2025-05-14', 25, 1, 3.5, 'win', 18, 7),
(17, 17, '2025-05-14', 23, 1, 0, 'loss', 19, 7),
(18, 18, '2025-05-14', 25, 1, 3.5, 'win', 20, 7),
(19, 19, '2025-05-14', 8, 1, 0, 'loss', 21, 7),
(20, 20, '2025-05-15', 0, 53.6, 58.424, 'win', 22, 7),
(21, 21, '2025-05-15', 3, 53.6, 82.544, 'win', 23, 7),
(22, 22, '2025-05-15', 2, 53.6, 0, 'loss', 24, 7),
(23, 23, '2025-05-15', 7, 53.6, 139.36, 'win', 25, 7),
(24, 24, '2025-05-15', 0, 53.6, 0, 'loss', 26, 7),
(25, 25, '2025-05-15', 0, 89.59, 0, 'loss', 27, 7),
(26, 26, '2025-05-15', 1, 89.59, 0, 'loss', 28, 7),
(27, 27, '2025-05-15', 0, 89.59, 0, 'loss', 29, 7),
(28, 28, '2025-05-15', 2, 89.59, 197.098, 'win', 30, 7),
(29, 29, '2025-05-15', 1, 89.59, 0, 'loss', 31, 7),
(30, 30, '2025-05-15', 0, 62.51, 0, 'loss', 32, 7),
(31, 31, '2025-05-15', 3, 62.51, 0, 'loss', 33, 7),
(32, 32, '2025-05-15', 2, 62.51, 0, 'loss', 34, 7),
(33, 33, '2025-05-15', 3, 62.24, 80.912, 'win', 35, 7),
(34, 34, '2025-05-15', 0, 100, 100, 'win', 36, 7),
(35, 35, '2025-05-15', 20, 100, 300, 'win', 37, 7),
(36, 1, '2025-05-15', 0, 100, 0, 'loss', 38, 8),
(37, 2, '2025-05-15', 0, 100, 0, 'loss', 39, 8),
(38, 3, '2025-05-15', 11, 100, 210, 'win', 40, 8),
(39, 4, '2025-05-15', 1, 18.7, 20.57, 'win', 41, 8),
(40, 36, '2025-05-15', 0, 100, 160, 'win', 42, 7),
(41, 37, '2025-05-15', 3, 100, 0, 'loss', 43, 7),
(42, 38, '2025-05-15', 2, 100, 220, 'win', 44, 7),
(43, 39, '2025-05-15', 0, 100, 160, 'win', 45, 7),
(44, 40, '2025-05-15', 0, 100, 160, 'win', 46, 7),
(45, 41, '2025-05-15', 1, 100, 0, 'loss', 47, 7),
(46, 42, '2025-05-15', 1, 100, 190, 'win', 48, 7),
(47, 43, '2025-05-15', 2, 29.36, 35.232, 'win', 49, 7),
(48, 44, '2025-05-15', 0, 29.36, 29.36, 'win', 50, 7),
(49, 45, '2025-05-15', 5, 29.36, 44.04, 'win', 51, 7),
(50, 46, '2025-05-15', 4, 29.36, 41.104, 'win', 52, 7),
(51, 47, '2025-05-15', 9, 29.36, 55.784, 'win', 53, 7),
(52, 48, '2025-05-15', 13, 29.36, 0, 'loss', 54, 7),
(53, 49, '2025-05-15', 5, 1, 0, 'loss', 55, 7),
(54, 50, '2025-05-15', 15, 1, 0, 'loss', 56, 7),
(55, 51, '2025-05-15', 8, 1, 1.8, 'win', 57, 7),
(56, 52, '2025-05-15', 22, 1, 0, 'loss', 58, 7),
(57, 53, '2025-05-15', 5, 1, 1.5, 'win', 59, 7),
(58, 54, '2025-05-15', 3, 65.22, 84.786, 'win', 60, 7),
(59, 55, '2025-05-15', 5, 65.22, 97.83, 'win', 61, 7),
(60, 56, '2025-05-15', 3, 65.22, 0, 'loss', 62, 7),
(61, 57, '2025-05-15', 4, 65.22, 91.308, 'win', 63, 7),
(62, 58, '2025-05-15', 0, 79.8, 0, 'loss', 64, 7),
(63, 59, '2025-05-15', 0, 100, 100, 'win', 65, 7),
(64, 60, '2025-05-15', 3, 90.4688, 117.609, 'win', 66, 7);

-- --------------------------------------------------------

--
-- Table structure for table `missioncrossablegames`
--

DROP TABLE IF EXISTS `missioncrossablegames`;
CREATE TABLE `missioncrossablegames` (
  `id` int(11) NOT NULL,
  `difficulty` enum('easy','medium','hard','daredevil') DEFAULT NULL,
  `bet_amount` float DEFAULT NULL,
  `prize_multiplier` float DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `lanes_completed` int(11) NOT NULL DEFAULT 0,
  `is_complete` tinyint(1) NOT NULL DEFAULT 0,
  `is_won` tinyint(1) NOT NULL DEFAULT 0,
  `payout` float NOT NULL DEFAULT 0,
  `start_time` datetime NOT NULL DEFAULT current_timestamp(),
  `end_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `missioncrossablegames`:
--   `user_id`
--       `users` -> `id`
--

--
-- Dumping data for table `missioncrossablegames`
--

INSERT INTO `missioncrossablegames` (`id`, `difficulty`, `bet_amount`, `prize_multiplier`, `user_id`, `lanes_completed`, `is_complete`, `is_won`, `payout`, `start_time`, `end_time`) VALUES
(3, 'easy', 22.12, 1.4, 7, 4, 1, 1, 30.968, '2025-05-14 22:47:15', '2025-05-14 22:47:23'),
(4, 'hard', 53.43, 1.8, 7, 3, 1, 1, 96.174, '2025-05-14 22:47:51', '2025-05-14 22:47:57'),
(5, 'easy', 21.75, 1.5, 7, 5, 1, 1, 32.625, '2025-05-14 22:51:18', '2025-05-14 22:51:25'),
(6, 'daredevil', 100, 2.2, 7, 2, 1, 1, 220, '2025-05-14 22:51:31', '2025-05-14 22:51:34'),
(7, 'daredevil', 100, 2.5, 7, 3, 1, 1, 250, '2025-05-14 22:51:37', '2025-05-14 22:51:40'),
(8, 'daredevil', 100, 1.6, 7, 0, 1, 0, 0, '2025-05-14 22:51:46', '2025-05-14 22:51:46'),
(9, 'daredevil', 100, 2.8, 7, 4, 1, 1, 280, '2025-05-14 22:51:50', '2025-05-14 22:51:56'),
(10, 'daredevil', 100, 2.5, 7, 3, 1, 0, 0, '2025-05-14 22:53:57', '2025-05-14 22:53:59'),
(11, 'easy', 100, 1.9, 7, 9, 1, 0, 0, '2025-05-14 22:54:02', '2025-05-14 22:54:06'),
(12, 'easy', 100, 1.7, 7, 7, 1, 0, 0, '2025-05-14 22:54:08', '2025-05-14 22:54:12'),
(13, 'easy', 0.01, 1.2, 7, 2, 1, 0, 0, '2025-05-14 22:54:18', '2025-05-14 22:54:19'),
(14, 'easy', 0.01, 4.3, 7, 33, 1, 0, 0, '2025-05-14 22:54:22', '2025-05-14 22:54:33'),
(15, 'easy', 1, 2.3, 7, 13, 1, 0, 0, '2025-05-14 22:57:40', '2025-05-14 22:57:45'),
(16, 'easy', 1, 3.5, 7, 25, 1, 1, 3.5, '2025-05-14 22:57:48', '2025-05-14 22:57:54'),
(17, 'easy', 1, 1.6, 7, 6, 1, 0, 0, '2025-05-14 22:58:00', '2025-05-14 22:58:03'),
(18, 'easy', 1, 3.5, 7, 25, 1, 1, 3.5, '2025-05-14 22:58:06', '2025-05-14 22:58:13'),
(19, 'easy', 1, 3.3, 7, 23, 1, 0, 0, '2025-05-14 22:58:18', '2025-05-14 22:58:25'),
(20, 'easy', 1, 3.5, 7, 25, 1, 1, 3.5, '2025-05-14 22:58:27', '2025-05-14 22:58:34'),
(21, 'hard', 1, 2.8, 7, 8, 0, 0, 0, '2025-05-14 22:58:47', NULL),
(22, 'medium', 53.6, 1.09, 7, 0, 1, 1, 58.424, '2025-05-15 11:31:36', '2025-05-15 11:31:37'),
(23, 'medium', 53.6, 1.54, 7, 3, 1, 1, 82.544, '2025-05-15 11:31:42', '2025-05-15 11:31:46'),
(24, 'hard', 53.6, 1.6, 7, 2, 1, 0, 0, '2025-05-15 11:31:48', '2025-05-15 11:31:50'),
(25, 'hard', 53.6, 2.6, 7, 7, 1, 1, 139.36, '2025-05-15 11:31:53', '2025-05-15 11:31:58'),
(26, 'daredevil', 53.6, 1.6, 7, 0, 1, 0, 0, '2025-05-15 11:32:01', '2025-05-15 11:32:02'),
(27, 'daredevil', 89.59, 1.6, 7, 0, 1, 0, 0, '2025-05-15 11:32:06', '2025-05-15 11:32:07'),
(28, 'daredevil', 89.59, 1.9, 7, 1, 1, 0, 0, '2025-05-15 11:32:09', '2025-05-15 11:32:12'),
(29, 'daredevil', 89.59, 1.6, 7, 0, 1, 0, 0, '2025-05-15 11:32:15', '2025-05-15 11:32:15'),
(30, 'daredevil', 89.59, 2.2, 7, 2, 1, 1, 197.098, '2025-05-15 11:32:17', '2025-05-15 11:32:19'),
(31, 'daredevil', 89.59, 1.9, 7, 1, 1, 0, 0, '2025-05-15 11:32:24', '2025-05-15 11:32:25'),
(32, 'hard', 62.51, 1.2, 7, 0, 1, 0, 0, '2025-05-15 11:35:42', '2025-05-15 11:35:43'),
(33, 'hard', 62.51, 1.8, 7, 3, 1, 0, 0, '2025-05-15 11:35:46', '2025-05-15 11:36:13'),
(34, 'hard', 62.51, 1.6, 7, 2, 1, 0, 0, '2025-05-15 11:36:16', '2025-05-15 11:36:18'),
(35, 'easy', 62.24, 1.3, 7, 3, 1, 1, 80.912, '2025-05-15 11:39:02', '2025-05-15 11:39:05'),
(36, 'easy', 100, 1, 7, 0, 1, 1, 100, '2025-05-15 11:45:14', '2025-05-15 11:45:16'),
(37, 'easy', 100, 3, 7, 20, 1, 1, 300, '2025-05-15 11:45:18', '2025-05-15 11:45:27'),
(38, 'easy', 100, 1, 8, 0, 1, 0, 0, '2025-05-15 13:28:59', '2025-05-15 13:29:01'),
(39, 'easy', 100, 1, 8, 0, 1, 0, 0, '2025-05-15 13:29:03', '2025-05-15 13:29:04'),
(40, 'easy', 100, 2.1, 8, 11, 1, 1, 210, '2025-05-15 13:29:06', '2025-05-15 13:29:12'),
(41, 'easy', 18.7, 1.1, 8, 1, 1, 1, 20.57, '2025-05-15 13:30:57', '2025-05-15 13:30:58'),
(42, 'daredevil', 100, 1.6, 7, 0, 1, 1, 160, '2025-05-15 13:51:21', '2025-05-15 13:51:22'),
(43, 'daredevil', 100, 2.5, 7, 3, 1, 0, 0, '2025-05-15 13:51:27', '2025-05-15 13:51:35'),
(44, 'daredevil', 100, 2.2, 7, 2, 1, 1, 220, '2025-05-15 13:51:37', '2025-05-15 13:51:40'),
(45, 'daredevil', 100, 1.6, 7, 0, 1, 1, 160, '2025-05-15 13:51:43', '2025-05-15 13:51:44'),
(46, 'daredevil', 100, 1.6, 7, 0, 1, 1, 160, '2025-05-15 13:51:57', '2025-05-15 13:54:04'),
(47, 'daredevil', 100, 1.9, 7, 1, 1, 0, 0, '2025-05-15 13:54:23', '2025-05-15 13:54:25'),
(48, 'daredevil', 100, 1.9, 7, 1, 1, 1, 190, '2025-05-15 13:54:27', '2025-05-15 13:54:29'),
(49, 'easy', 29.36, 1.2, 7, 2, 1, 1, 35.232, '2025-05-15 13:55:02', '2025-05-15 13:55:07'),
(50, 'easy', 29.36, 1, 7, 0, 1, 1, 29.36, '2025-05-15 13:55:09', '2025-05-15 13:55:11'),
(51, 'easy', 29.36, 1.5, 7, 5, 1, 1, 44.04, '2025-05-15 13:55:25', '2025-05-15 13:55:28'),
(52, 'easy', 29.36, 1.4, 7, 4, 1, 1, 41.104, '2025-05-15 13:55:30', '2025-05-15 13:55:34'),
(53, 'easy', 29.36, 1.9, 7, 9, 1, 1, 55.784, '2025-05-15 13:55:48', '2025-05-15 13:55:55'),
(54, 'easy', 29.36, 2.3, 7, 13, 0, 0, 0, '2025-05-15 13:55:57', NULL),
(55, 'easy', 1, 1.5, 7, 5, 1, 0, 0, '2025-05-15 14:01:05', '2025-05-15 14:01:12'),
(56, 'easy', 1, 2.5, 7, 15, 0, 0, 0, '2025-05-15 14:01:47', NULL),
(57, 'easy', 1, 1.8, 7, 8, 1, 1, 1.8, '2025-05-15 14:03:36', '2025-05-15 14:03:42'),
(58, 'easy', 1, 3.2, 7, 22, 1, 0, 0, '2025-05-15 14:06:20', '2025-05-15 14:06:35'),
(59, 'easy', 1, 1.5, 7, 5, 1, 1, 1.5, '2025-05-15 14:06:38', '2025-05-15 14:06:41'),
(60, 'easy', 65.22, 1.3, 7, 3, 1, 1, 84.786, '2025-05-15 14:07:23', '2025-05-15 14:07:26'),
(61, 'easy', 65.22, 1.5, 7, 5, 1, 1, 97.83, '2025-05-15 14:07:32', '2025-05-15 14:07:38'),
(62, 'easy', 65.22, 1.3, 7, 3, 1, 0, 0, '2025-05-15 14:07:44', '2025-05-15 14:07:47'),
(63, 'easy', 65.22, 1.4, 7, 4, 1, 1, 91.308, '2025-05-15 14:07:50', '2025-05-15 14:07:54'),
(64, 'easy', 79.8, 1, 7, 0, 0, 0, 0, '2025-05-15 14:28:57', NULL),
(65, 'easy', 100, 1, 7, 0, 1, 1, 100, '2025-05-15 14:46:38', '2025-05-15 14:46:41'),
(66, 'easy', 90.4688, 1.3, 7, 3, 1, 1, 117.609, '2025-05-15 14:47:06', '2025-05-15 14:47:10');

-- --------------------------------------------------------

--
-- Table structure for table `roomparticipants`
--

DROP TABLE IF EXISTS `roomparticipants`;
CREATE TABLE `roomparticipants` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `is_playing` tinyint(1) DEFAULT NULL,
  `is_creator` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `roomparticipants`:
--   `user_id`
--       `users` -> `id`
--   `room_id`
--       `rooms` -> `id`
--

--
-- Dumping data for table `roomparticipants`
--

INSERT INTO `roomparticipants` (`id`, `user_id`, `room_id`, `is_playing`, `is_creator`) VALUES
(5, 7, 6, 0, 1),
(6, 7, 7, 0, 1),
(8, 7, 9, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `room_creator` int(11) DEFAULT NULL,
  `min_bet` float DEFAULT NULL,
  `max_bet` float DEFAULT NULL,
  `room_status` enum('active','inactive','hidden') DEFAULT NULL,
  `creation_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `rooms`:
--   `room_creator`
--       `users` -> `id`
--

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `title`, `room_creator`, `min_bet`, `max_bet`, `room_status`, `creation_date`) VALUES
(6, 'AAA', 7, 10, 1000, 'active', '2025-04-24'),
(7, 'aaaaa', 7, 10, 1000, 'active', '2025-04-24'),
(9, 'HAHAHAHAHA IT WORKS', 7, 1000, 100000, 'active', '2025-04-24'),
(10, 'a', 7, 10, 0, 'active', '2025-04-29'),
(12, '', 8, 0, 0, 'active', '2025-04-29');

-- --------------------------------------------------------

--
-- Table structure for table `suspicions`
--

DROP TABLE IF EXISTS `suspicions`;
CREATE TABLE `suspicions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `suspicions`:
--   `user_id`
--       `users` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `tournaments`
--

DROP TABLE IF EXISTS `tournaments`;
CREATE TABLE `tournaments` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `participation_sum` float DEFAULT NULL,
  `max_players` int(11) DEFAULT NULL,
  `min_players` int(11) DEFAULT NULL,
  `games_count` int(11) DEFAULT NULL,
  `tournament_status` enum('active','inactive','finished') DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `tournaments`:
--   `room_id`
--       `rooms` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `balance_after` decimal(10,2) NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `transactions`:
--   `user_id`
--       `users` -> `id`
--   `game_id`
--       `games` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin','player') NOT NULL,
  `balance` float NOT NULL DEFAULT 0,
  `registration_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_lithuanian_ci;

--
-- RELATIONSHIPS FOR TABLE `users`:
--

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `balance`, `registration_date`) VALUES
(1, 'jannygamesstudio', '73l8gRjwLftklgfdXT+MdiMEjJwGPVMsyVxe16iYpk8=', 'user', 0, '2025-04-13'),
(2, 'jamolisdev', '73l8gRjwLftklgfdXT+MdiMEjJwGPVMsyVxe16iYpk8=', 'user', 0, '2025-04-13'),
(3, 'test', 'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI=', 'user', 0, '2025-04-13'),
(4, 'testuser', 'E9JJ8stBJ7QM+nV4ZoUCeHk/gU3tPFh/5YieiJp6n2w=', 'user', 0, '2025-04-13'),
(5, 'testuser2', 'n2Vnptii6uYaETmxk8mB3W/MI5nwd2DeyN49Rp3s9ao=', 'user', 0, '2025-04-13'),
(6, 'testas', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'user', 0, '2025-04-15'),
(7, 'test1', '123456', 'user', 117.609, '2025-04-15'),
(8, 'daniel', '123', 'user', 911.87, '2025-04-24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actions`
--
ALTER TABLE `actions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indexes for table `bets`
--
ALTER TABLE `bets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `bots`
--
ALTER TABLE `bots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `mcstats`
--
ALTER TABLE `mcstats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mission_game_id` (`mission_game_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `missioncrossablegames`
--
ALTER TABLE `missioncrossablegames`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `roomparticipants`
--
ALTER TABLE `roomparticipants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_creator` (`room_creator`);

--
-- Indexes for table `suspicions`
--
ALTER TABLE `suspicions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tournaments`
--
ALTER TABLE `tournaments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actions`
--
ALTER TABLE `actions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bets`
--
ALTER TABLE `bets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bots`
--
ALTER TABLE `bots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mcstats`
--
ALTER TABLE `mcstats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `missioncrossablegames`
--
ALTER TABLE `missioncrossablegames`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `roomparticipants`
--
ALTER TABLE `roomparticipants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `suspicions`
--
ALTER TABLE `suspicions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tournaments`
--
ALTER TABLE `tournaments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `actions`
--
ALTER TABLE `actions`
  ADD CONSTRAINT `actions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `actions_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`);

--
-- Constraints for table `bets`
--
ALTER TABLE `bets`
  ADD CONSTRAINT `bets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `bots`
--
ALTER TABLE `bots`
  ADD CONSTRAINT `bots_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Constraints for table `mcstats`
--
ALTER TABLE `mcstats`
  ADD CONSTRAINT `mcstats_ibfk_1` FOREIGN KEY (`mission_game_id`) REFERENCES `missioncrossablegames` (`id`),
  ADD CONSTRAINT `mcstats_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `missioncrossablegames`
--
ALTER TABLE `missioncrossablegames`
  ADD CONSTRAINT `missioncrossablegames_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `roomparticipants`
--
ALTER TABLE `roomparticipants`
  ADD CONSTRAINT `roomparticipants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `roomparticipants_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`room_creator`) REFERENCES `users` (`id`);

--
-- Constraints for table `suspicions`
--
ALTER TABLE `suspicions`
  ADD CONSTRAINT `suspicions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `tournaments`
--
ALTER TABLE `tournaments`
  ADD CONSTRAINT `tournaments_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
