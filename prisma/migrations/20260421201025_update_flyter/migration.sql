/*
  Warnings:

  - The `category` column on the `Flyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FlyerCategory" AS ENUM ('Jobs', 'Internships', 'Volunteer', 'Events', 'Academics', 'Social', 'Clubs_Organizations', 'Other');

-- AlterTable
ALTER TABLE "Flyer" ADD COLUMN     "savedBy" TEXT[],
DROP COLUMN "category",
ADD COLUMN     "category" "FlyerCategory" NOT NULL DEFAULT 'Other';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" SET DEFAULT '/defaultpfp.png',
ALTER COLUMN "major" SET DEFAULT 'Other';
