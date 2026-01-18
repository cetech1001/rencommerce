"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { FormSection } from "@/lib/components/admin/FormSection";
import { ImageUpload } from "@/lib/components/admin/ImageUpload";
import { MultiImageUpload } from "@/lib/components/admin/MultiImageUpload";
import { ArrayInput } from "@/lib/components/admin/ArrayInput";
import { KeyValueInput } from "@/lib/components/admin/KeyValueInput";

interface ProductFormProps {
  productId?: string;
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
    category: "",
    rentalPrice: 0,
    purchasePrice: 0,
    rentalSalePrice: null as number | null,
    purchaseSalePrice: null as number | null,
    quantity: 0,
    image: "",
    additionalImages: [] as string[],
    features: [] as string[],
    specifications: {} as Record<string, string>,
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = await response.json();
      if (data.product) {
        setFormData({
          name: data.product.name,
          shortDescription: data.product.shortDescription,
          longDescription: data.product.longDescription,
          category: data.product.category,
          rentalPrice: data.product.rentalPrice,
          purchasePrice: data.product.purchasePrice,
          rentalSalePrice: data.product.rentalSalePrice,
          purchaseSalePrice: data.product.purchaseSalePrice,
          quantity: data.product.quantity,
          image: data.product.image,
          additionalImages: data.product.additionalImages || [],
          features: data.product.features || [],
          specifications: data.product.specifications || {},
        });
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = productId
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";

      const method = productId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save product");
        return;
      }

      router.push("/admin/products");
    } catch (err) {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          {productId ? "Edit Product" : "Create Product"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {productId
            ? "Update product information and details"
            : "Add a new product to your catalog"}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          description="Essential product details and descriptions"
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Solar Panel 300W"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Solar Panels, Batteries, Inverters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief overview of the product (1-2 sentences)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Long Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={formData.longDescription}
              onChange={(e) =>
                setFormData({ ...formData, longDescription: e.target.value })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Detailed product description including benefits, use cases, and key information"
            />
          </div>
        </FormSection>

        {/* Pricing & Inventory */}
        <FormSection
          title="Pricing & Inventory"
          description="Set product prices and stock quantity"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rental Price (per day) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.rentalPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rentalPrice: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Purchase Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchasePrice: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rental Sale Price (optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.rentalSalePrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rentalSalePrice: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Discounted rental price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Purchase Sale Price (optional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.purchaseSalePrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchaseSalePrice: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Discounted purchase price"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quantity in Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </FormSection>

        {/* Images */}
        <FormSection
          title="Product Images"
          description="Upload high-quality images of your product"
        >
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Main Product Image"
            required
          />

          <MultiImageUpload
            value={formData.additionalImages}
            onChange={(urls) =>
              setFormData({ ...formData, additionalImages: urls })
            }
            label="Additional Images"
          />
        </FormSection>

        {/* Features */}
        <FormSection
          title="Product Features"
          description="Highlight key features and benefits"
        >
          <ArrayInput
            value={formData.features}
            onChange={(features) => setFormData({ ...formData, features })}
            label="Features"
            placeholder="e.g., High efficiency, Weather resistant, 25-year warranty"
          />
        </FormSection>

        {/* Specifications */}
        <FormSection
          title="Technical Specifications"
          description="Add detailed technical specifications"
        >
          <KeyValueInput
            value={formData.specifications}
            onChange={(specifications) =>
              setFormData({ ...formData, specifications })
            }
            label="Specifications"
            keyPlaceholder="e.g., Weight"
            valuePlaceholder="e.g., 18.6 kg"
          />
        </FormSection>

        {/* Actions */}
        <div className="flex gap-4 sticky bottom-0 bg-white border-t border-border py-4 -mx-8 px-8">
          <Link
            href="/admin/products"
            className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors text-center font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : productId ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
