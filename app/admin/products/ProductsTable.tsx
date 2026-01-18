"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  rentalPrice: number;
  purchasePrice: number;
  rentalSalePrice: number | null;
  purchaseSalePrice: number | null;
  quantity: number;
  image: string;
  // additionalImages: string[] | null;
  // features: string[];
  // specifications: Record<string, string>;
  createdAt: Date;
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { getAllProducts } = await import("@/lib/queries/products");
      const data = await getAllProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { deleteProduct } = await import("@/lib/actions/product");
      const result = await deleteProduct(productId);

      if (result.success) {
        setProducts(products.filter((p) => p.id !== productId));
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
                  Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  Rent Price
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  Purchase Price
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  Stock
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                  Added On
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
                      {new Date(product.createdAt).toLocaleDateString()}
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
    </div>
  );
}
