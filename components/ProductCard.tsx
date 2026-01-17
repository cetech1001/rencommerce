import { Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  type: "rent" | "buy";
  price: number;
  originalPrice?: number;
  badge?: string;
  specs?: string[];
}

export default function ProductCard({
  id,
  name,
  description,
  image,
  rating,
  reviews,
  type,
  price,
  originalPrice,
  badge,
  specs = [],
}: ProductCardProps) {
  const isOnSale = originalPrice && originalPrice > price;

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl border border-border hover:border-primary transition-all duration-300 overflow-hidden hover:shadow-lg">
      {/* Image Container - Clickable Link to Detail */}
      <Link href={`/product/${id}`} className="relative overflow-hidden bg-gradient-to-br from-muted to-muted/50 h-48 sm:h-56 block">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
            {badge}
          </div>
        )}
        {type === "rent" && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Rental
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-grow p-4 sm:p-5 flex flex-col">
        {/* Title and Description */}
        <Link href={`/product/${id}`} className="hover:text-primary transition-colors">
          <h3 className="font-semibold text-foreground text-base sm:text-lg mb-1 line-clamp-2">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Specs */}
        {specs.length > 0 && (
          <div className="mb-4 space-y-1">
            {specs.slice(0, 2).map((spec, idx) => (
              <p key={idx} className="text-xs text-muted-foreground">
                ✓ {spec}
              </p>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-4 border-t border-border mb-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-primary">${price}</span>
            {isOnSale && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice}
              </span>
            )}
            {type === "rent" && <span className="text-xs text-muted-foreground">/month</span>}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/${type === "rent" ? "rent" : "purchase"}/${id}`}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-center text-sm ${
            type === "rent"
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-secondary text-white hover:bg-secondary/90"
          }`}
        >
          {type === "rent" ? "Rent Now" : "Buy Now"}
        </Link>
      </div>
    </div>
  );
}
