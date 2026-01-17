"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Star, Check, Truck, Shield, Heart, Share2, ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/contexts";

// Sample product data - in a real app this would come from an API
const productDatabase: Record<string, any> = {
  "1": {
    id: "1",
    name: "Solar Panel Kit Pro",
    description: "High-efficiency monocrystalline solar panels with 20-year warranty",
    image: "https://images.unsplash.com/photo-1509391366360-2e938e9dfc72?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e938e9dfc72?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
    ],
    type: "rent" as const,
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 128,
    stock: 15,
    badge: "Popular",
    category: "Solar",
    specs: [
      "500W output capacity",
      "20 year warranty included",
      "Monocrystalline cells (22% efficiency)",
      "Weather-resistant aluminum frame",
      "Suitable for residential use",
      "Easy installation",
    ],
    details: {
      manufacturer: "EnergyTech Solutions",
      weight: "18 kg",
      dimensions: "2000 x 1000 x 40 mm",
      warranty: "20 years",
      certification: "IEC 61215, IEC 61730",
    },
    description_long:
      "Our Solar Panel Kit Pro is an industry-leading solution for renewable energy generation. Featuring high-efficiency monocrystalline cells, this system delivers maximum power output even in low-light conditions. Perfect for residential installations, it comes with a comprehensive 20-year warranty and professional installation support.",
    features: [
      {
        icon: "⚡",
        title: "High Efficiency",
        description: "22% cell efficiency for maximum power generation",
      },
      {
        icon: "🛡️",
        title: "Built to Last",
        description: "20-year warranty on all materials and workmanship",
      },
      {
        icon: "🌧️",
        title: "Weather Resistant",
        description: "Tested for extreme weather conditions",
      },
      {
        icon: "📦",
        title: "Easy Installation",
        description: "Complete installation guide and support included",
      },
    ],
    reviews_data: [
      {
        author: "John Smith",
        rating: 5,
        date: "2024-01-15",
        title: "Excellent product!",
        comment: "Outstanding quality and performance. Great customer service!",
      },
      {
        author: "Sarah Johnson",
        rating: 4.5,
        date: "2024-01-10",
        title: "Very good panels",
        comment: "Works great, easy to install. Would recommend to anyone.",
      },
      {
        author: "Michael Brown",
        rating: 5,
        date: "2024-01-05",
        title: "Best investment",
        comment: "Saved so much on electricity bills. Highly satisfied!",
      },
    ],
  },
};

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const id = params.id as string;
  const product = productDatabase[id] || productDatabase["1"];
  const isRental = product.type === "rent";
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      type: product.type,
      image: product.image,
      quantity,
    });

    alert(`${quantity}x ${product.name} added to your cart.`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
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
                  src={product.images[selectedImage]}
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
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-2 p-4 border-t border-border overflow-x-auto">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} width={64} height={64} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Share Button */}
              <div className="p-4 border-t border-border flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
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
              <Link href="/products" className="text-sm text-primary hover:underline font-medium">
                {product.category}
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

            {/* Stock Status */}
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <Check className="w-5 h-5" />
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-8 p-6 bg-white rounded-xl border border-border">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {isRental && <span className="text-sm text-muted-foreground">/month</span>}
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
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-white rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isRental
                    ? "bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                    : "bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isRental ? "Rent Now" : "Buy Now"}
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-6 rounded-lg font-medium border-2 border-muted text-foreground hover:border-primary hover:text-primary transition-all duration-200"
              >
                Add to Cart
              </button>
            </div>

            {/* Key Features */}
            <div className="space-y-4 mb-8">
              {product.features.map((feature: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
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

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-border p-8 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Specifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Specs List */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Features</h3>
              <ul className="space-y-3">
                {product.specs.map((spec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Details */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Technical Details</h3>
              <dl className="space-y-4">
                {Object.entries(product.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-border pb-3">
                    <dt className="text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </dt>
                    <dd className="font-medium text-foreground">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Long Description */}
        <div className="bg-white rounded-xl border border-border p-8 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">About This Product</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{product.description_long}</p>
          <p className="text-muted-foreground leading-relaxed">
            This product is backed by our commitment to quality and customer satisfaction. We offer
            professional installation support, maintenance services, and a comprehensive warranty to ensure
            your investment is protected for years to come.
          </p>
        </div>

        {/* Customer Reviews */}
        <div className="bg-white rounded-xl border border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Customer Reviews</h2>

          <div className="mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold text-foreground">{product.rating}</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Based on {product.reviews} reviews</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {product.reviews_data.map((review: any, idx: number) => (
              <div key={idx} className="pb-6 border-b border-border last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{review.author}</h3>
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
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p className="font-medium text-foreground mb-2">{review.title}</p>
                <p className="text-muted-foreground text-sm">{review.comment}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-3 px-6 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium">
            View All Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
