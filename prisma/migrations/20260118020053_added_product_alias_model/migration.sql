-- CreateTable
CREATE TABLE `product_aliases` (
    `id` VARCHAR(191) NOT NULL,
    `productID` VARCHAR(191) NOT NULL,
    `relatedProductID` VARCHAR(191) NOT NULL,

    INDEX `product_aliases_relatedProductID_idx`(`relatedProductID`),
    UNIQUE INDEX `product_aliases_productID_relatedProductID_key`(`productID`, `relatedProductID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_aliases` ADD CONSTRAINT `product_aliases_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_aliases` ADD CONSTRAINT `product_aliases_relatedProductID_fkey` FOREIGN KEY (`relatedProductID`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
