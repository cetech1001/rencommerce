export interface IProduct {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  category: string;
  rentalPrice: number;
  purchasePrice: number;
  quantity: number;
  rentalSalePrice?: number | null;
  purchaseSalePrice?: number | null;
}

export interface Product extends IProduct {
  longDescription: string;
  isActive: boolean;
  additionalImages: string[];
  features: string[];
  specifications: Record<string, string>;
  reviews?: IProductReview[];
  createdAt: string;
  updatedAt: string;
}

export interface IProductReview {
  id: string;
  rating: number;
  title: string;
  remarks: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export interface ProductCategory {
  name: string;
  count: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface CreateProductData {
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  rentalPrice: number;
  purchasePrice: number;
  rentalSalePrice?: number | null;
  purchaseSalePrice?: number | null;
  quantity: number;
  image: string;
  additionalImages?: string[];
  features?: string[];
  specifications?: Record<string, string>;
}

export interface UpdateProductData {
  id: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  category?: string;
  rentalPrice?: number;
  purchasePrice?: number;
  rentalSalePrice?: number | null;
  purchaseSalePrice?: number | null;
  quantity?: number;
  image?: string;
  additionalImages?: string[];
  features?: string[];
  specifications?: Record<string, string>;
}

export type ProductQueryOptions = {
  page?: number;
  limit: number;
  search?: string;
  categories?: string[];
  isActive?: boolean;
  hasRentalPrice?: boolean;
  hasPurchasePrice?: boolean;
  isInStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  orderBy?: PRODUCT_ORDER_BY;
  sortOrder?: 'asc' | 'desc';
};

export const PRODUCT_ORDER_BY = {
  RENTAL_PRICE: 'rentalPrice',
  PURCHASE_PRICE: 'purchasePrice',
  NAME: 'name',
  CREATED_AT: 'createdAt',
} as const;
export type PRODUCT_ORDER_BY = typeof PRODUCT_ORDER_BY[keyof typeof PRODUCT_ORDER_BY];

export interface ProductSearchFilters {
  categories?: string[];
  type?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface ProductSortOptions {
  label: string;
  value: PRODUCT_ORDER_BY;
  order: 'asc' | 'desc';
}
