"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/actions/booking-actions";
import { BookingStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface StatusDropdownProps {
  bookingId: string;
  currentStatus: BookingStatus;
}

export function BookingStatusDropdown({ bookingId, currentStatus }: StatusDropdownProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BookingStatus>(currentStatus);

  async function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value as BookingStatus;
    setLoading(true);

    try {
      const result = await updateBookingStatus({ bookingId, status: nextStatus });
      if (result.success) {
        setStatus(nextStatus);
      }
    } catch (error) {
      alert("Failed to update status parameters. Check database server logs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      <select
        value={status}
        onChange={handleStatusChange}
        disabled={loading}
        className="text-xs bg-background border border-input rounded p-1 font-medium focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50 cursor-pointer"
      >
        <option value="PENDING">PENDING</option>
        <option value="CONFIRMED">CONFIRMED</option>
        <option value="CHECKED_IN">CHECKED IN</option>
        <option value="CHECKED_OUT">CHECKED OUT</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    </div>
  );
}