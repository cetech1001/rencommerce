import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body;

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase(),
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    // Check expiry
    if (coupon.expiry && new Date() > new Date(coupon.expiry)) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    // Check min/max price
    if (coupon.minPrice && cartTotal < coupon.minPrice) {
      return NextResponse.json(
        {
          error: `Minimum cart value of $${coupon.minPrice.toFixed(2)} required for this coupon`,
        },
        { status: 400 }
      );
    }

    if (coupon.maxPrice && cartTotal > coupon.maxPrice) {
      return NextResponse.json(
        {
          error: `Maximum cart value of $${coupon.maxPrice.toFixed(2)} exceeded for this coupon`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        scope: coupon.scope,
      },
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
