import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});


const prisma = new PrismaClient({
  adapter,
});

async function main() {


  // Create Hotel

  const hotel = await prisma.hotel.create({
    data: {
      name: "Ocean View Resort",
      description:
        "Luxury beachfront hotel with modern facilities.",
      address: "Beach Road",
      city: "Colombo",
      phone: "+94112223344",
    },
  });



  // Create Room Types

  const deluxe = await prisma.roomType.create({
    data: {
      name: "Deluxe Room",
      description:
        "Comfortable room with ocean view.",
      price: 150,
      capacity: 2,
    },
  });



  const suite = await prisma.roomType.create({
    data: {
      name: "Luxury Suite",
      description:
        "Premium suite with living area.",
      price: 300,
      capacity: 4,
    },
  });



  // Create Rooms


  const room1 = await prisma.room.create({
    data: {
      roomNumber: "101",
      hotelId: hotel.id,
      roomTypeId: deluxe.id,
    },
  });


  const room2 = await prisma.room.create({
    data: {
      roomNumber: "102",
      hotelId: hotel.id,
      roomTypeId: deluxe.id,
    },
  });


  const room3 = await prisma.room.create({
    data: {
      roomNumber: "201",
      hotelId: hotel.id,
      roomTypeId: suite.id,
    },
  });



  // Create Amenities


  const wifi = await prisma.amenity.create({
    data:{
      name:"Free WiFi"
    }
  });


  const pool = await prisma.amenity.create({
    data:{
      name:"Swimming Pool"
    }
  });


  const parking = await prisma.amenity.create({
    data:{
      name:"Parking"
    }
  });



  // Connect amenities


  await prisma.roomAmenity.createMany({
    data:[
      {
        roomId: room1.id,
        amenityId: wifi.id
      },
      {
        roomId: room1.id,
        amenityId: pool.id
      },
      {
        roomId: room2.id,
        amenityId: wifi.id
      },
      {
        roomId: room3.id,
        amenityId: parking.id
      }
    ]
  });


  console.log("Seed completed");

}


main()
.catch((error)=>{

console.error(error);

process.exit(1);

})
.finally(async()=>{

await prisma.$disconnect();

});