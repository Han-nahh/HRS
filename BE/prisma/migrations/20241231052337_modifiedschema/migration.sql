/*
  Warnings:

  - You are about to drop the column `reportMeasurement` on the `dailyreport` table. All the data in the column will be lost.
  - You are about to alter the column `userId` on the `dailyreport` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `status` on the `dailyreport` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(33))`.
  - Added the required column `reportMagnitude` to the `DailyReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailyreport` DROP COLUMN `reportMeasurement`,
    ADD COLUMN `reportMagnitude` VARCHAR(191) NOT NULL,
    MODIFY `userId` INTEGER NOT NULL,
    MODIFY `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyReport` ADD CONSTRAINT `DailyReport_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
