import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

interface CheckoutItem {
  productId: string;
  quantity: number;
  price: number;
  type: "RENT" | "PURCHASE";
  rentalStartDate?: string | null;
  rentalEndDate?: string | null;
}

interface AddressData {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await fetch(`${request.nextUrl.origin}/api/auth/session`).then(res => res.json());

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const {
      items,
      billingAddress,
      shippingAddress,
      totalAmount,
      shippingFee,
      couponCode,
    }: {
      items: CheckoutItem[];
      billingAddress: AddressData;
      shippingAddress: AddressData;
      totalAmount: number;
      shippingFee: number;
      couponCode?: string;
    } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    if (!billingAddress || !shippingAddress) {
      return NextResponse.json({ error: "Address information required" }, { status: 400 });
    }

    // Verify stock availability
    const stockErrors: string[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
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
        stockErrors.push(`Product not found: ${item.productId}`);
        continue;
      }

      if (!product.isActive) {
        stockErrors.push(`${product.name} is no longer available`);
        continue;
      }

      if (item.type === "RENT" && product.rentalPrice <= 0) {
        stockErrors.push(`${product.name} is not available for rent`);
        continue;
      }

      if (item.type === "PURCHASE" && product.purchasePrice <= 0) {
        stockErrors.push(`${product.name} is not available for purchase`);
        continue;
      }

      if (item.quantity > product.quantity) {
        stockErrors.push(
          `${product.name}: Only ${product.quantity} available (requested ${item.quantity})`
        );
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json(
        { error: "Stock verification failed", details: stockErrors },
        { status: 400 }
      );
    }

    // Validate rental dates
    for (const item of items) {
      if (item.type === "RENT") {
        if (!item.rentalStartDate || !item.rentalEndDate) {
          return NextResponse.json(
            { error: "Rental dates required for rental items" },
            { status: 400 }
          );
        }

        const startDate = new Date(item.rentalStartDate);
        const endDate = new Date(item.rentalEndDate);

        if (startDate >= endDate) {
          return NextResponse.json(
            { error: "Rental end date must be after start date" },
            { status: 400 }
          );
        }
      }
    }

    // Determine order type (RENT or PURCHASE based on items)
    const hasRentals = items.some(item => item.type === "RENT");
    const hasPurchases = items.some(item => item.type === "PURCHASE");
    const orderType = hasRentals ? "RENT" : "PURCHASE";

    // Create addresses
    const createdBillingAddress = await prisma.address.create({
      data: {
        userID: userId,
        fullName: billingAddress.fullName,
        addressLine1: billingAddress.addressLine1,
        addressLine2: billingAddress.addressLine2 || null,
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.postalCode,
        country: billingAddress.country,
        isDefaultBilling: false,
        isDefaultShipping: false,
      },
    });

    const createdShippingAddress = await prisma.address.create({
      data: {
        userID: userId,
        fullName: shippingAddress.fullName,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        isDefaultBilling: false,
        isDefaultShipping: false,
      },
    });

    // Create order with PENDING status
    const order = await prisma.order.create({
      data: {
        userID: userId,
        billingAddressID: createdBillingAddress.id,
        shippingAddressID: createdShippingAddress.id,
        totalAmount,
        shippingFee,
        status: "PENDING",
        type: orderType,
        orderItems: {
          create: items.map((item) => ({
            productID: item.productId,
            quantity: item.quantity,
            price: item.price,
            type: item.type,
            rentalStartDate: item.rentalStartDate ? new Date(item.rentalStartDate) : null,
            rentalEndDate: item.rentalEndDate ? new Date(item.rentalEndDate) : null,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Return order ID for payment page
    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
