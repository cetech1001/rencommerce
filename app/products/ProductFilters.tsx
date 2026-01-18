"use client";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Category {
  name: string;
  count: number;
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  productType: "rental" | "purchase" | "all";
  onProductTypeChange: (type: "rental" | "purchase" | "all") => void;
  onClearAll: () => void;
  maxPrice: number;
}

export function ProductFilters({
  categories,
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  productType,
  onProductTypeChange,
  onClearAll,
  maxPrice,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleMinPriceChange = (value: number) => {
    onPriceRangeChange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (value: number) => {
    onPriceRangeChange([priceRange[0], value]);
  };

  const hasActiveFilters = selectedCategories.length > 0;

  const filtersContent = (
    <>
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Type Filter */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Type
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => onProductTypeChange("rental")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                productType === "rental"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Rental
            </button>
            <button
              onClick={() => onProductTypeChange("purchase")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                productType === "purchase"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Purchase
            </button>
            <button
              onClick={() => onProductTypeChange("all")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                productType === "all"
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Category
            {selectedCategories.length > 0 && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                ({selectedCategories.length} selected)
              </span>
            )}
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.length > 0 ? (
              categories.map((category) => {
                const isSelected = selectedCategories.includes(category.name);
                return (
                  <label
                    key={category.name}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryToggle(category.name)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-border group-hover:border-primary"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                    <span
                      className={`text-sm flex-1 ${
                        isSelected
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({category.count})
                    </span>
                  </label>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No categories available</p>
            )}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Price Range
          </h3>

          {/* Range Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Min: ${priceRange[0].toFixed(0)}
              </label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                step="10"
                value={priceRange[0]}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Max: ${priceRange[1].toFixed(0)}
              </label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                step="10"
                value={priceRange[1]}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Price Range Inputs */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                min="0"
                max={priceRange[1]}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Min"
              />
            </div>
            <span className="text-muted-foreground self-center">-</span>
            <div className="flex-1">
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                min={priceRange[0]}
                max={maxPrice}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-border mb-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
              {selectedCategories.length}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Mobile Collapsible Content */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[1000px] opacity-100 mb-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white rounded-xl border border-border">
          {filtersContent}
        </div>
      </div>

      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block bg-white rounded-xl border border-border sticky top-6">
        {filtersContent}
      </div>
    </>
  );
}
