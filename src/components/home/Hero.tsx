import { RoomSearch } from "@/components/search/RoomSearch";

export function Hero() {
  return (
    <div className="relative bg-muted py-24 md:py-32 overflow-hidden border-b">
      <div className="container mx-auto px-4 text-center space-y-6 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Experience Ultimate Luxury & Comfort
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Book your sanctuary away from home. Immerse yourself in breathtaking design, pristine comfort, and bespoke service.
        </p>
        <div className="pt-8">
          <RoomSearch />
        </div>
      </div>
    </div>
  );
}