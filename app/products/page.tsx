"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Grid3x3, List, X } from "lucide-react";
import { ProductCard } from "@/lib/components/client";
import { ProductFilters } from "./ProductFilters";

interface Product {
  id: string;
  name: string;
  shortDescription: string;
  category: string;
  rentalPrice: number;
  purchasePrice: number;
  rentalSalePrice: number | null;
  purchaseSalePrice: number | null;
  image: string;
  quantity: number;
}

interface Category {
  name: string;
  count: number;
}

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
  { label: "Rental: Low to High", value: "rental-asc" },
  { label: "Rental: High to Low", value: "rental-desc" },
  { label: "Purchase: Low to High", value: "purchase-asc" },
  { label: "Purchase: High to Low", value: "purchase-desc" },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productType, setProductType] = useState<"rental" | "purchase" | "all">("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const itemsPerPage = 12;

  // Fetch products and filters on mount
  useEffect(() => {
    Promise.all([fetchProducts(), fetchFilters()]);
  }, []);

  // Fetch filters when type changes (affects categories and price range)
  useEffect(() => {
    if (products.length > 0) {
      fetchFilters();
      setSelectedCategories([]); // Clear categories when type changes
    }
  }, [productType]);

  // Fetch filters when categories change (affects price range only)
  useEffect(() => {
    if (products.length > 0 && selectedCategories.length > 0) {
      fetchFilters();
    }
  }, [selectedCategories]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (productType !== "all") {
        params.set("type", productType);
      }
      if (selectedCategories.length > 0) {
        params.set("categories", selectedCategories.join(","));
      }
      if (priceRange[0] > 0 || priceRange[1] < 10000) {
        params.set("minPrice", priceRange[0].toString());
        params.set("maxPrice", priceRange[1].toString());
      }

      const queryString = params.toString();
      const url = queryString ? `/api/products?${queryString}` : "/api/products";

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const params = new URLSearchParams();
      if (productType !== "all") {
        params.set("type", productType);
      }
      if (selectedCategories.length > 0) {
        params.set("categories", selectedCategories.join(","));
      }

      const response = await fetch(`/api/products/filters?${params.toString()}`);
      const data = await response.json();

      setCategories(data.categories || []);

      // Update price range based on filtered results
      if (data.priceRange) {
        setPriceRange([data.priceRange.min, data.priceRange.max]);
      }
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  };

  // Sort products (filtering happens server-side)
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "rental-asc":
        return sorted.sort((a, b) => a.rentalPrice - b.rentalPrice);
      case "rental-desc":
        return sorted.sort((a, b) => b.rentalPrice - a.rentalPrice);
      case "purchase-asc":
        return sorted.sort((a, b) => a.purchasePrice - b.purchasePrice);
      case "purchase-desc":
        return sorted.sort((a, b) => b.purchasePrice - a.purchasePrice);
      case "newest":
      default:
        return sorted;
    }
  }, [products, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Refetch products when filters change
  useEffect(() => {
    if (products.length > 0) {
      setCurrentPage(1);
      fetchProducts();
    }
  }, [productType, selectedCategories, priceRange]);

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const handleClearFilters = () => {
    setProductType("all");
    setSelectedCategories([]);
    setPriceRange([0, 10000]);
  };

  const getMode = ({ rentalPrice, purchasePrice }: Product) => {
    if (rentalPrice > 0 && purchasePrice === 0) {
      return "rental";
    } else if (purchasePrice > 0 && rentalPrice === 0) {
      return "purchase";
    }
    return undefined;
  }

  const activeFiltersCount = selectedCategories.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading products...</div>
        </div>
      </div>
    );
  }

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
          <div className="lg:col-span-1 order-1 lg:order-1">
            <ProductFilters
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              productType={productType}
              onProductTypeChange={setProductType}
              onClearAll={handleClearFilters}
              maxPrice={priceRange[1]}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-sm text-muted-foreground">
                  {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
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
                <div className="hidden sm:flex gap-2 bg-white border border-border rounded-lg p-1">
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
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      quantity={product.quantity}
                      name={product.name}
                      description={product.shortDescription}
                      category={product.category}
                      rentalPrice={product.rentalPrice}
                      purchasePrice={product.purchasePrice}
                      rentalSalePrice={product.rentalSalePrice}
                      purchaseSalePrice={product.purchaseSalePrice}
                      image={product.image}
                      viewMode={viewMode}
                      mode={getMode(product)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
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
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-border">
                <p className="text-muted-foreground text-lg font-medium">No products found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
