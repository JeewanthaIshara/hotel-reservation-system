import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getUserBookings } from "@/lib/queries/rooms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MapPin, Bed, ArrowRight, ExternalLink } from "lucide-react";

export default async function CustomerDashboardPage() {
  // 1. Protect the route server-side with Clerk
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    redirect("/");
  }

  // 2. Fetch live reservations matching the user's ID from Supabase
  const bookings = await getUserBookings(userId);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl space-y-10 min-h-screen">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary/5 border p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-primary">
            <Image 
              src={user.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
              alt="Profile" 
              fill 
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.firstName || "Valued Guest"}!</h1>
            <p className="text-sm text-muted-foreground">Manage your luxury itineraries and reservations.</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/rooms" className="gap-2">
            Book Another Stay <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Main Grid: Bookings on left, Account Summary on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bookings Ledger List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Your Reservations
          </h2>

          {bookings.length === 0 ? (
            <Card className="border-dashed py-12 text-center">
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">You haven't booked any luxury suites yet.</p>
                <Button asChild>
                  <Link href="/rooms">Explore Suites & Rooms</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const mainImage = booking.room.roomType.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80";

                // 🧮 Compute the night stay count dynamically
                const timeDifference = new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime();
                const totalNights = Math.max(1, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)));
                
                // Multiply nights by room type nightly rate
                const calculatedTotal = booking.room.roomType.price * totalNights;

                return (
                    <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                        {/* ... keeping your image layout rendering ... */}
                        
                        {/* Booking Metadata */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                            <h3 className="font-bold text-lg text-foreground leading-tight">{booking.room.roomType.name}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Bed className="h-3 w-3" /> Room assigned: {booking.room.roomNumber} ({totalNights} {totalNights === 1 ? 'night' : 'nights'})
                            </p>
                            </div>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200">
                            {booking.status}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-muted-foreground border-t pt-2">
                            <div>
                            <span className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">Check-In</span>
                            <span className="font-medium text-foreground">{checkInDate}</span>
                            </div>
                            <div>
                            <span className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">Check-Out</span>
                            <span className="font-medium text-foreground">{checkOutDate}</span>
                            </div>
                            <div className="ml-auto text-right">
                            <span className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">Total Value</span>
                            {/* Updated to display your freshly calculated math parameters */}
                            <span className="font-bold text-sm text-foreground">${calculatedTotal}</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </Card>
                );
                })}
            </div>
          )}
        </div>

        {/* Account Quick Status Widget Side */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile Parameters
          </h2>
          
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-md font-semibold">Account Verified</CardTitle>
              <CardDescription>Logged in via secure auth portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground block">Primary Email</span>
                <span className="font-medium text-foreground truncate block">{user.emailAddresses[0]?.emailAddress}</span>
              </div>
              <div className="space-y-1 border-t pt-3">
                <span className="text-xs text-muted-foreground block">Loyalty Tier</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs border border-amber-200">
                  ★ Aura Elite Member
                </span>
              </div>
              <div className="border-t pt-4">
                <Button variant="outline" className="w-full gap-2 text-xs h-9" asChild>
                  <Link href="https://accounts.clerk.com" target="_blank">
                    Manage Clerk Security <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}