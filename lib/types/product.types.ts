export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  isActive: boolean;
  quantity: number;
  rentalPrice: number;
  purchasePrice: number;
  rentalSalePrice?: number | null;
  purchaseSalePrice?: number | null;
  image: string;
  additionalImages: string[];
  features: string[];
  specifications: Record<string, string>;
  averageRating?: number;
  reviewCount?: number;
  reviews?: ProductReview[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
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
  category?: string;
  isActive?: boolean;
  hasRentalPrice?: boolean;
  hasPurchasePrice?: boolean;
  limit?: number;
  orderBy?: "price" | "name" | "createdAt";
};
