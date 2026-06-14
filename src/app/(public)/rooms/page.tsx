import { getRooms } from "@/lib/queries/rooms";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomSearch } from "@/components/search/RoomSearch";

export const metadata = {
  title: "Our Suites & Rooms | AuraStay",
  description: "Explore our elegant rooms and premium amenities.",
};

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Our Suites & Rooms</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the perfect accommodation for your stay. Each room is designed with luxury and comfort in mind.
            </p>
          </div>
          <RoomSearch />
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="container mx-auto px-4 py-16">
        {rooms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No rooms available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
