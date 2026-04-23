/*
  Warnings:

  - Changed the type of `category` on the `Flyer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Jobs', 'Internships', 'Events', 'StudyGroups', 'Social', 'Clubs');

-- AlterTable
ALTER TABLE "Flyer" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" SET DEFAULT '/defaultpfp.png',
ALTER COLUMN "major" SET DEFAULT 'Other';
