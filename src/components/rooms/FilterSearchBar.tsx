"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, Users, Search } from "lucide-react";

interface FilterSearchBarProps {
  initialCheckIn: string;
  initialCheckOut: string;
  initialCapacity: string;
}

export function FilterSearchBar({ initialCheckIn, initialCheckOut, initialCapacity }: FilterSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [capacity, setCapacity] = useState(initialCapacity);

  const handleFilterSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (capacity) params.set("capacity", capacity);

    // Push state strings back onto URL endpoint configuration
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleFilterSearch}
      className="bg-card border rounded-xl shadow-xl p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
    >
      {/* 1. Check In Input */}
      <div className="space-y-1.5 flex flex-col">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" /> Arrival Date
        </label>
        <input
          type="date"
          value={checkIn}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full bg-background border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
        />
      </div>

      {/* 2. Check Out Input */}
      <div className="space-y-1.5 flex flex-col">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" /> Departure Date
        </label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-background border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
        />
      </div>

      {/* 3. Capacity Counter Selection */}
      <div className="space-y-1.5 flex flex-col">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-primary" /> Max Occupants
        </label>
        <select
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full bg-background border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium cursor-pointer"
        >
          <option value="">All Capacities</option>
          <option value="1">1 Guest</option>
          <option value="2">2 Guests</option>
          <option value="3">3 Guests</option>
          <option value="4">4+ Guests</option>
        </select>
      </div>

      {/* 4. Action Trigger Execution Trigger Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-semibold h-9.5 rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
        >
          <Search className="h-4 w-4" /> Check Availability
        </button>
      </div>
    </form>
  );
}