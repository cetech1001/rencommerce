export type ProductType = "rent" | "buy";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  type: ProductType;
  price: number;
  originalPrice?: number;
  badge?: string;
  specs?: string[];
}
