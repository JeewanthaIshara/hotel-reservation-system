import { prisma } from "@/lib/prisma";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CalendarDays } from "lucide-react";
import { BookingActionButtons } from "@/components/admin/BookingActionButtons";

export const revalidate = 0; // Ensure fresh data on every workspace view reload

export default async function AdminBookingsPage() {
  // Query all active records and tap into the underlying relational maps
  const bookings = await prisma.booking.findMany({
    include: {
      user: { select: { name: true, email: true } },
      room: { select: { roomNumber: true } }
    },
    orderBy: { checkIn: "asc" }
  });

  // Color mapper dictionary to quickly visualize booking states
  const statusBadges = {
    PENDING: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
    CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400",
    CHECKED_IN: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
    CHECKED_OUT: "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-400",
    CANCELLED: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400",
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Section Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" /> Active Hotel Reservations
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor incoming check-ins, oversee current room occupants, and process check-outs to trigger the cleaning pipeline automatically.
        </p>
      </div>

      {/* Primary Data Ledger Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Guest Detail</TableHead>
              <TableHead>Allocated Unit</TableHead>
              <TableHead>Check-In Date</TableHead>
              <TableHead>Check-Out Date</TableHead>
              <TableHead>Current Lifecycle</TableHead>
              <TableHead className="text-right w-48">Front-Desk Desk Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                  No reservations logged inside the database ledger yet.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const formattedCheckIn = new Date(booking.checkIn).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric"
                });
                const formattedCheckOut = new Date(booking.checkOut).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric"
                });

                return (
                  <TableRow key={booking.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground">
                          {booking.user?.name || "Anonymous Guest"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {booking.user?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-sm text-foreground">
                      Rm {booking.room?.roomNumber || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-medium">
                      {formattedCheckIn}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-medium">
                      {formattedCheckOut}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadges[booking.status]}`}>
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Injecting client side micro-interactions directly into server row mapping */}
                      <BookingActionButtons bookingId={booking.id} currentStatus={booking.status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}