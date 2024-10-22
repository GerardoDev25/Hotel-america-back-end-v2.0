/*
  Warnings:

  - You are about to drop the column `checkIn` on the `Cafeteria` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cafeteria" DROP COLUMN "checkIn",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
