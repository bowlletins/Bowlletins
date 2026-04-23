/*
  Warnings:

  - You are about to drop the column `savedBy` on the `Flyer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flyer" DROP COLUMN "savedBy",
ADD COLUMN     "savedby" TEXT[];
