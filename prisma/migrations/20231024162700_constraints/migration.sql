/*
  Warnings:

  - A unique constraint covering the columns `[userId,diaryPostId]` on the table `DiaryPostLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,tipId]` on the table `TipLike` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_userId_diaryPostId_key] UNIQUE NONCLUSTERED ([userId], [diaryPostId]);

-- CreateIndex
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followerId_followingId_key] UNIQUE NONCLUSTERED ([followerId], [followingId]);

-- CreateIndex
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_userId_tipId_key] UNIQUE NONCLUSTERED ([userId], [tipId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
