"use server";

import { prisma } from "@/lib/db";
import type { ValidateCouponData } from "@/lib/types";

export async function validateCoupon(data: ValidateCouponData) {
  try {
    const { code, cartTotal } = data;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { success: false, error: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { success: false, error: "This coupon is no longer active" };
    }

    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return { success: false, error: "This coupon has expired" };
    }

    if (coupon.minPrice && cartTotal < coupon.minPrice) {
      return {
        success: false,
        error: `Minimum order value of $${coupon.minPrice} required`,
      };
    }

    if (coupon.maxPrice && cartTotal > coupon.maxPrice) {
      return {
        success: false,
        error: `Maximum order value of $${coupon.maxPrice} exceeded`,
      };
    }

    return {
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        scope: coupon.scope,
      },
    };
  } catch (error) {
    console.error("Coupon validation error:", error);
    return { success: false, error: "Failed to validate coupon" };
  }
}
