/*
  Warnings:

  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `writers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "lastName",
ADD COLUMN     "last_name" TEXT;

-- AlterTable
ALTER TABLE "writers" DROP COLUMN "lastName",
ADD COLUMN     "last_name" TEXT;
