/*
  Warnings:

  - You are about to drop the column `game` on the `Post` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "message" TEXT,
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "commentsAmount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("commentsAmount", "createdAt", "id", "thumbnailUrl", "title", "userId", "videoUrl") SELECT "commentsAmount", "createdAt", "id", "thumbnailUrl", "title", "userId", "videoUrl" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
