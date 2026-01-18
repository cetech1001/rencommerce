-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NOT NULL,
    `longDescription` TEXT NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `rentalPrice` DOUBLE NOT NULL,
    `purchasePrice` DOUBLE NOT NULL,
    `rentalSalePrice` DOUBLE NULL,
    `purchaseSalePrice` DOUBLE NULL,
    `image` VARCHAR(191) NOT NULL,
    `additionalImages` JSON NOT NULL,
    `features` JSON NOT NULL,
    `specifications` JSON NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `remarks` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reviews_userID_idx`(`userID`),
    INDEX `reviews_productID_idx`(`productID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `userID` VARCHAR(191) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `type` ENUM('RENT', 'PURCHASE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `orders_userID_idx`(`userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `orderID` VARCHAR(191) NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `type` ENUM('RENT', 'PURCHASE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `order_items_orderID_idx`(`orderID`),
    INDEX `order_items_productID_idx`(`productID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `orderID` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `paymentMethod` ENUM('BANK_TRANSFER', 'CRYPTO', 'CARD') NOT NULL,
    `paymentInfo` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `transactions_orderID_idx`(`orderID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderID_fkey` FOREIGN KEY (`orderID`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_orderID_fkey` FOREIGN KEY (`orderID`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
