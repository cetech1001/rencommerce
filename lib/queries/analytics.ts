"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/auth";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number; // Percentage change from last period
  ordersChange: number;
  productsChange: number;
  usersChange: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();

  try {
    // Get current period stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Current period (last 30 days)
    const [currentOrders, previousOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
    ]);

    const currentRevenue = currentOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Total counts
    const [totalOrders, totalProducts, currentUsers, previousUsers] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
      }),
    ]);

    const totalUsers = await prisma.user.count();

    // Calculate percentage changes
    const revenueChange = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : currentRevenue > 0 ? 100 : 0;

    const ordersChange = previousOrders.length > 0
      ? ((currentOrders.length - previousOrders.length) / previousOrders.length) * 100
      : currentOrders.length > 0 ? 100 : 0;

    const productsChange = 0; // Products don't have a time-based change typically

    const usersChange = previousUsers > 0
      ? ((currentUsers - previousUsers) / previousUsers) * 100
      : currentUsers > 0 ? 100 : 0;

    // Total revenue (all time)
    const allOrders = await prisma.order.findMany();
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      revenueChange: Math.round(revenueChange * 10) / 10,
      ordersChange: Math.round(ordersChange * 10) / 10,
      productsChange: 0,
      usersChange: Math.round(usersChange * 10) / 10,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalUsers: 0,
      revenueChange: 0,
      ordersChange: 0,
      productsChange: 0,
      usersChange: 0,
    };
  }
}
