/*
  Warnings:

  - You are about to drop the column `therapistName` on the `TherapistSession` table. All the data in the column will be lost.
  - Made the column `therapistId` on table `TherapistSession` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `TherapistSession` DROP FOREIGN KEY `TherapistSession_therapistId_fkey`;

-- AlterTable
ALTER TABLE `TherapistSession` DROP COLUMN `therapistName`,
    MODIFY `therapistId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `TherapistSession` ADD CONSTRAINT `TherapistSession_therapistId_fkey` FOREIGN KEY (`therapistId`) REFERENCES `Therapist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `TherapistSession` RENAME INDEX `TherapistSession_studentId_fkey` TO `TherapistSession_studentId_idx`;

-- RenameIndex
ALTER TABLE `TherapistSession` RENAME INDEX `TherapistSession_therapistId_fkey` TO `TherapistSession_therapistId_idx`;
