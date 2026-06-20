-- AlterTable
ALTER TABLE `TherapistSession` ADD COLUMN `observations` TEXT NULL,
    ADD COLUMN `recommendations` TEXT NULL,
    ADD COLUMN `sessionSummary` TEXT NULL,
    ADD COLUMN `stressAssessment` ENUM('BASELINE', 'MILD_STRESS', 'HIGH_STRESS') NULL;
