CREATE TABLE `blockchainRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recordType` enum('certificate','donation','badge') NOT NULL,
	`relatedId` int NOT NULL,
	`tokenId` varchar(255),
	`transactionHash` varchar(255) NOT NULL,
	`network` varchar(50) DEFAULT 'hedera-testnet',
	`metadata` longtext,
	`verified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blockchainRecords_id` PRIMARY KEY(`id`),
	CONSTRAINT `blockchainRecords_transactionHash_unique` UNIQUE(`transactionHash`)
);
--> statement-breakpoint
CREATE TABLE `mobileMoneyTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`transactionId` varchar(255) NOT NULL,
	`provider` enum('orange','vodacom','airtel') NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`description` text,
	`metadata` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mobileMoneyTransactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `mobileMoneyTransactions_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
ALTER TABLE `certificates` ADD `tokenId` varchar(255);--> statement-breakpoint
ALTER TABLE `certificates` ADD `blockchainHash` varchar(255);