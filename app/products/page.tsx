"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Grid3x3, List } from "lucide-react";
import { ProductCard } from "@/lib/components/client";
import Image from "next/image";
import { allProducts } from "@/lib/data";

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
    const filtered = allProducts.filter((product) => {
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
