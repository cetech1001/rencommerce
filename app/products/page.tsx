"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Grid3x3, List } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";

// Sample product data with categories
const allProducts = [
  {
    id: "1",
    name: "Solar Panel Kit Pro",
    description: "High-efficiency monocrystalline solar panels",
    image: "https://images.unsplash.com/photo-1509391366360-2e938e9dfc72?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 128,
    type: "rent" as const,
    price: 299,
    category: "Solar",
    badge: "Popular",
    specs: ["500W output", "20 year warranty"],
  },
  {
    id: "2",
    name: "Wind Turbine Mini",
    description: "Compact vertical axis wind turbine",
    image: "https://images.unsplash.com/photo-1512453575296-8cb90ca7f1b2?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 94,
    type: "buy" as const,
    price: 1899,
    originalPrice: 2199,
    category: "Wind",
    badge: "Sale",
    specs: ["3kW capacity", "Easy installation"],
  },
  {
    id: "3",
    name: "Battery Storage System",
    description: "LiFePO4 battery backup storage",
    image: "https://images.unsplash.com/photo-1518779578514-8acda299d911?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 156,
    type: "rent" as const,
    price: 199,
    category: "Storage",
    specs: ["10kWh capacity", "Smart monitoring"],
  },
  {
    id: "4",
    name: "Hybrid Inverter System",
    description: "Grid-tie inverter with battery support",
    image: "https://images.unsplash.com/photo-1581092334000-4130873c25bb?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 112,
    type: "buy" as const,
    price: 2499,
    originalPrice: 2999,
    category: "Inverters",
    badge: "Best Value",
    specs: ["8kW continuous", "WiFi monitoring"],
  },
  {
    id: "5",
    name: "Solar Thermal Collector",
    description: "Evacuated tube thermal collector for heating",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop",
    rating: 4.5,
    reviews: 78,
    type: "rent" as const,
    price: 149,
    category: "Solar",
    specs: ["4m² collector area", "High absorption"],
  },
  {
    id: "6",
    name: "Portable Power Station",
    description: "1000W portable solar power station",
    image: "https://images.unsplash.com/photo-1593462335572-01b4a9c0a8dc?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 234,
    type: "buy" as const,
    price: 699,
    category: "Storage",
    specs: ["1000W capacity", "Fast charging"],
  },
  {
    id: "7",
    name: "Microinverter Bundle",
    description: "Advanced microinverter with monitoring",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 145,
    type: "rent" as const,
    price: 249,
    category: "Inverters",
    badge: "New",
    specs: ["600W per unit", "Smart grid ready"],
  },
  {
    id: "8",
    name: "Wind Turbine Vertical Axis",
    description: "Whisper-quiet vertical axis wind turbine",
    image: "https://images.unsplash.com/photo-1518600506016-c5f5c70c63e9?w=500&h=500&fit=crop",
    rating: 4.4,
    reviews: 89,
    type: "buy" as const,
    price: 3499,
    originalPrice: 3999,
    category: "Wind",
    specs: ["5kW capacity", "Urban friendly"],
  },
  {
    id: "9",
    name: "Solar Charge Controller",
    description: "MPPT solar charge controller",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 156,
    type: "rent" as const,
    price: 179,
    category: "Controllers",
    specs: ["60A capacity", "WiFi enabled"],
  },
  {
    id: "10",
    name: "Geothermal Heat Pump",
    description: "Energy-efficient geothermal heating system",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 98,
    type: "buy" as const,
    price: 4999,
    originalPrice: 5999,
    category: "Heating",
    badge: "Premium",
    specs: ["5-ton capacity", "High efficiency"],
  },
  {
    id: "11",
    name: "Solar Monitoring System",
    description: "Real-time energy monitoring dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 167,
    type: "rent" as const,
    price: 89,
    category: "Monitoring",
    specs: ["WiFi connected", "Mobile app"],
  },
  {
    id: "12",
    name: "Complete Solar Kit",
    description: "All-in-one solar installation package",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 201,
    type: "buy" as const,
    price: 5999,
    originalPrice: 7499,
    category: "Solar",
    badge: "Best Seller",
    specs: ["10kW system", "Includes installation"],
  },
];

const categories = [
  "All Categories",
  "Solar",
  "Wind",
  "Storage",
  "Inverters",
  "Controllers",
  "Heating",
  "Monitoring",
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating" },
  { label: "Most Popular", value: "popular" },
];

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState<"all" | "rent" | "buy">("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const itemsPerPage = 12;

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const categoryMatch =
        selectedCategory === "All Categories" || product.category === selectedCategory;
      const typeMatch = selectedType === "all" || product.type === selectedType;
      return categoryMatch && typeMatch;
    });

    // Sort products
    switch (sortBy) {
      case "price-asc":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-desc":
        return filtered.sort((a, b) => b.price - a.price);
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "popular":
        return filtered.sort((a, b) => b.reviews - a.reviews);
      case "newest":
      default:
        return filtered;
    }
  }, [selectedCategory, selectedType, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: "all" | "rent" | "buy") => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Our Products
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover renewable energy solutions tailored to your needs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Filters</h2>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-primary text-white font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground mb-4">Type</h3>
                <div className="space-y-2">
                  {[
                    { label: "All Types", value: "all" },
                    { label: "Rent", value: "rent" },
                    { label: "Buy", value: "buy" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleTypeChange(type.value as "all" | "rent" | "buy")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                        selectedType === type.value
                          ? "bg-secondary text-white font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Info */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Price Range</h3>
                <p className="text-sm text-muted-foreground">
                  ${Math.min(...allProducts.map((p) => p.price)).toFixed(0)} - $
                  {Math.max(...allProducts.map((p) => p.price)).toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="text-sm text-muted-foreground">
                Showing {filteredAndSortedProducts.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredAndSortedProducts.length)} of{" "}
                {filteredAndSortedProducts.length} products
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="appearance-none w-full sm:w-auto px-4 py-2 pr-10 bg-white border border-border rounded-lg text-sm font-medium text-foreground cursor-pointer hover:border-primary transition-colors"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex gap-2 bg-white border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Grid view"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Display */}
            {paginatedProducts.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={viewMode === "list" ? "flex gap-4 bg-white rounded-xl border border-border p-4" : ""}
                    >
                      {viewMode === "list" && (
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""}>
                        <ProductCard {...product} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary"
                  >
                    ← Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                            currentPage === pageNum
                              ? "bg-primary text-white"
                              : "border border-border hover:border-primary hover:text-primary"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary"
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
