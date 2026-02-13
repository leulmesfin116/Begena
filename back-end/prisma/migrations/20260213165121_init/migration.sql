/*
  Warnings:

  - You are about to drop the column `SongId` on the `FavouriteSong` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `FavouriteSong` table. All the data in the column will be lost.
  - You are about to drop the column `SongId` on the `Recentlyplayed` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `Recentlyplayed` table. All the data in the column will be lost.
  - You are about to drop the `playlist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `songId` to the `FavouriteSong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `FavouriteSong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `songId` to the `Recentlyplayed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Recentlyplayed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FavouriteSong" DROP COLUMN "SongId",
DROP COLUMN "UserId",
ADD COLUMN     "songId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recentlyplayed" DROP COLUMN "SongId",
DROP COLUMN "UserId",
ADD COLUMN     "songId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "playlist";

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FavouriteSong" ADD CONSTRAINT "FavouriteSong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteSong" ADD CONSTRAINT "FavouriteSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recentlyplayed" ADD CONSTRAINT "Recentlyplayed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recentlyplayed" ADD CONSTRAINT "Recentlyplayed_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
