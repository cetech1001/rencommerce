import { Suspense } from "react";
import { OrdersTable } from "./OrdersTable";

export default function OrdersPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">
            View and manage customer orders
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersTable />
      </Suspense>
    </div>
  );
}
