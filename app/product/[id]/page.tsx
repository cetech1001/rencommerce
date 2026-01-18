"use server";

import { Suspense } from "react";
import ProductDetailContent from "./ProductDetailContent";

export default async function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
