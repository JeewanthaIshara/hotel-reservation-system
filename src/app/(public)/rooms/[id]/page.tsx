import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server"; 
import { SignInButton } from "@clerk/nextjs";
import { CheckCircle2, ArrowLeft, Shield, Users, Maximize2 } from "lucide-react";
import { RoomBookingForm } from "@/components/rooms/RoomBookingForm";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ typeId?: string }>;
}

export default async function DynamicRoomViewPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const targetId = resolvedParams.id;
  const targetTypeId = resolvedSearchParams.typeId;

  let roomTypeData: any = null;
  let physicalRoomId: string | null = null;
  let assignedRoomDisplay = "Assigned upon check-in";

  // 🟢 ROUTING ROUTER LAYER: Evaluate incoming URL configuration states
  if (targetId === "preview" && targetTypeId) {
    // Look up via base RoomType ID template directly
    const baseType = await prisma.roomType.findUnique({
      where: { id: targetTypeId },
    });
    if (!baseType) notFound();
    
    roomTypeData = baseType;
  } else {
    // Traditional physical room asset lookup mapping back to its parent type
    const realPhysicalRoom = await prisma.room.findUnique({
      where: { id: targetId },
      include: { roomType: true },
    });
    if (!realPhysicalRoom) notFound();

    roomTypeData = realPhysicalRoom.roomType;
    physicalRoomId = realPhysicalRoom.id;
    assignedRoomDisplay = `Room ${realPhysicalRoom.roomNumber}`;
  }

  // Fetch the user session server-side safely
  const { userId } = await auth();

  const heroImage = roomTypeData.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-8 pt-24">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/rooms" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Rooms
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted shadow-sm">
            <Image 
              src={heroImage} 
              alt={roomTypeData.name} 
              fill 
              className="object-cover" 
              priority 
              sizes="(max-width: 1200px) 100vw, 800px"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tight md:text-4xl text-foreground">
              {roomTypeData.name}
            </h1>
            <p className="text-muted-foreground leading-relaxed text-base font-light">
              {roomTypeData.description}
            </p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-bold text-lg text-foreground">Suite Luxuries Included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "High-speed private mesh routing WiFi",
                "Master marble en-suite configurations",
                "Bespoke ambient temperature controllers",
                "Complimentary mini bar items"
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Interlocking Checkout Box */}
        <div className="h-fit border rounded-2xl p-6 shadow-md bg-card sticky top-24 space-y-6">
          <div className="space-y-3 p-4 bg-muted/60 rounded-xl text-xs font-medium text-muted-foreground">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" /> Max Capacity:</span> 
              <span className="font-bold text-foreground font-mono">{roomTypeData.capacity} Guests</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5 text-primary" /> Allocation Frame:</span> 
              <span className="font-bold text-foreground font-mono">{assignedRoomDisplay}</span>
            </div>
          </div>

          <div className="pt-2">
            {userId ? (
              physicalRoomId ? (
                <RoomBookingForm 
                  roomTypeId={roomTypeData.id} 
                  roomId={physicalRoomId} 
                  pricePerNight={roomTypeData.price} 
                />
              ) : (
                <div className="p-4 border rounded-xl bg-amber-500/10 border-amber-500/20 text-center space-y-2">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Tier At Max Capacity
                  </p>
                  <p className="text-xs text-muted-foreground font-light">
                    There are no individual ready units available for online reservation instantly. Please modify filter queries.
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Nightly Rate</span>
                  <div>
                    <span className="text-3xl font-black text-foreground font-mono">${roomTypeData.price}</span>
                    <span className="text-sm text-muted-foreground font-light"> / night</span>
                  </div>
                </div>
                <SignInButton mode="modal">
                  <Button className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm">
                    Sign In to Complete Booking
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
          <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1 font-light">
            <Shield className="h-3 w-3 text-emerald-500" /> SSL Secured Transaction Gateway.
          </p>
        </div>
      </div>
    </div>
  );
}