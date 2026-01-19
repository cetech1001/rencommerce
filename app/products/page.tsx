 "use client";

import { useState, useEffect } from "react";
import { ChevronDown, Grid3x3, List, X } from "lucide-react";
import { ProductCard } from "@/lib/components/client";
import { ProductFilters } from "./ProductFilters";
import { getMode, PRODUCT_CARD_MODE } from "@/lib/utils";
import { PRODUCT_ORDER_BY, type ProductCategory, IProduct, PaginationMeta, ProductSortOptions } from "@/lib/types";
import { getCategories, getPriceRange, getProducts } from "@/lib/queries/products";

const sortOptions: ProductSortOptions[] = [
  { label: "Newest", value: PRODUCT_ORDER_BY.CREATED_AT, order: 'desc' },
  { label: "Name: A to Z", value: PRODUCT_ORDER_BY.NAME, order: "asc" },
  { label: "Name: Z to A", value: PRODUCT_ORDER_BY.NAME, order: "desc" },
  { label: "Rental: Low to High", value: PRODUCT_ORDER_BY.RENTAL_PRICE, order: "asc" },
  { label: "Rental: High to Low", value: PRODUCT_ORDER_BY.RENTAL_PRICE, order: "desc" },
  { label: "Purchase: Low to High", value: PRODUCT_ORDER_BY.PURCHASE_PRICE, order: "asc" },
  { label: "Purchase: High to Low", value: PRODUCT_ORDER_BY.PURCHASE_PRICE, order: "desc" },
];

export default function Products() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [productType, setProductType] = useState<PRODUCT_CARD_MODE | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<PRODUCT_ORDER_BY>(PRODUCT_ORDER_BY.CREATED_AT);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    totalCount: 0,
    totalPages: 0,
    itemsCount: 0,
  });

  const itemsPerPage = 12;

  const fetchCategories = async () => {
    try {
      const categories = await getCategories(productType);
      setCategories(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchPriceRange = async () => {
    try {
      const priceRange = await getPriceRange(productType, selectedCategories);
      setPriceRange([priceRange.min, priceRange.max]);
    } catch (error) {
      console.error("Failed to fetch price range:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, meta } = await getProducts({
        limit: itemsPerPage,
        page: currentPage,
        categories: selectedCategories,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        hasRentalPrice: productType
          ? productType === PRODUCT_CARD_MODE.RENTAL
          : undefined,
        hasPurchasePrice: productType
          ? productType === PRODUCT_CARD_MODE.PURCHASE
          : undefined,
        orderBy: sortBy,
        sortOrder,
      });
      setProducts(data);
      setPagination(meta);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchPriceRange(),
    ]);
  }, []);

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchPriceRange(),
    ]);
  }, [productType]);

  useEffect(() => {
    Promise.all([
      fetchPriceRange(),
    ]);
  }, [selectedCategories]);

  useEffect(() => {
    fetchProducts();
  }, priceRange);

  useEffect(() => {
    setCurrentPage(1);
  }, [productType, selectedCategories, priceRange, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleClearFilters = () => {
    setProductType(undefined);
    setSelectedCategories([]);
  };

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
                  {pagination.totalCount} product{pagination.totalCount !== 1 ? 's' : ''}
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
                    onChange={(e) => {
                      const option = sortOptions.find(s => s.label === e.target.value)!;
                      console.log("Option: ", option);
                      setSortBy(option.value);
                      setSortOrder(option.order);
                    }}
                    className="appearance-none w-full sm:w-auto px-4 py-2 pr-10 bg-white border border-border rounded-lg text-sm font-medium text-foreground cursor-pointer hover:border-primary transition-colors"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.label} value={option.label}>
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
            {products.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      viewMode={viewMode}
                      mode={getMode(product)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary"
                    >
                      ← Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
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
                      onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                      disabled={currentPage === pagination.totalPages}
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
