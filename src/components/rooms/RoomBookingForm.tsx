"use client";

import { useState, useEffect } from "react";
import { getBlockedDatesForRoomType } from "@/actions/booking-calendar";
import { createBooking } from "@/actions/booking-actions"; // 🟢 Wire up your existing action file
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RoomBookingFormProps {
  roomTypeId: string;
  roomId: string; // 🟢 Added to uniquely target the physical asset unit mapped in your public view page
  pricePerNight: number;
}

export function RoomBookingForm({ roomTypeId, roomId, pricePerNight }: RoomBookingFormProps) {
  const [blockedDates, setBlockedDates] = useState<{ from: Date; to: Date }[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadAvailability() {
      const dates = await getBlockedDatesForRoomType(roomTypeId);
      setBlockedDates(dates);
      setIsLoading(false);
    }
    loadAvailability();
  }, [roomTypeId]);

  const calculateTotalCost = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * pricePerNight : 0;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return toast.error("Please select valid reservation dates.");
    
    setIsSubmitting(true);
    try {
      // 🟢 Fix: Safely convert input strings into standard JS Date objects before submitting to the Server Action
      const result = await createBooking({
        roomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut)
      });

      if (result.success) {
        toast.success("Room held successfully! Directing to payment portal...");
        router.refresh();
        
        // 🟢 We will route to a payment initialization trigger route
        window.location.href = `/api/checkout?bookingId=${result.bookingId}`;
      } else {
        throw new Error("Reservation execution error.");
      }
    } catch (err: any) {
      toast.error(`Booking Matrix Failure: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 border rounded-xl bg-card flex flex-col items-center justify-center h-48 space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Scanning live room inventory calendar...</p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
      <div>
        <h3 className="text-xl font-bold text-foreground">${pricePerNight} <span className="text-sm font-normal text-muted-foreground">/ night</span></h3>
        <p className="text-xs text-muted-foreground mt-0.5">Tax and localized resort utilities calculated at checkout.</p>
      </div>

      <form onSubmit={handleBookingSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Check-In</label>
            <input 
              type="date" 
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Check-Out</label>
            <input 
              type="date" 
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium"
            />
          </div>
        </div>

        {calculateTotalCost() > 0 && (
          <div className="p-3 bg-muted/40 rounded-lg border border-dashed flex justify-between items-center text-sm">
            <span className="font-medium text-muted-foreground">Est. Total Amount:</span>
            <span className="font-mono font-bold text-foreground text-base">${calculateTotalCost()}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || calculateTotalCost() === 0}
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarIcon className="h-4 w-4" />}
          Reserve Room Tier
        </button>
      </form>
    </div>
  );
}