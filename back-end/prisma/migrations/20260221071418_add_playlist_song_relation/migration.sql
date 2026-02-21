/*
  Warnings:

  - You are about to drop the column `songId` on the `Playlist` table. All the data in the column will be lost.
  - Added the required column `name` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_songId_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "songId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL;
