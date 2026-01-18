/*
  Warnings:

  - Added the required column `billingAddressID` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAddressID` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `rentalEndDate` DATETIME(3) NULL,
    ADD COLUMN `rentalStartDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `billingAddressID` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingAddressID` VARCHAR(191) NOT NULL,
    ADD COLUMN `shippingFee` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `phone` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `addressLine1` VARCHAR(191) NOT NULL,
    `addressLine2` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `isDefaultBilling` BOOLEAN NOT NULL DEFAULT false,
    `isDefaultShipping` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `addresses_userID_idx`(`userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupons` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `discountType` ENUM('PERCENTAGE', 'FIXED') NOT NULL,
    `discountValue` DOUBLE NOT NULL,
    `minPrice` DOUBLE NULL,
    `maxPrice` DOUBLE NULL,
    `scope` ENUM('ITEM', 'CART') NOT NULL,
    `expiry` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `coupons_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `orders_billingAddressID_idx` ON `orders`(`billingAddressID`);

-- CreateIndex
CREATE INDEX `orders_shippingAddressID_idx` ON `orders`(`shippingAddressID`);

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_billingAddressID_fkey` FOREIGN KEY (`billingAddressID`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_shippingAddressID_fkey` FOREIGN KEY (`shippingAddressID`) REFERENCES `addresses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
