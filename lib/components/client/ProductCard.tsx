'use client';

import { ShoppingCart, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCT_CARD_MODE } from "@/lib/utils";
import { IProduct } from "@/lib/types";

interface ProductCardProps extends IProduct {
  viewMode?: "grid" | "list";
  mode?: PRODUCT_CARD_MODE;
}

export const ProductCard = ({
  id,
  name,
  shortDescription,
  image,
  category,
  quantity,
  rentalPrice,
  purchasePrice,
  rentalSalePrice,
  purchaseSalePrice,
  viewMode = "grid",
  mode,
}: ProductCardProps) => {
  const hasRentalDiscount = !!(rentalSalePrice && rentalSalePrice < rentalPrice);
  const hasPurchaseDiscount = !!(purchaseSalePrice && purchaseSalePrice < purchasePrice);
  const displayRentalPrice = hasRentalDiscount ? rentalSalePrice : rentalPrice;
  const displayPurchasePrice = hasPurchaseDiscount ? purchaseSalePrice : purchasePrice;

  const inStock = quantity > 0;

  if (viewMode === "list") {
    return (
      <div className="group flex gap-4 bg-white rounded-xl border border-border hover:border-primary transition-all duration-300 p-4 hover:shadow-lg">
        {/* Image */}
        <Link href={`/product/${id}`} className="relative overflow-hidden bg-gradient-to-br from-muted to-muted/50 w-32 h-32 flex-shrink-0 rounded-lg">
          <Image
            src={image}
            alt={name}
            width={128}
            height={128}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Out of Stock</span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link href={`/product/${id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-2">
                  {shortDescription}
                </p>
                <span className="inline-block px-2 py-1 bg-muted text-xs font-medium rounded">
                  {category}
                </span>
              </div>

              {/* Prices */}
              <div className="text-right">
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-1">Rental</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      ${displayRentalPrice.toFixed(2)}
                      <span className="text-xs text-muted-foreground">/day</span>
                    </span>
                    <br/>
                    {hasRentalDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${rentalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Purchase</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-secondary">
                      ${displayPurchasePrice.toFixed(2)}
                    </span>
                    {hasPurchaseDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${purchasePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Link
              href={`/product/${id}?mode=${PRODUCT_CARD_MODE.RENTAL}`}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 text-center text-sm flex items-center justify-center gap-2 ${
                inStock
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Rent
            </Link>
            <Link
              href={`/product/${id}?mode=${PRODUCT_CARD_MODE.PURCHASE}`}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 text-center text-sm flex items-center justify-center gap-2 ${
                inStock
                  ? "bg-secondary text-white hover:bg-secondary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Buy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl border border-border hover:border-primary transition-all duration-300 overflow-hidden hover:shadow-lg">
      {/* Image Container */}
      <Link href={`/product/${id}`} className="relative overflow-hidden bg-gradient-to-br from-muted to-muted/50 h-48 block">
        <Image
          src={image}
          alt={name}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Out of Stock</span>
          </div>
        )}
        {(hasRentalDiscount || hasPurchaseDiscount) && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
            Sale
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-grow p-4 flex flex-col">
        <div className="flex-1">
          <Link href={`/product/${id}`} className="hover:text-primary transition-colors">
            <h3 className="font-semibold text-foreground text-base mb-1 line-clamp-2">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {shortDescription}
          </p>
          <span className="inline-block px-2 py-1 bg-muted text-xs font-medium rounded">
            {category}
          </span>
        </div>

        {/* Prices */}
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          {(!mode || mode === PRODUCT_CARD_MODE.RENTAL) ? (
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Rental/day</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">
                  ${displayRentalPrice.toFixed(2)}
                </span>
                {hasRentalDiscount && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${rentalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}

          {(!mode || mode === PRODUCT_CARD_MODE.PURCHASE) ? (
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Purchase</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-secondary">
                  ${displayPurchasePrice.toFixed(2)}
                </span>
                {hasPurchaseDiscount && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${purchasePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-4">
          {(!mode || mode === PRODUCT_CARD_MODE.RENTAL) ? (
            <Link
              href={`/product/${id}?mode=rent`}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 text-center text-sm ${
                inStock
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Rent
            </Link>
          ) : <></>}
          {(!mode || mode === PRODUCT_CARD_MODE.PURCHASE) ? (
            <Link
              href={`/product/${id}?mode=purchase`}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 text-center text-sm ${
                inStock
                  ? "bg-secondary text-white hover:bg-secondary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Buy
            </Link>
          ) : <></>}
        </div>
      </div>
    </div>
  );
}
