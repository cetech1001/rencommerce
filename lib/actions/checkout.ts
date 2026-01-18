"use server";

import { prisma } from "@/lib/db";
import { register, getAuthSession } from "./auth";
import type { CheckoutData } from "@/lib/types";

export async function createOrder(data: CheckoutData) {
  try {
    // Check if user is authenticated
    let session = await getAuthSession();

    // If not authenticated and account data provided, create account and login
    if (!session.user && data.accountData) {
      const registerResult = await register(data.accountData);

      if (!registerResult.success) {
        return { success: false, error: registerResult.error };
      }

      // Get the new session after registration
      session = await getAuthSession();

      if (!session.user) {
        return { success: false, error: "Failed to authenticate after registration" };
      }
    }

    // Must be authenticated at this point
    if (!session.user) {
      return { success: false, error: "Authentication required" };
    }

    const userID = session.user.id;

    // Validation
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "No items in cart" };
    }

    if (!data.billingAddress) {
      return { success: false, error: "Billing address required" };
    }

    // Verify stock availability
    const stockErrors: string[] = [];

    for (const item of data.items) {
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
        stockErrors.push(`Product not found: ${item.productID}`);
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
      return {
        success: false,
        error: "Stock verification failed",
        details: stockErrors,
      };
    }

    // Validate rental dates
    for (const item of data.items) {
      if (item.type === "RENT") {
        if (!item.rentalStartDate || !item.rentalEndDate) {
          return {
            success: false,
            error: "Rental dates required for rental items",
          };
        }

        const startDate = new Date(item.rentalStartDate);
        const endDate = new Date(item.rentalEndDate);

        if (startDate >= endDate) {
          return {
            success: false,
            error: "Rental end date must be after start date",
          };
        }
      }
    }

    // Create billing address
    const createdBillingAddress = await prisma.address.create({
      data: {
        userID,
        fullName: data.billingAddress.fullName,
        addressLine1: data.billingAddress.addressLine1,
        addressLine2: data.billingAddress.addressLine2 || null,
        city: data.billingAddress.city,
        state: data.billingAddress.state,
        postalCode: data.billingAddress.postalCode,
        country: data.billingAddress.country,
        isDefaultBilling: false,
        isDefaultShipping: false,
      },
    });

    // Use same address for shipping if sameAsBilling is true
    const shippingAddressID = data.sameAsBilling
      ? createdBillingAddress.id
      : (
          await prisma.address.create({
            data: {
              userID,
              fullName: data.shippingAddress.fullName,
              addressLine1: data.shippingAddress.addressLine1,
              addressLine2: data.shippingAddress.addressLine2 || null,
              city: data.shippingAddress.city,
              state: data.shippingAddress.state,
              postalCode: data.shippingAddress.postalCode,
              country: data.shippingAddress.country,
              isDefaultBilling: false,
              isDefaultShipping: false,
            },
          })
        ).id;

    // Determine order type
    const hasRentals = data.items.some((item) => item.type === "RENT");
    const orderType = hasRentals ? "RENT" : "PURCHASE";

    // Create order with PENDING status
    const order = await prisma.order.create({
      data: {
        userID,
        billingAddressID: createdBillingAddress.id,
        shippingAddressID,
        totalAmount: data.totalAmount,
        shippingFee: data.shippingFee,
        status: "PENDING",
        type: orderType,
        orderItems: {
          create: data.items.map((item) => ({
            productID: item.productID,
            quantity: item.quantity,
            price: item.price,
            type: item.type,
            rentalStartDate: item.rentalStartDate
              ? new Date(item.rentalStartDate)
              : null,
            rentalEndDate: item.rentalEndDate ? new Date(item.rentalEndDate) : null,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return {
      success: true,
      orderID: order.id,
      message: "Order created successfully",
    };
  } catch (error) {
    console.error("Checkout error:", error);
    return { success: false, error: "Failed to process checkout" };
  }
}
