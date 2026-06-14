import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Bed, Layers } from "lucide-react";

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
    };
  };
}

export function RoomCard({ room }: RoomCardProps) {
  // Graceful fallback string array for placeholder states
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
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold tracking-tight">{room.roomType.name}</CardTitle>
            <span className="text-xs font-mono px-2 py-1 bg-muted rounded-md text-muted-foreground">Rm {room.roomNumber}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {room.roomType.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Max {room.roomType.capacity} Guests</span>
            <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> Luxury Bedding</span>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex items-center justify-between border-t bg-muted/30 p-6">
        <div>
          <span className="text-2xl font-bold text-foreground">${room.roomType.price}</span>
          <span className="text-xs text-muted-foreground"> / night</span>
        </div>
        <Button size="sm" asChild>
          <Link href={`/rooms/${room.id}`}>View Suite</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}