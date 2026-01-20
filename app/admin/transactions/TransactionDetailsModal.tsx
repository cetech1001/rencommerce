"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { getTransactionByID } from "@/lib/queries/transaction";
import type { TransactionDetail } from "@/lib/types";
import { TransactionStatus } from "@/lib/prisma/enums";
import { Toast, type ToastType } from "@/lib/components/client";
import Link from "next/link";

interface TransactionDetailsModalProps {
  transactionID: string;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export function TransactionDetailsModal({ transactionID, onClose, onStatusUpdated }: TransactionDetailsModalProps) {
  const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<TransactionStatus | "">("");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    fetchTransaction();
  }, [transactionID]);

  const fetchTransaction = async () => {
    try {
      const data = await getTransactionByID(transactionID);
      setTransaction(data);
      if (data) {
        setNewStatus(data.status);
      }
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!transaction || !newStatus || newStatus === transaction.status) return;

    setUpdating(true);
    try {
      const { updateTransactionStatus } = await import("@/lib/actions/transaction");
      const result = await updateTransactionStatus(transactionID, newStatus);

      if (result.success) {
        await fetchTransaction();
        onStatusUpdated?.();
        setToast({ message: "Transaction status updated successfully", type: "success" });
      } else {
        setToast({ message: result.error || "Failed to update transaction status", type: "error" });
      }
    } catch (error) {
      console.error("Failed to update transaction status:", error);
      setToast({ message: "Failed to update transaction status", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "REFUNDED":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-muted text-foreground";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Transaction not found</h2>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-2xl w-full my-8">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold">Transaction Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Transaction ID
                </label>
                <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
                  {transaction.id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Order ID
                </label>
                <Link
                  href={`/admin/orders/${transaction.orderID}`}
                  className="text-sm font-mono bg-muted px-3 py-2 rounded block hover:bg-muted/80 text-primary"
                >
                  {transaction.orderID}
                </Link>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Customer
                </label>
                <p className="text-sm text-foreground">{transaction.userName}</p>
                <p className="text-xs text-muted-foreground">{transaction.userEmail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Amount
                </label>
                <p className="text-lg font-bold text-primary">${transaction.amount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Payment Method
                </label>
                <p className="text-sm text-foreground">{transaction.paymentMethod.replace("_", " ")}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Current Status
                </label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Created At
                </label>
                <p className="text-sm text-foreground">
                  {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-foreground">
                  {new Date(transaction.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Payment Information
              </label>
              <div className="bg-muted rounded-lg p-4">
                {Object.keys(transaction.paymentInfo).length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No payment information available</p>
                ) : (
                  <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                    {JSON.stringify(transaction.paymentInfo, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Status Update Section */}
            <div className="border-t border-border pt-4">
              <h3 className="text-lg font-semibold mb-4">Update Transaction Status</h3>
              <div className="flex items-center gap-4">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TransactionStatus)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={TransactionStatus.PENDING}>Pending</option>
                  <option value={TransactionStatus.COMPLETED}>Completed</option>
                  <option value={TransactionStatus.FAILED}>Failed</option>
                  <option value={TransactionStatus.REFUNDED}>Refunded</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || !newStatus || newStatus === transaction.status}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
