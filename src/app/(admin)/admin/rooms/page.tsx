import { prisma } from "@/lib/prisma";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { BedDouble } from "lucide-react";
import { AddRoomModal } from "@/components/admin/AddRoomModal";
import { RoomStatusSelect } from "@/components/admin/RoomStatusSelect";

export const revalidate = 0; // Fresh database query on every page load

export default async function AdminRoomsPage() {
  // 1. Fetch individual physical rooms alongside their parent RoomType metadata
  const [rooms, roomTypes] = await Promise.all([
    prisma.room.findMany({
      include: {
        roomType: true, 
      },
      orderBy: { roomNumber: "asc" },
    }),
    prisma.roomType.findMany({
      select: { id: true, name: true }
    })
  ]);

  return (
    <div className="space-y-6">
      {/* View Header block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-primary" /> Physical Inventory Units
          </h1>
          <p className="text-sm text-muted-foreground">
            Register physical rooms, allocate room numbers, and link them directly to structural tier suites.
          </p>
        </div>
        
        {/* Interactive Modal Form Dialog for adding rooms */}
        <AddRoomModal roomTypes={roomTypes} />
      </div>

      {/* Main Ledger Grid Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-30">Room Number</TableHead>
              <TableHead>Assigned Classification</TableHead>
              <TableHead>Booking Availability</TableHead>
              <TableHead className="text-right w-50">Housekeeping Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-sm text-muted-foreground">
                  No physical rooms registered yet. Use the action button above to map your first unit!
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-bold text-sm text-foreground">
                    Room {room.roomNumber}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm text-foreground">
                      {room.roomType?.name || "Unassigned"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {/* Visual indicator reflecting guest-facing system visibility */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      room.available 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400" 
                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}>
                      {room.available ? "ONLINE / BOOKABLE" : "OFFLINE LOCK"}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-end items-center pt-3">
                    {/* 🟢 NEW: Integrated Live State Controller Dropdown */}
                    <RoomStatusSelect roomId={room.id} currentStatus={room.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}