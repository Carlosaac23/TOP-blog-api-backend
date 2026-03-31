/*
  Warnings:

  - Added the required column `bio` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bio` to the `writers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "writers" ADD COLUMN     "bio" TEXT NOT NULL;
