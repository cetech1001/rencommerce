"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./auth";
import { revalidatePath } from "next/cache";
import { TransactionStatus } from "@/lib/prisma/enums";

export async function updateTransactionStatus(
  transactionID: string,
  newStatus: TransactionStatus
) {
  await requireAdmin();

  try {
    await prisma.transaction.update({
      where: { id: transactionID },
      data: { status: newStatus },
    });

    revalidatePath("/admin/transactions");

    return { success: true };
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return { success: false, error: "Failed to update transaction status" };
  }
}
