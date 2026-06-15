"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 🟢 FIXED: Updated to standard Next.js path core
import { updateRoomStatus } from "@/actions/admin-operations";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; 

interface RoomStatusSelectProps {
  roomId: string;
  currentStatus: "CLEAN" | "DIRTY" | "UNDER_MAINTENANCE";
}

export function RoomStatusSelect({ roomId, currentStatus }: RoomStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: "CLEAN" | "DIRTY" | "UNDER_MAINTENANCE") => {
    setIsLoading(true);
    const originalStatus = status;
    setStatus(newStatus); // Optimistic UI adjustment updates card visually

    try {
      const result = await updateRoomStatus(roomId, newStatus);
      
      if (result.success) {
        toast.success(`Room status shifted to ${newStatus}`);
        router.refresh(); // Syncs server data matrices instantly
      } else {
        throw new Error(result.error || "Update operation failed.");
      }
    } catch (error: any) {
      setStatus(originalStatus); // Rollback state parameters on mutation rejection
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Status Badge Colors dictionary matching your active styles
  const badgeStyles = {
    CLEAN: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    DIRTY: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    UNDER_MAINTENANCE: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  return (
    <div className="flex items-center gap-2 min-w-40">
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      
      <select
        value={status}
        disabled={isLoading}
        onChange={(e) => handleStatusChange(e.target.value as any)}
        className={`w-full text-xs font-semibold px-2.5 py-1.5 rounded-md border shadow-sm cursor-pointer focus:outline-none transition-colors ${badgeStyles[status]}`}
      >
        <option value="CLEAN" className="bg-background text-foreground font-medium">✨ Clean / Ready</option>
        <option value="DIRTY" className="bg-background text-foreground font-medium">🧹 Needs Cleaning</option>
        <option value="UNDER_MAINTENANCE" className="bg-background text-foreground font-medium">🛠️ Maintenance</option>
      </select>
    </div>
  );
}