"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import type { TransactionListItem, TransactionStatus } from "@/lib/types";
import { TransactionDetailsModal } from "./TransactionDetailsModal";

type TransactionFilter = "ALL" | TransactionStatus;

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<TransactionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TransactionFilter>("ALL");
  const [selectedTransactionID, setSelectedTransactionID] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const { getAllTransactions } = await import("@/lib/queries/transaction");
      const data = await getAllTransactions();
      setTransactions(data || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = filter === "ALL"
    ? transactions
    : transactions.filter(transaction => transaction.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "REFUNDED":
        return "bg-purple-100 text-purple-700";
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
          <h2 className="text-lg font-semibold">All Transactions</h2>
          <div className="flex gap-2">
            {(["ALL", "PENDING", "COMPLETED", "FAILED", "REFUNDED"] as const).map((status) => (
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
                Transaction ID
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Order ID
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Customer
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Amount
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Payment Method
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Status
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Date
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    #{transaction.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    #{transaction.orderId.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {transaction.userName}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(transaction.transactionDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedTransactionID(transaction.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedTransactionID && (
        <TransactionDetailsModal
          transactionID={selectedTransactionID}
          onClose={() => setSelectedTransactionID(null)}
          onStatusUpdated={() => fetchTransactions(false)}
        />
      )}
    </div>
  );
}
