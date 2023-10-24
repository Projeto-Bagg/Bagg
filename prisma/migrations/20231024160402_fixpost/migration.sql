/*
  Warnings:

  - You are about to drop the column `postId` on the `DiaryPostLike` table. All the data in the column will be lost.
  - You are about to drop the column `tipId` on the `DiaryPostLike` table. All the data in the column will be lost.
  - Added the required column `diaryPostId` to the `DiaryPostLike` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPostLike] DROP CONSTRAINT [DiaryPostLike_postId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPostLike] DROP CONSTRAINT [DiaryPostLike_tipId_fkey];

-- AlterTable
ALTER TABLE [dbo].[DiaryPostLike] DROP COLUMN [postId],
[tipId];
ALTER TABLE [dbo].[DiaryPostLike] ADD [diaryPostId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_diaryPostId_fkey] FOREIGN KEY ([diaryPostId]) REFERENCES [dbo].[DiaryPost]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
