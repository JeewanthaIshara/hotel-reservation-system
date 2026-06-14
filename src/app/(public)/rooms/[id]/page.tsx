import { getRoomById } from "@/lib/queries/rooms";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server"; // Server-side auth helper
import { SignInButton } from "@clerk/nextjs";
import { CheckCircle2, ArrowLeft, Shield, Users, Maximize2 } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DynamicRoomViewPage({ params }: Props) {
  const resolvedParams = await params;
  const room = await getRoomById(resolvedParams.id);

  if (!room) notFound();

  // Fetch the user session server-side
  const { userId } = await auth();

  const heroImage = room.roomType.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/rooms" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Rooms
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video rounded-xl overflow-hidden border bg-muted shadow-sm">
            <Image src={heroImage} alt={room.roomType.name} fill className="object-cover" priority />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{room.roomType.name}</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">{room.roomType.description}</p>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-lg">Suite Luxuries Included</h3>
            <div className="grid grid-cols-2 gap-4">
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

        {/* Sidebar Dynamic Checkout Box */}
        <div className="h-fit border rounded-xl p-6 shadow-lg bg-card sticky top-24 space-y-6">
          <div className="flex justify-between items-baseline">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Nightly Rate</span>
            <div>
              <span className="text-3xl font-black">${room.roomType.price}</span>
              <span className="text-sm text-muted-foreground"> / night</span>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Max Capacity:</span> 
              <span className="font-semibold text-foreground">{room.roomType.capacity} Guests</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1"><Maximize2 className="h-3 w-3" /> Assigned Location:</span> 
              <span className="font-semibold text-foreground">Room {room.roomNumber}</span>
            </div>
          </div>

          <div className="pt-2">
            {/* Direct server evaluation of user existence */}
            {userId ? (
              <Button className="w-full h-11 text-md font-semibold tracking-tight" asChild>
                <Link href={`/booking/create?room=${room.id}`}>Proceed to Checkout</Link>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button className="w-full h-11 text-md font-semibold tracking-tight">
                  Sign In to Complete Booking
                </Button>
              </SignInButton>
            )}
          </div>
          <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" /> SSL Secured Transaction Gateway.
          </p>
        </div>
      </div>
    </div>
  );
}