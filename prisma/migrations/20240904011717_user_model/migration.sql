-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('admin', 'laundry', 'reception', 'cafe');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "RoleType" NOT NULL,
    "birdDate" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
