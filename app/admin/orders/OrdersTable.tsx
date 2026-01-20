"use client";

import { useState, useEffect } from "react";
import { Eye, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import type { OrderListItem, OrderStatus, PaginationMeta } from "@/lib/types";

type OrderFilter = "ALL" | OrderStatus;
type SortField = "createdAt" | "totalAmount";
type SortOrder = "asc" | "desc";

export function OrdersTable() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    totalCount: 0,
    totalPages: 0,
    itemsCount: 0,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, sortField, sortOrder]);

  const fetchOrders = async () => {
    try {
      const { getOrders } = await import("@/lib/queries/orders");
      const { data, meta } = await getOrders({
        isAdmin: true,
        page: currentPage,
        limit: itemsPerPage,
        orderBy: sortField,
        sortOrder,
      });
      setOrders(data || []);
      setPagination(meta);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const filteredOrders = filter === "ALL"
    ? orders
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Orders</h2>
          <div className="flex gap-2">
            {(["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Order ID
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Customer
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Type
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                <button
                  onClick={() => handleSort("totalAmount")}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  Total Amount
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Status
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  Order Date
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {order.userName}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.type === "RENT"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {pagination.itemsCount} of {pagination.totalCount} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-primary text-white"
                          : "border border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-1 rounded-lg border border-border text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
