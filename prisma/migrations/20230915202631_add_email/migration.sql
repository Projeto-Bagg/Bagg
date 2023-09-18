/*
  Warnings:

  - The `emailVerified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[City] DROP CONSTRAINT [City_regionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPost] DROP CONSTRAINT [DiaryPost_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPostLike] DROP CONSTRAINT [DiaryPostLike_tipId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Follow] DROP CONSTRAINT [Follow_followingId_fkey];

-- AlterTable
ALTER TABLE [dbo].[DiaryPostLike] ALTER COLUMN [createdAt] DATETIME2 NULL;

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [emailVerified];
ALTER TABLE [dbo].[User] ADD [emailVerified] BIT NOT NULL CONSTRAINT [User_emailVerified_df] DEFAULT 0;

-- AddForeignKey
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followingId_fkey] FOREIGN KEY ([followingId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPost] ADD CONSTRAINT [DiaryPost_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[City] ADD CONSTRAINT [City_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
