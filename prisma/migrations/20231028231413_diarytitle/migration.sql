/*
  Warnings:

  - You are about to drop the column `title` on the `DiaryPost` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Tip` table. All the data in the column will be lost.
  - Made the column `message` on table `DiaryPost` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPost] DROP CONSTRAINT [DiaryPost_tripDiaryId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPost] DROP CONSTRAINT [DiaryPost_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPostLike] DROP CONSTRAINT [DiaryPostLike_diaryPostId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPostLike] DROP CONSTRAINT [DiaryPostLike_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipComment] DROP CONSTRAINT [TipComment_tipId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipComment] DROP CONSTRAINT [TipComment_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipLike] DROP CONSTRAINT [TipLike_tipId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipLike] DROP CONSTRAINT [TipLike_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[DiaryPost] ALTER COLUMN [message] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[DiaryPost] DROP COLUMN [title];

-- AlterTable
ALTER TABLE [dbo].[Tip] DROP COLUMN [title];

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPost] ADD CONSTRAINT [DiaryPost_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPost] ADD CONSTRAINT [DiaryPost_tripDiaryId_fkey] FOREIGN KEY ([tripDiaryId]) REFERENCES [dbo].[TripDiary]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_diaryPostId_fkey] FOREIGN KEY ([diaryPostId]) REFERENCES [dbo].[DiaryPost]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipComment] ADD CONSTRAINT [TipComment_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipComment] ADD CONSTRAINT [TipComment_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
