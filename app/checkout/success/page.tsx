"use server";

import { Suspense } from "react";
import CheckoutSuccessContent from "./CheckoutSuccessContent";

export default async function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
