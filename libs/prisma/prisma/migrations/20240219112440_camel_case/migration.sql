/*
  Warnings:

  - You are about to drop the column `created_at` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Competition` table. All the data in the column will be lost.
  - The primary key for the `CompetitionUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `competition_uuid` on the `CompetitionUser` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `CompetitionUser` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `CompetitionUser` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `CompetitionUser` table. All the data in the column will be lost.
  - The primary key for the `ScreenShortId` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `competition_uuid` on the `ScreenShortId` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `ScreenShortId` table. All the data in the column will be lost.
  - You are about to drop the column `screen_uuid` on the `ScreenShortId` table. All the data in the column will be lost.
  - You are about to drop the column `short_id` on the `ScreenShortId` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ScreenShortId` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_admin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `competitionUuid` to the `CompetitionUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CompetitionUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CompetitionUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `competitionUuid` to the `ScreenShortId` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screenUuid` to the `ScreenShortId` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortId` to the `ScreenShortId` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ScreenShortId` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `CompetitionUser_competition_uuid_idx` ON `CompetitionUser`;

-- DropIndex
DROP INDEX `CompetitionUser_user_id_idx` ON `CompetitionUser`;

-- DropIndex
DROP INDEX `ScreenShortId_competition_uuid_idx` ON `ScreenShortId`;

-- AlterTable
ALTER TABLE `Competition` RENAME COLUMN `deleted_at` TO `deletedAt`;
ALTER TABLE `Competition` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `Competition` RENAME COLUMN `updated_at` TO `updatedAt`;

-- AlterTable
ALTER TABLE `CompetitionUser` RENAME COLUMN `competition_uuid` TO `competitionUuid`;
ALTER TABLE `CompetitionUser` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `CompetitionUser` RENAME COLUMN `updated_at` TO `updatedAt`;
ALTER TABLE `CompetitionUser` RENAME COLUMN `user_id` TO `userId`;

-- AlterTable
ALTER TABLE `ScreenShortId` RENAME COLUMN `competition_uuid` TO `competitionUuid`;
ALTER TABLE `ScreenShortId` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `ScreenShortId` RENAME COLUMN `screen_uuid` TO `screenUuid`;
ALTER TABLE `ScreenShortId` RENAME COLUMN `short_id` TO `shortId`;
ALTER TABLE `ScreenShortId` RENAME COLUMN `updated_at` TO `updatedAt`;

-- AlterTable
ALTER TABLE `User` RENAME COLUMN `created_at` TO `createdAt`;
ALTER TABLE `User` RENAME COLUMN `is_admin` TO `isAdmin`;
ALTER TABLE `User` RENAME COLUMN `updated_at` TO `updatedAt`;

-- CreateIndex
CREATE INDEX `CompetitionUser_competitionUuid_idx` ON `CompetitionUser`(`competitionUuid`);

-- CreateIndex
CREATE INDEX `CompetitionUser_userId_idx` ON `CompetitionUser`(`userId`);

-- CreateIndex
CREATE INDEX `ScreenShortId_competitionUuid_idx` ON `ScreenShortId`(`competitionUuid`);
