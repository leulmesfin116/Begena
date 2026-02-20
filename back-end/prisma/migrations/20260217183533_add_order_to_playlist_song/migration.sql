/*
  Warnings:

  - A unique constraint covering the columns `[userId,songId]` on the table `FavouriteSong` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,songId]` on the table `Recentlyplayed` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "PlaylistSong" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaylistSong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSong_playlistId_songId_key" ON "PlaylistSong"("playlistId", "songId");

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteSong_userId_songId_key" ON "FavouriteSong"("userId", "songId");

-- CreateIndex
CREATE INDEX "Recentlyplayed_userId_playedAt_idx" ON "Recentlyplayed"("userId", "playedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Recentlyplayed_userId_songId_key" ON "Recentlyplayed"("userId", "songId");

-- AddForeignKey
ALTER TABLE "PlaylistSong" ADD CONSTRAINT "PlaylistSong_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSong" ADD CONSTRAINT "PlaylistSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
