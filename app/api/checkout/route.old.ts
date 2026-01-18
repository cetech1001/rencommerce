import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CheckoutItem {
  productID: string;
  quantity: number;
  type: "rent" | "purchase";
}

interface CustomerInfo {
  email: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface RentalDetails {
  startDate: string;
  endDate: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      customerInfo,
      rentalDetails,
    }: {
      items: CheckoutItem[];
      customerInfo: CustomerInfo;
      rentalDetails?: RentalDetails;
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    // Validate customer info
    if (!customerInfo.email || !customerInfo.name || !customerInfo.address) {
      return NextResponse.json(
        { error: "Missing required customer information" },
        { status: 400 }
      );
    }

    // Check if there are rental items and validate rental details
    const hasRentalItems = items.some((item) => item.type === "rent");
    if (hasRentalItems) {
      if (!rentalDetails?.startDate || !rentalDetails?.endDate) {
        return NextResponse.json(
          { error: "Rental dates are required for rental items" },
          { status: 400 }
        );
      }

      const startDate = new Date(rentalDetails.startDate);
      const endDate = new Date(rentalDetails.endDate);

      if (startDate >= endDate) {
        return NextResponse.json(
          { error: "Rental end date must be after start date" },
          { status: 400 }
        );
      }
    }

    // Verify stock availability for all items
    const stockVerificationErrors: string[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productID },
        select: {
          id: true,
          name: true,
          quantity: true,
          rentalPrice: true,
          purchasePrice: true,
          isActive: true,
        },
      });

      if (!product) {
        stockVerificationErrors.push(`Product not found: ${item.productID}`);
        continue;
      }

      if (!product.isActive) {
        stockVerificationErrors.push(`${product.name} is no longer available`);
        continue;
      }

      // Check if product can be rented/purchased
      if (item.type === "rent" && product.rentalPrice <= 0) {
        stockVerificationErrors.push(`${product.name} is not available for rent`);
        continue;
      }

      if (item.type === "purchase" && product.purchasePrice <= 0) {
        stockVerificationErrors.push(`${product.name} is not available for purchase`);
        continue;
      }

      // Verify quantity
      if (product.quantity < item.quantity) {
        stockVerificationErrors.push(
          `${product.name}: Only ${product.quantity} available (requested ${item.quantity})`
        );
      }
    }

    if (stockVerificationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Stock verification failed",
          details: stockVerificationErrors,
        },
        { status: 400 }
      );
    }

    // Create order (simplified - you would integrate with payment gateway here)
    // For now, we'll just create a placeholder order
    const orderID = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // In a real application, you would:
    // 1. Create payment intent with payment provider
    // 2. Create order record in database
    // 3. Reduce product quantities
    // 4. Send confirmation email
    // 5. etc.

    return NextResponse.json({
      success: true,
      orderId: orderID,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "An error occurred during checkout" },
      { status: 500 }
    );
  }
}
