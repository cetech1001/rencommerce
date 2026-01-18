import { Suspense } from "react";
import { TransactionsTable } from "./TransactionsTable";

export default function TransactionsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            View all payment transactions
          </p>
        </div>
      </div>

      <Suspense fallback={<div>Loading transactions...</div>}>
        <TransactionsTable />
      </Suspense>
    </div>
  );
}
