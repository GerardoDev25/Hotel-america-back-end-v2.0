/*
  Warnings:

  - Added the required column `state` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomState" AS ENUM ('free', 'occupied', 'under_maintenance', 'pending_cleaning');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "state" "RoomState" NOT NULL;
