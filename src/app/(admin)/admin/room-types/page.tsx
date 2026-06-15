import { prisma } from "@/lib/prisma";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Layers, Users } from "lucide-react";
import { AddRoomTypeModal } from "@/components/admin/AddRoomTypeModal";
import { RoomTypeRowActions } from "@/components/admin/RoomTypeRowActions";

export const revalidate = 0; // Fresh database data array fetches on layout mounts

export default async function AdminRoomTypesPage() {
  // 🛡️ Pre-seed Fallback: Auto-instantiate common basic amenities if database lookup is empty
  const existingAmenities = await prisma.amenity.findFirst();
  if (!existingAmenities) {
    await prisma.amenity.createMany({
      data: [
        { name: "Free High-Speed Wi-Fi" },
        { name: "All-Inclusive Mini Bar" },
        { name: "Air Conditioning" },
        { name: "Smart LED TV" },
        { name: "Ocean Horizon View" },
        { name: "Private Balcony Hot Tub" },
      ],
      skipDuplicates: true
    });
  }

  // 1. Fetch system classifications along with their relational joined structures
  const [roomTypes, globalAmenities]: [any[], any[]] = await Promise.all([
    prisma.roomType.findMany({
      include: {
        amenities: { include: { amenity: true } },
        rooms: true
      },
      orderBy: { price: "asc" }
    }),
    prisma.amenity.findMany({ 
      orderBy: { name: "asc" } 
    })
  ]);

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Layout Headers block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" /> Room Classification Tiers
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure core suites types, nightly price matrices, capacity variables, and map structural property amenities.
          </p>
        </div>

        {/* Dynamic Modal using your layout design */}
        <AddRoomTypeModal amenities={globalAmenities} />
      </div>

      {/* Main Configurations Directory Grid Ledger */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Classification Profile</TableHead>
              <TableHead>Nightly Rate</TableHead>
              <TableHead>Max Capacity</TableHead>
              <TableHead>Assigned Amenities</TableHead>
              <TableHead className="w-30 text-center">Units Count</TableHead>
              <TableHead className="w-20 text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                  No layout classifications registered yet. Map your first suite using the creator option above!
                </TableCell>
              </TableRow>
            ) : (
              roomTypes.map((type) => (
                <TableRow key={type.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="max-w-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground">{type.name}</span>
                      <span className="text-xs text-muted-foreground truncate">{type.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-sm text-foreground">
                    ${type.price.toLocaleString()}/night
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" /> {type.capacity} Guests Max
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {type.amenities.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">No unique perks assigned</span>
                      ) : (
                        type.amenities.map(({ amenity }: { amenity: any }) => (
                          <span key={amenity.id} className="inline-flex items-center text-[10px] font-bold tracking-wide bg-secondary text-secondary-foreground border px-2 py-0.5 rounded-md">
                            {amenity.name}
                          </span>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-sm text-primary">
                    {type.rooms.length} units
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {/* 🟢 NEW ACTIONS INJECTION: Handles stateful edit mapping and secure deletions inline */}
                    <RoomTypeRowActions roomType={type} globalAmenities={globalAmenities} />
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