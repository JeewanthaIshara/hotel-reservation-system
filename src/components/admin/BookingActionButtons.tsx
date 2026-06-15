"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { processGuestCheckIn, processGuestCheckOut } from "@/actions/admin-operations";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";

interface BookingActionButtonsProps {
  bookingId: string;
  currentStatus: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
}

export function BookingActionButtons({ bookingId, currentStatus }: BookingActionButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const res = await processGuestCheckIn(bookingId);
      if (res.success) {
        toast.success("Guest successfully checked in! Room locked down.");
        router.refresh();
      } else {
        throw new Error(res.error || "Check-in failed");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      const res = await processGuestCheckOut(bookingId);
      if (res.success) {
        toast.success("Guest checked out. Room flagged for Housekeeping!");
        router.refresh();
      } else {
        throw new Error(res.error || "Check-out failed");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...
      </div>
    );
  }

  // Only show "Check In" button if the booking is confirmed (or pending setup)
  if (currentStatus === "CONFIRMED" || currentStatus === "PENDING") {
    return (
      <button
        onClick={handleCheckIn}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-md shadow-sm transition-colors"
      >
        <LogIn className="h-3.5 w-3.5" /> Complete Check-In
      </button>
    );
  }

  // Only show "Check Out" button if the guest is currently occupying the room
  if (currentStatus === "CHECKED_IN") {
    return (
      <button
        onClick={handleCheckOut}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-amber-600 text-white hover:bg-amber-700 rounded-md shadow-sm transition-colors"
      >
        <LogOut className="h-3.5 w-3.5" /> Process Check-Out
      </button>
    );
  }

  // Fallback label if the reservation lifecycle is complete or cancelled
  return (
    <span className="text-xs font-medium text-muted-foreground italic">
      No Actions Pending
    </span>
  );
}