"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Bed, CheckCircle2 } from "lucide-react";

// 🎛️ Updated Type Signatures to match our database query include map
interface RoomCardProps {
  room: {
    id: string;
    roomNumber: string;
    roomType: {
      name: string;
      description: string;
      price: number;
      capacity: number;
      images: string[];
      // 🟢 Added to support relational join modeling
      amenities?: Array<{
        amenity: {
          id: string;
          name: string;
        };
      }>;
    };
  };
}

export function RoomCard({ room }: RoomCardProps) {
  // Extract and safe-fall back arrays to avoid map evaluation exceptions
  const amenitiesList = room.roomType.amenities || [];
  const displayImage = room.roomType.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

  return (
    <Card className="overflow-hidden flex flex-col justify-between group h-full hover:shadow-md transition-shadow">
      <div>
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image 
            src={displayImage} 
            alt={room.roomType.name}
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {room.roomType.name}
            </CardTitle>
            <span className="text-xs font-mono px-2 py-1 bg-muted rounded-md text-muted-foreground whitespace-nowrap">
              Rm {room.roomNumber}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-10">
            {room.roomType.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" /> Max {room.roomType.capacity} Guests</span>
            <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5 text-primary" /> Luxury Bedding</span>
          </div>

          {/* 🟢 NEW: Multi-Perk Included Comforts Container Grid */}
          <div className="flex flex-col gap-2 border-t pt-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80">
              Included Comforts
            </span>
            
            {amenitiesList.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Standard resort provisions included.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {/* Slicing up to 4 items so UI layout remains compact and uniform across the grid */}
                {amenitiesList.slice(0, 4).map(({ amenity, amenityId }: any) => (
                <div key={amenityId} className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate" title={amenity.name}>{amenity.name}</span>
                </div>
              ))}
              </div>
            )}
            
            {/* Soft indicator pill showing remaining amenity counts if excessive counts occur */}
            {amenitiesList.length > 4 && (
              <span className="text-[10px] font-semibold text-primary/90 mt-0.5">
                + {amenitiesList.length - 4} more luxury premium perks
              </span>
            )}
          </div>
        </CardContent>
      </div>
      
      <CardFooter className="flex items-center justify-between border-t bg-muted/30 p-6">
        <div>
          <span className="text-2xl font-bold text-foreground">${room.roomType.price}</span>
          <span className="text-xs text-muted-foreground"> / night</span>
        </div>
        <Button size="sm" asChild className="font-semibold shadow-sm">
          <Link href={`/rooms/${room.id}`}>View Suite</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}