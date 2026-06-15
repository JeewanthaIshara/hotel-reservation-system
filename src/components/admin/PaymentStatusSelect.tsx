"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePaymentStatus } from "@/actions/payment-operations";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentStatusSelectProps {
  paymentId: string;
  currentStatus: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
}

export function PaymentStatusSelect({ paymentId, currentStatus }: PaymentStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED") => {
    setIsLoading(true);
    const originalStatus = status;
    setStatus(newStatus);

    try {
      const result = await updatePaymentStatus(paymentId, newStatus);
      if (result.success) {
        toast.success(`Payment status marked as ${newStatus}`);
        router.refresh();
      } else {
        throw new Error(result.error || "Update operation failed.");
      }
    } catch (error: any) {
      setStatus(originalStatus);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const badgeStyles = {
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    FAILED: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    REFUNDED: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };

  return (
    <div className="flex items-center gap-2 min-w-40 justify-end">
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      
      <select
        value={status}
        disabled={isLoading}
        onChange={(e) => handleStatusChange(e.target.value as any)}
        className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border shadow-sm cursor-pointer focus:outline-none transition-colors ${badgeStyles[status]}`}
      >
        <option value="PENDING" className="bg-background text-foreground font-medium">⏳ Unpaid / Pending</option>
        <option value="SUCCESS" className="bg-background text-foreground font-medium">✅ Paid / Settled</option>
        <option value="FAILED" className="bg-background text-foreground font-medium">❌ Transaction Failed</option>
        <option value="REFUNDED" className="bg-background text-foreground font-medium">↩️ Disbursed Refund</option>
      </select>
    </div>
  );
}