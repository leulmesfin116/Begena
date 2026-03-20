import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fixFiles() {
  const songs = await prisma.song.findMany();
  const uploadsDir = path.join(__dirname, 'uploads');

  for (const song of songs) {
    let updated = false;
    let newAudioUrl = song.audioUrl;
    let newPosterUrl = song.posterUrl;

    // Fix Audio URL and File
    if (song.audioUrl.includes(' ') || song.audioUrl.includes('#')) {
      const oldFilename = path.basename(song.audioUrl);
      const newFilename = oldFilename.replace(/[^a-z0-9.]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const oldPath = path.join(uploadsDir, oldFilename);
      const newPath = path.join(uploadsDir, newFilename);

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed audio: ${oldFilename} -> ${newFilename}`);
      }
      newAudioUrl = song.audioUrl.replace(oldFilename, newFilename);
      updated = true;
    }

    // Fix Poster URL and File
    if (song.posterUrl.includes(' ') || song.posterUrl.includes('#') || song.posterUrl.includes('%')) {
       // Also check for % just in case it was partially encoded
      const oldFilename = decodeURIComponent(path.basename(song.posterUrl));
      const newFilename = oldFilename.replace(/[^a-z0-9.]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const oldPath = path.join(uploadsDir, oldFilename);
      const newPath = path.join(uploadsDir, newFilename);

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed poster: ${oldFilename} -> ${newFilename}`);
      } else {
          // Try with originalbasename if decode failed or wasn't needed
          const altOldFilename = path.basename(song.posterUrl);
          const altOldPath = path.join(uploadsDir, altOldFilename);
          if (fs.existsSync(altOldPath)) {
              fs.renameSync(altOldPath, newPath);
              console.log(`Renamed poster (alt): ${altOldFilename} -> ${newFilename}`);
          }
      }
      
      newPosterUrl = song.posterUrl.replace(path.basename(song.posterUrl), newFilename);
      updated = true;
    }

    if (updated) {
      await prisma.song.update({
        where: { id: song.id },
        data: {
          audioUrl: newAudioUrl,
          posterUrl: newPosterUrl
        }
      });
      console.log(`Updated song: ${song.title}`);
    }
  }
}

fixFiles().catch(console.error).finally(() => prisma.$disconnect());
