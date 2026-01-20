"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import type { IProduct, PaginationMeta } from "@/lib/types";
import { PRODUCT_ORDER_BY } from "@/lib/types";

type SortOrder = "asc" | "desc";

export function ProductsTable() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<PRODUCT_ORDER_BY>(PRODUCT_ORDER_BY.CREATED_AT);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    totalCount: 0,
    totalPages: 0,
    itemsCount: 0,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortField, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { getProducts } = await import("@/lib/queries/products");
      const { data, meta } = await getProducts({
        page: currentPage,
        limit: itemsPerPage,
        orderBy: sortField,
        sortOrder,
        isActive: undefined,
      });
      setProducts(data);
      setPagination(meta);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: PRODUCT_ORDER_BY) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { deleteProduct } = await import("@/lib/actions/product");
      const result = await deleteProduct(productId);

      if (result.success) {
        await fetchProducts();
      } else {
        alert(result.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Products</h2>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Product
        </Link>
      </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  <button
                    onClick={() => handleSort(PRODUCT_ORDER_BY.NAME)}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Name
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  <button
                    onClick={() => handleSort(PRODUCT_ORDER_BY.RENTAL_PRICE)}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Rent Price
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  <button
                    onClick={() => handleSort(PRODUCT_ORDER_BY.PURCHASE_PRICE)}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Purchase Price
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  <button
                    onClick={() => handleSort(PRODUCT_ORDER_BY.QUANTITY)}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Stock
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  <button
                    onClick={() => handleSort(PRODUCT_ORDER_BY.CREATED_AT)}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    Added On
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      ${product.rentalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      ${product.purchasePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.quantity > 10
                            ? "bg-green-100 text-green-700"
                            : product.quantity > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {product.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
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
              Showing {pagination.itemsCount} of {pagination.totalCount} products
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
