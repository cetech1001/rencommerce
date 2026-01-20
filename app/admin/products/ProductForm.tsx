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
import { getProductByID } from "@/lib/queries";

interface ProductFormProps {
  productID?: string;
}

export function ProductForm({ productID }: ProductFormProps) {
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
    rentalSalePrice: null as number | null | undefined,
    purchaseSalePrice: null as number | null | undefined,
    quantity: 0,
    image: "",
    additionalImages: [] as string[],
    features: [] as string[],
    specifications: {} as Record<string, string>,
  });

  useEffect(() => {
    if (productID) {
      fetchProduct();
    }
  }, [productID]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      if (productID) {
        const product = await getProductByID(productID);
        if (product) {
          setFormData({
            name: product.name,
            shortDescription: product.shortDescription,
            longDescription: product.longDescription,
            category: product.category,
            rentalPrice: product.rentalPrice,
            purchasePrice: product.purchasePrice,
            rentalSalePrice: product.rentalSalePrice,
            purchaseSalePrice: product.purchaseSalePrice,
            quantity: product.quantity,
            image: product.image,
            additionalImages: product.additionalImages || [],
            features: product.features || [],
            specifications: product.specifications || {},
          });
        }
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
      if (productID) {
        // Update existing product
        const { updateProduct } = await import("@/lib/actions/product");
        const result = await updateProduct({
          id: productID,
          ...formData,
        });

        if (!result.success) {
          setError(result.error || "Failed to update product");
          setSaving(false);
          return;
        }
      } else {
        // Create new product
        const { createProduct } = await import("@/lib/actions/product");
        const result = await createProduct(formData);

        if (!result.success) {
          setError(result.error || "Failed to create product");
          setSaving(false);
          return;
        }
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
          {productID ? "Edit Product" : "Create Product"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {productID
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
            {saving ? "Saving..." : productID ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
