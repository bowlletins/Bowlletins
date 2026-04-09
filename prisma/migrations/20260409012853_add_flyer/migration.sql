-- CreateTable
CREATE TABLE "Flyer" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Flyer_pkey" PRIMARY KEY ("id")
);
