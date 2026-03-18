-- CreateTable
CREATE TABLE "Lofi" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lofi_pkey" PRIMARY KEY ("id")
);
