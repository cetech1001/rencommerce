"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  Check,
  Truck,
  Shield,
  Heart,
  Share2,
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Calendar,
  X,
} from "lucide-react";
import { useCart } from "@/lib/contexts";

interface Product {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  rentalPrice: number;
  purchasePrice: number;
  rentalSalePrice: number | null;
  purchaseSalePrice: number | null;
  image: string;
  additionalImages: string[];
  features: string[];
  specifications: Record<string, string>;
  quantity: number;
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
}

interface Review {
  id: string;
  rating: number;
  title: string;
  remarks: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mode, setMode] = useState<"rent" | "purchase">("rent");

  const id = params.id as string;

  useEffect(() => {
    // Get mode from query params
    const queryMode = searchParams.get("mode") as "rent" | "purchase" | null;
    if (queryMode === "rent" || queryMode === "purchase") {
      setMode(queryMode);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (data.error) {
        console.error("Product not found");
        return;
      }

      setProduct(data.product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isRental = mode === "rent";
  const basePrice = isRental ? product.rentalPrice : product.purchasePrice;
  const salePrice = isRental ? product.rentalSalePrice : product.purchaseSalePrice;
  const hasDiscount = !!(salePrice && salePrice < basePrice);
  const displayPrice = hasDiscount ? salePrice : basePrice;
  const discount = hasDiscount
    ? Math.round(((basePrice - displayPrice) / basePrice) * 100)
    : 0;

  const allImages = [product.image, ...product.additionalImages];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: displayPrice,
      type: mode,
      image: product.image,
      quantity,
    });

    alert(`${quantity}x ${product.name} added to your cart.`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: url,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-xl border border-border overflow-hidden sticky top-6">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={allImages[selectedImage]}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 p-4 border-t border-border overflow-x-auto">
                  {allImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`View ${idx + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Share & Favorite Buttons */}
              <div className="p-4 border-t border-border flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 rounded-lg transition-all text-sm font-medium ${
                    isFavorited
                      ? "bg-red-50 border-red-300 text-red-600"
                      : "border-border hover:border-red-300 text-muted-foreground"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div>
            {/* Category & Rating */}
            <div className="mb-4">
              <Link
                href={`/products?categories=${product.category}`}
                className="text-sm text-primary hover:underline font-medium"
              >
                {product.category}
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.averageRating > 0 ? product.averageRating : "No ratings"} (
                  {product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">{product.shortDescription}</p>

            {/* Stock Status */}
            <div
              className={`mb-6 p-4 rounded-lg ${
                product.quantity > 0
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div
                className={`flex items-center gap-2 font-medium ${
                  product.quantity > 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                {product.quantity > 0 ? (
                  <>
                    <Check className="w-5 h-5" />
                    {product.quantity} in stock
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    Out of stock
                  </>
                )}
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground mb-3 block">
                Choose Option:
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setMode("rent")}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    mode === "rent"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Rent
                </button>
                <button
                  onClick={() => setMode("purchase")}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    mode === "purchase"
                      ? "bg-secondary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Purchase
                </button>
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-8 p-6 bg-white rounded-xl border border-border">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-primary">${displayPrice.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${basePrice.toFixed(2)}
                  </span>
                )}
              </div>
              {isRental && <span className="text-sm text-muted-foreground">/day</span>}
              <p className="text-sm text-muted-foreground mt-2">
                Tax included · Free shipping on orders over $100
              </p>
            </div>

            {/* Quantity & CTA */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">Quantity:</span>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-white rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="p-2 hover:bg-white rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.quantity <= 0}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isRental
                    ? "bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {isRental ? (
                  <>
                    <Calendar className="w-5 h-5" />
                    Rent Now
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </>
                )}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={product.quantity <= 0}
                className="w-full py-3 px-6 rounded-lg font-medium border-2 border-muted text-foreground hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Free shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Features */}
        {product.features.length > 0 && (
          <div className="bg-white rounded-xl border border-border p-8 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specifications */}
        {Object.keys(product.specifications).length > 0 && (
          <div className="bg-white rounded-xl border border-border p-8 mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Technical Specifications</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground font-medium">{key}</dt>
                  <dd className="font-semibold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Long Description */}
        <div className="bg-white rounded-xl border border-border p-8 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">About This Product</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.longDescription}
          </p>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white rounded-xl border border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Customer Reviews</h2>

          {product.reviewCount > 0 ? (
            <>
              <div className="mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold text-foreground">
                    {product.averageRating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {product.reviewCount}{" "}
                      {product.reviewCount === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {product.reviews.slice(0, 5).map((review: Review) => (
                  <div
                    key={review.id}
                    className="pb-6 border-b border-border last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{review.user.name}</h3>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(review.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium text-foreground mb-2">{review.title}</p>
                    <p className="text-muted-foreground text-sm">{review.remarks}</p>
                  </div>
                ))}
              </div>

              {product.reviewCount > 5 && (
                <button className="w-full mt-8 py-3 px-6 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium">
                  View All {product.reviewCount} Reviews
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
