/*
  Warnings:

  - The values [FACULTY] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('STUDENT', 'STAFF', 'ADMIN');
ALTER TABLE "Resource" ALTER COLUMN "allowedUsers" TYPE "UserRole_new"[] USING ("allowedUsers"::text::"UserRole_new"[]);
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;
