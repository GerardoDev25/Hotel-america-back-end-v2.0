/*
  Warnings:

  - The values [back] on the enum `TypePayment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypePayment_new" AS ENUM ('cash', 'credit_cart', 'qr', 'bank');
ALTER TABLE "Payment" ALTER COLUMN "type" TYPE "TypePayment_new" USING ("type"::text::"TypePayment_new");
ALTER TYPE "TypePayment" RENAME TO "TypePayment_old";
ALTER TYPE "TypePayment_new" RENAME TO "TypePayment";
DROP TYPE "TypePayment_old";
COMMIT;
