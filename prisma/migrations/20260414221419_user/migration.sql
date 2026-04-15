-- CreateEnum
CREATE TYPE "Major" AS ENUM ('Computer_Science', 'Business', 'Biology', 'Engineering', 'Psychology', 'English', 'Other');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "major" "Major";
