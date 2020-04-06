/*
Navicat MySQL Data Transfer

Source Server         : 14sql
Source Server Version : 50711
Source Host           : 172.31.4.14:3306
Source Database       : pfwang

Target Server Type    : MYSQL
Target Server Version : 50711
File Encoding         : 65001

Date: 2018-11-15 13:54:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookname` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `publish` varchar(255) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `borrowstatus` varchar(255) DEFAULT NULL,
  `borrowname` int(11) NOT NULL DEFAULT '1',
  `addtime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `borrowtime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleteStatus` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `borrowname` (`borrowname`),
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`borrowname`) REFERENCES `usertest` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for headset
-- ----------------------------
DROP TABLE IF EXISTS `headset`;
CREATE TABLE `headset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) DEFAULT '',
  `SN` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `finishType` varchar(255) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `borrowstatus` varchar(255) DEFAULT NULL,
  `borrowname` int(11) NOT NULL DEFAULT '1',
  `addtime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `borrowtime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleteStatus` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `borrowname` (`borrowname`),
  CONSTRAINT `headset_ibfk_1` FOREIGN KEY (`borrowname`) REFERENCES `usertest` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for organization
-- ----------------------------
DROP TABLE IF EXISTS `organization`;
CREATE TABLE `organization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `deleteStatus` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for phonelist
-- ----------------------------
DROP TABLE IF EXISTS `phonelist`;
CREATE TABLE `phonelist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `imei` varchar(255) DEFAULT NULL,
  `system` varchar(255) DEFAULT NULL,
  `describe` varchar(255) DEFAULT NULL,
  `quality` varchar(255) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `borrowstatus` varchar(255) DEFAULT NULL,
  `borrowname` int(11) DEFAULT '1',
  `addtime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `borrowtime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleteStatus` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `borrowname` (`borrowname`),
  CONSTRAINT `phonelist_ibfk_1` FOREIGN KEY (`borrowname`) REFERENCES `usertest` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for SIM
-- ----------------------------
DROP TABLE IF EXISTS `SIM`;
CREATE TABLE `SIM` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(255) DEFAULT NULL,
  `IMSI` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `operator` varchar(255) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `borrowstatus` varchar(255) DEFAULT NULL,
  `borrowname` int(11) NOT NULL DEFAULT '1',
  `addtime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `borrowtime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleteStatus` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `borrowname` (`borrowname`),
  CONSTRAINT `SIM_ibfk_1` FOREIGN KEY (`borrowname`) REFERENCES `usertest` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for usertest
-- ----------------------------
DROP TABLE IF EXISTS `usertest`;
CREATE TABLE `usertest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `wxid` varchar(255) DEFAULT NULL,
  `organizationid` int(11) DEFAULT NULL,
  `deleteStatus` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `organizationid` (`organizationid`),
  CONSTRAINT `usertest_ibfk_1` FOREIGN KEY (`organizationid`) REFERENCES `organization` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;
