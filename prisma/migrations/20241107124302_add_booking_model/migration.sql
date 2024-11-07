-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "guestsNumber" INTEGER NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3),
    "roomNumber" INTEGER,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
