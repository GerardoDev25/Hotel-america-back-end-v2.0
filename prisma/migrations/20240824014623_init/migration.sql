-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('suit', 'normal');

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "roomType" "RoomType" NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "betsNumber" INTEGER NOT NULL,
    "isAvailable" BOOLEAN DEFAULT false,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
