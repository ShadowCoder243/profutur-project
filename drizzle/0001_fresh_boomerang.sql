CREATE TABLE `ambassadorProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`networkSize` int DEFAULT 0,
	`totalCommissions` decimal(10,2) DEFAULT 0,
	`referrals` int DEFAULT 0,
	`status` enum('active','inactive') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ambassadorProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `ambassadorProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `centerProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`centerName` varchar(255) NOT NULL,
	`description` longtext,
	`location` varchar(255),
	`phone` varchar(20),
	`website` varchar(255),
	`logo` text,
	`totalStudents` int DEFAULT 0,
	`totalFormations` int DEFAULT 0,
	`rating` decimal(3,2) DEFAULT 0,
	`isVerified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `centerProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `centerProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`certificateNumber` varchar(255) NOT NULL,
	`issueDate` timestamp NOT NULL DEFAULT (now()),
	`expiryDate` timestamp,
	`verificationUrl` text,
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificateNumber_unique` UNIQUE(`certificateNumber`)
);
--> statement-breakpoint
CREATE TABLE `donations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donorId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`description` text,
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`transactionHash` varchar(255),
	`donatedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `donations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`formationId` int NOT NULL,
	`status` enum('pending','active','completed','dropped') DEFAULT 'pending',
	`progress` int DEFAULT 0,
	`enrolledAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`certificateIssued` boolean DEFAULT false,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `formations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`centerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`category` varchar(100),
	`level` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
	`duration` int,
	`price` decimal(10,2),
	`maxStudents` int,
	`currentStudents` int DEFAULT 0,
	`image` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `formations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nftBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeType` enum('bronze','silver','gold','diamond','legendary') NOT NULL,
	`tokenId` varchar(255),
	`metadataUri` text,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nftBadges_id` PRIMARY KEY(`id`),
	CONSTRAINT `nftBadges_tokenId_unique` UNIQUE(`tokenId`)
);
--> statement-breakpoint
CREATE TABLE `studentProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`specialization` varchar(255),
	`bio` text,
	`skills` text,
	`completedFormations` int DEFAULT 0,
	`totalHoursLearned` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studentProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `studentProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromUserId` int,
	`toUserId` int,
	`amount` decimal(10,2) NOT NULL,
	`type` enum('donation','payment','commission','refund') NOT NULL,
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`description` text,
	`blockchainHash` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
