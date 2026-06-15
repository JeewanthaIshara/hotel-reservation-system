/*
  Warnings:

  - You are about to drop the `RoomAmenity` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Amenity` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RoomAmenity" DROP CONSTRAINT "RoomAmenity_amenityId_fkey";

-- DropForeignKey
ALTER TABLE "RoomAmenity" DROP CONSTRAINT "RoomAmenity_roomId_fkey";

-- AlterTable
ALTER TABLE "Amenity" ADD COLUMN     "icon" TEXT;

-- DropTable
DROP TABLE "RoomAmenity";

-- CreateTable
CREATE TABLE "TypeAmenity" (
    "roomTypeId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "TypeAmenity_pkey" PRIMARY KEY ("roomTypeId","amenityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_name_key" ON "Amenity"("name");

-- AddForeignKey
ALTER TABLE "TypeAmenity" ADD CONSTRAINT "TypeAmenity_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeAmenity" ADD CONSTRAINT "TypeAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
