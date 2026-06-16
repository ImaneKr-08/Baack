-- DropIndex
DROP INDEX `Professor_email_key` ON `Professor`;

-- DropIndex
DROP INDEX `Student_email_key` ON `Student`;

-- AlterTable
ALTER TABLE `Professor` DROP COLUMN `department`,
    DROP COLUMN `email`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`;

-- AlterTable
ALTER TABLE `Student` DROP COLUMN `department`,
    DROP COLUMN `email`,
    DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    DROP COLUMN `password`,
    ADD COLUMN `group` VARCHAR(191) NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `name`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `role` ENUM('ADMIN', 'PROFESSOR', 'STUDENT') NOT NULL DEFAULT 'PROFESSOR';

-- CreateIndex
CREATE UNIQUE INDEX `Student_userId_key` ON `Student`(`userId`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

