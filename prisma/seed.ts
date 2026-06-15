import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🔄 Seeding started...");

  // 1. Create Hotel
  const hotel = await prisma.hotel.create({
    data: {
      name: "Ocean View Resort",
      description: "Luxury beachfront hotel with modern facilities.",
      address: "Beach Road",
      city: "Colombo",
      phone: "+94112223344",
    },
  });

  // 2. Create Room Types
  const deluxe = await prisma.roomType.create({
    data: {
      name: "Deluxe Room",
      description: "Comfortable room with ocean view.",
      price: 150,
      capacity: 2,
      images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"],
    },
  });

  const suite = await prisma.roomType.create({
    data: {
      name: "Luxury Suite",
      description: "Premium suite with living area.",
      price: 300,
      capacity: 4,
      images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"],
    },
  });

  // 3. Create Rooms (Linked to Hotel and RoomTypes)
  await prisma.room.create({
    data: {
      roomNumber: "101",
      hotelId: hotel.id,
      roomTypeId: deluxe.id,
      status: "CLEAN",
    },
  });

  await prisma.room.create({
    data: {
      roomNumber: "102",
      hotelId: hotel.id,
      roomTypeId: deluxe.id,
      status: "CLEAN",
    },
  });

  await prisma.room.create({
    data: {
      roomNumber: "201",
      hotelId: hotel.id,
      roomTypeId: suite.id,
      status: "CLEAN",
    },
  });

  // 4. Create Base Amenities
  const wifi = await prisma.amenity.create({
    data: { name: "Free WiFi", icon: "Wifi" }
  });

  const pool = await prisma.amenity.create({
    data: { name: "Swimming Pool", icon: "Waves" }
  });

  const parking = await prisma.amenity.create({
    data: { name: "Parking", icon: "Car" }
  });

  // 5. Connect Amenities to RoomTypes using your 'TypeAmenity' model
  await prisma.typeAmenity.createMany({
    data: [
      {
        roomTypeId: deluxe.id,
        amenityId: wifi.id,
      },
      {
        roomTypeId: deluxe.id,
        amenityId: pool.id,
      },
      {
        roomTypeId: suite.id,
        amenityId: wifi.id,
      },
      {
        roomTypeId: suite.id,
        amenityId: pool.id,
      },
      {
        roomTypeId: suite.id,
        amenityId: parking.id,
      },
    ],
  });

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });