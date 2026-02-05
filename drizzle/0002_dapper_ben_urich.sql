ALTER TABLE `ambassadorProfiles` MODIFY COLUMN `totalCommissions` decimal(10,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `centerProfiles` MODIFY COLUMN `rating` decimal(3,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','student','center','ambassador') NOT NULL DEFAULT 'user';