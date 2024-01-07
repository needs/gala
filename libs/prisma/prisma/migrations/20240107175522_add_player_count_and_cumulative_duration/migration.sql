-- AlterTable
ALTER TABLE `Competition` ADD COLUMN `cumulativeDuration` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `playerCount` INTEGER NOT NULL DEFAULT 0;
