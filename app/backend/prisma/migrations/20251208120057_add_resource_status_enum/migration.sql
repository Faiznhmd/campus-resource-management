/*
  Warnings:

  - The `status` column on the `Resource` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "status",
ADD COLUMN     "status" "ResourceStatus" NOT NULL DEFAULT 'AVAILABLE';

-- DropEnum
DROP TYPE "Status";
