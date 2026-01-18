export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  badge?: string;
  specs?: string[];
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
