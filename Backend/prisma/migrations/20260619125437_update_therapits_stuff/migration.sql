/*
  Warnings:

  - You are about to alter the column `status` on the `TherapistSession` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `TherapistSession` ADD COLUMN `therapistId` INTEGER NULL,
    MODIFY `status` ENUM('PENDING', 'SCHEDULED', 'DECLINED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('ADMIN', 'PROFESSOR', 'STUDENT', 'THERAPIST') NOT NULL DEFAULT 'PROFESSOR';

-- CreateTable
CREATE TABLE `Therapist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Therapist_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Therapist` ADD CONSTRAINT `Therapist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TherapistSession` ADD CONSTRAINT `TherapistSession_therapistId_fkey` FOREIGN KEY (`therapistId`) REFERENCES `Therapist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
