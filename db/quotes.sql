-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 24, 2012 at 08:50 PM
-- Server version: 5.1.53
-- PHP Version: 5.3.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `quotes`
--

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE IF NOT EXISTS `languages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT 'english',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=5 ;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `name`) VALUES
(1, 'ENGLISH'),
(2, 'RUSSIAN');

-- --------------------------------------------------------

--
-- Table structure for table `origin_types`
--

CREATE TABLE IF NOT EXISTS `origin_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type_text` varchar(100) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Dumping data for table `origin_types`
--

INSERT INTO `origin_types` (`id`, `type_text`) VALUES
(1, 'MOVIE'),
(2, 'FAMOUS PEOPLE');

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE IF NOT EXISTS `quotes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quote_text` text COLLATE utf8_bin NOT NULL,
  `language_id` int(11) unsigned DEFAULT NULL,
  `comments` text COLLATE utf8_bin NOT NULL,
  `origin_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `origin_id` (`origin_id`),
  KEY `language_id` (`language_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=20 ;

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`id`, `quote_text`, `language_id`, `comments`, `origin_id`) VALUES
(1, 'movie 1 quote 1', 1, '', 1),
(2, 'movie 1 quote 2', 1, '', 1),
(3, 'movie 1 quote 3', 1, '', 1),
(4, 'movie 2 quote 1', 1, '', 2),
(5, 'movie 2 quote 2', 1, '', 2),
(6, 'movie 3 quote 1', 1, '', 3),
(7, 'famous people 1 quote 1', 1, '', 4),
(8, 'famous people 1 quote 2', 1, '', 4),
(9, 'famous people 2 quote 1', 1, '', 5),
(10, 'famous people 3 quote 1', 1, '', 6),
(11, 'famous people 3 quote 2', 1, '', 6),
(12, 'famous people 3 quote 3', 1, '', 6),
(13, 'movie 4 quote 1', 1, '', 7),
(14, 'movie 4 quote 2', 1, '', 7),
(15, 'movie 4 quote 3', 1, '', 7),
(16, 'movie 5 quote 1', 1, '', 8),
(17, 'movie 5 quote 2', 1, '', 8),
(18, 'movie 6 quote 1', 1, '', 9),
(19, 'movie 7 quote 1', 1, '', 10);

-- --------------------------------------------------------

--
-- Table structure for table `quote_origins`
--

CREATE TABLE IF NOT EXISTS `quote_origins` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `origin_text` text COLLATE utf8_bin NOT NULL,
  `type_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=14 ;

--
-- Dumping data for table `quote_origins`
--

INSERT INTO `quote_origins` (`id`, `origin_text`, `type_id`) VALUES
(1, 'movie origin 1', 1),
(2, 'movie origin 2', 1),
(3, 'movie origin 3', 1),
(4, 'famous people origin 1', 2),
(5, 'famous people origin 2', 2),
(6, 'famous people origin 3', 2),
(7, 'movie origin 4', 1),
(8, 'movie origin 5', 1),
(9, 'movie origin 6', 1),
(10, 'movie origin 7', 1),
(11, 'movie origin 8', 1),
(12, 'movie origin 9', 1),
(13, 'movie origin 10', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `quotes`
--
ALTER TABLE `quotes`
  ADD CONSTRAINT `quotes_ibfk_2` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `quotes_ibfk_1` FOREIGN KEY (`origin_id`) REFERENCES `quote_origins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `quote_origins`
--
ALTER TABLE `quote_origins`
  ADD CONSTRAINT `quote_origins_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `origin_types` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
