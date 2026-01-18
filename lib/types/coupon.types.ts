export interface ValidateCouponData {
  code: string;
  cartTotal: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  scope: "ITEM" | "CART";
}
