-- CreateTable
CREATE TABLE `Anime` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `imageUrl` VARCHAR(2048) NULL,
    `status` ENUM('WATCHING', 'COMPLETED', 'ON_HOLD', 'DROPPED') NOT NULL,
    `rating` INTEGER NULL,
    `startedAt` DATETIME(3) NULL,
    `finishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
