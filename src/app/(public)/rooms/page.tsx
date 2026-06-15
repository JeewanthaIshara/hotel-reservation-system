import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSearchBar } from "@/components/rooms/FilterSearchBar";
import { RoomPriceSlider } from "@/components/rooms/RoomPriceSlider";

interface SearchProps {
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    capacity?: string;
    maxPrice?: string;
  }>;
}

export const revalidate = 0;

export default async function PublicRoomsPage({ searchParams }: SearchProps) {
  const params = await searchParams;
  
  // Parse parameters safely
  const filterCapacity = params.capacity ? parseInt(params.capacity, 10) : undefined;
  const maxPriceFilter = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const checkInDate = params.checkIn ? new Date(params.checkIn) : undefined;
  const checkOutDate = params.checkOut ? new Date(params.checkOut) : undefined;

  // Fetch room types matching parameters, including their physical room sub-inventories
  const roomTypes = await prisma.roomType.findMany({
    where: {
      AND: [
        filterCapacity ? { capacity: { gte: filterCapacity } } : {},
        maxPriceFilter ? { price: { lte: maxPriceFilter } } : {},
      ],
    },
    include: {
      rooms: {
        where: {
          status: "CLEAN",
          available: true,
        },
        include: {
          bookings: {
            where: {
              status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
            },
          },
        },
      },
    },
  });

  // Filter out room types that have no available physical units within the selected dates
  const availableRoomTypes = roomTypes.filter((type) => {
    // If no dates are explicitly selected by the user, show all matched catalog tiers
    if (!checkInDate || !checkOutDate) return true;

    if (type.rooms.length === 0) return false;

    const hasFreeRoom = type.rooms.some((room) => {
      const hasOverlap = room.bookings.some((booking) => {
        const bStart = new Date(booking.checkIn).getTime();
        const bEnd = new Date(booking.checkOut).getTime();
        const reqStart = checkInDate.getTime();
        const reqEnd = checkOutDate.getTime();

        return reqStart < bEnd && reqEnd > bStart;
      });
      return !hasOverlap;
    });

    return hasFreeRoom;
  });

  // Precise cinematic keyframe injectors mimicking easeOutQuart transitions
  const structuralAnimationStyles = (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes premiumFadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .aura-fade-up {
        animation: premiumFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `}} />
  );

  return (
    <div className="space-y-0 min-h-screen bg-background pb-16 overflow-x-hidden">
      {structuralAnimationStyles}
      
      {/* 🌌 Section 1: Cinematic Hero Canvas Header */}
      <div className="relative h-115 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
          alt="AuraStay Premium Resort Backdrop"
          fill
          priority
          className="object-cover opacity-50 select-none scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
        
        <div className="relative max-w-4xl mx-auto text-center px-4 space-y-4 pt-8">
          <span className="text-xs uppercase tracking-widest font-mono font-bold text-primary bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20 inline-block aura-fade-up opacity-0" style={{ animationDelay: '100ms' }}>
            ★ AuraStay Luxury Club & Suites
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg aura-fade-up opacity-0" style={{ animationDelay: '200ms' }}>
            Find Your Sanctuary
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed drop-shadow-md aura-fade-up opacity-0" style={{ animationDelay: '300ms' }}>
            Discover beautifully curated architectural suites designed for effortless luxury living.
          </p>
        </div>
      </div>

      {/* 🔍 Section 2: Interlocking Filter Bar Container */}
      <div className="max-w-5xl mx-auto px-4 -mt-14 relative z-20 aura-fade-up opacity-0" style={{ animationDelay: '400ms' }}>
        <FilterSearchBar 
          initialCheckIn={params.checkIn || ""} 
          initialCheckOut={params.checkOut || ""} 
          initialCapacity={params.capacity || ""} 
        />
      </div>

      {/* 🏨 Section 3: Professional Combined Filter Sidebar & Room Grid */}
      <div className="max-w-7xl mx-auto px-4 pt-16 space-y-8">
        
        <div className="flex items-center justify-between border-b pb-4 aura-fade-up opacity-0" style={{ animationDelay: '500ms' }}>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">Signature Suite Index</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Showing verified live system inventories.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 border rounded-xl bg-card text-muted-foreground">
            Yield: <span className="text-foreground">{availableRoomTypes.length}</span> Tier Matrices
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Interactive Pricing Controls Sidebar Column */}
          <aside className="p-6 rounded-2xl bg-card border shadow-sm space-y-4 lg:sticky lg:top-24 z-10 aura-fade-up opacity-0" style={{ animationDelay: '550ms' }}>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider border-b pb-3 text-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Architecture Filters
            </div>
            
            <RoomPriceSlider currentMaxPrice={maxPriceFilter} />
          </aside>

          {/* Room Display Grid Main Container */}
          <main className="lg:col-span-3">
            {availableRoomTypes.length === 0 ? (
              <div className="p-12 border border-dashed rounded-2xl bg-card text-center max-w-md mx-auto space-y-3 mt-12 aura-fade-up">
                <BedDouble className="h-8 w-8 text-muted-foreground/60 mx-auto" />
                <h3 className="font-bold text-lg">No Matching Suites Found</h3>
                <p className="text-sm text-muted-foreground">
                  Try moving your budget boundary thresholds up or adjusting your verification dates.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableRoomTypes.map((type, index) => {
                  const displayImage = type.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80";
                  
                  // 🟢 INTELLIGENT ROUTING EVALUATOR: Redirects to a clean room or passes dynamic params
                  const targetRoomId = type.rooms[0]?.id;
                  const targetHref = targetRoomId 
                    ? `/rooms/${targetRoomId}` 
                    : `/rooms/preview?typeId=${type.id}`;

                  return (
                    <div 
                      key={type.id} 
                      className="group border rounded-2xl bg-card shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col justify-between aura-fade-up opacity-0"
                      style={{ animationDelay: `${600 + (index * 75)}ms` }}
                    >
                      
                      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                        <Image
                          src={displayImage}
                          alt={type.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm shadow-sm px-2.5 py-1 rounded-lg text-xs font-mono font-black text-white">
                          ${type.price} <span className="font-normal text-slate-300 text-[10px]">/ night</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-lg tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {type.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light">
                            {type.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t flex flex-col space-y-3">
                          <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                            <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md">
                              <Users className="h-3 w-3 text-primary" /> Max {type.capacity} Guests
                            </span>
                            <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md font-mono text-[10px]">
                              {targetRoomId ? "🟢 Live Unit" : "⏳ Template"}
                            </span>
                          </div>

                          <Button className="w-full text-xs font-bold uppercase tracking-wider py-5 rounded-xl group/btn" asChild>
                            <Link href={targetHref}>
                              Configure Stay 
                              <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}