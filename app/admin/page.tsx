import { Users, Package, ShoppingCart, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { getDashboardStats } from "@/lib/queries/analytics";
import { getOrders } from "@/lib/queries/orders";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const { data: recentOrders } = await getOrders({
    isAdmin: true,
    page: 1,
    limit: 5,
    orderBy: "createdAt",
    sortOrder: "desc",
  });

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      trend: stats.revenueChange,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      trend: stats.ordersChange,
    },
    {
      label: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      trend: stats.productsChange,
    },
    {
      label: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      trend: stats.usersChange,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              const isPositive = stat.trend >= 0;
              const TrendIcon = isPositive ? TrendingUp : TrendingDown;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-border p-6 hover:border-primary transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    {stat.trend !== 0 && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                      }`}>
                        <TrendIcon className="w-3 h-3" />
                        {Math.abs(stat.trend)}%
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div>
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Recent Orders
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                          No orders yet
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            <Link href={`/admin/orders/${order.id}`} className="hover:text-primary">
                              #{order.id.slice(0, 8)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {order.userName}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {order.type}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
