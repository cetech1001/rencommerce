import Link from "next/link";
import { Users, Package, ShoppingCart, CreditCard, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "2,847", icon: Users, trend: "+12%" },
    { label: "Products", value: "156", icon: Package, trend: "+8" },
    { label: "Active Orders", value: "342", icon: ShoppingCart, trend: "+45%" },
    { label: "Total Revenue", value: "$89.2K", icon: CreditCard, trend: "+23%" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Sarah Johnson", product: "Solar Panel Kit", amount: "$1,299", status: "Completed" },
    { id: "ORD-002", customer: "Mike Chen", product: "Battery System", amount: "$5,499", status: "Processing" },
    { id: "ORD-003", customer: "Emma Rodriguez", product: "Wind Turbine", amount: "$12,999", status: "Pending" },
    { id: "ORD-004", customer: "John Smith", product: "Inverter", amount: "$2,899", status: "Completed" },
  ];

  return (
    <>
      {/* Admin Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-white/80">
                Manage users, products, orders, and payments
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-white text-sm font-medium">Live</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-8 sm:py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-border p-6 hover:border-primary transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                      {stat.trend}
                    </span>
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
      </section>

      {/* Dashboard Content */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
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
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {order.product}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground">
                            {order.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === "Completed"
                                  ? "bg-accent/20 text-accent"
                                  : order.status === "Processing"
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics Chart Placeholder */}
              <div className="bg-white rounded-lg border border-border p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                  Revenue Trend
                </h2>
                <div className="h-64 bg-gradient-to-b from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      Analytics chart will be implemented here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sm:space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Add New Product
                  </button>
                  <button className="w-full px-4 py-2.5 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
                    View Users
                  </button>
                  <button className="w-full px-4 py-2.5 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
                    Manage Payments
                  </button>
                  <button className="w-full px-4 py-2.5 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
                    Reports
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-lg border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      API Server
                    </span>
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Database
                    </span>
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Storage
                    </span>
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 text-sm">
                      3 Pending Orders
                    </h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Review and process pending orders to improve fulfillment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Features Grid */}
      <section className="py-12 sm:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
            Admin Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "User Management",
                desc: "Create, edit, and manage customer accounts and permissions",
              },
              {
                title: "Product Catalog",
                desc: "Add, edit, and organize your renewable energy equipment catalog",
              },
              {
                title: "Order Management",
                desc: "Track, process, and manage customer orders and shipments",
              },
              {
                title: "Payment Processing",
                desc: "Manage transactions, refunds, and payment settings",
              },
              {
                title: "Analytics & Reports",
                desc: "View detailed analytics and generate business reports",
              },
              {
                title: "Settings",
                desc: "Configure system settings, emails, and integrations",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-border p-6 hover:border-primary transition-all hover:shadow-lg"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Full Admin Suite Coming Soon
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            The complete admin dashboard with all management features is being
            developed. Stay tuned for the full release!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
