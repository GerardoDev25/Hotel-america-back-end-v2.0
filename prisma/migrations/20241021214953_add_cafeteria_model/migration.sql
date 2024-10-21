-- CreateTable
CREATE TABLE "Cafeteria" (
    "id" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isServed" BOOLEAN NOT NULL DEFAULT false,
    "guestId" TEXT NOT NULL,

    CONSTRAINT "Cafeteria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cafeteria" ADD CONSTRAINT "Cafeteria_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
