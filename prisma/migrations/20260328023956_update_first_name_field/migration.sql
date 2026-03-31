/*
  Warnings:

  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `writers` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `writers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstName",
ADD COLUMN     "first_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "writers" DROP COLUMN "firstName",
ADD COLUMN     "first_name" TEXT NOT NULL;
