/*
  Warnings:

  - You are about to drop the `_TipToTipWord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TipWordsOnTips` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tipId` to the `TipWord` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_TipToTipWord] DROP CONSTRAINT [_TipToTipWord_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_TipToTipWord] DROP CONSTRAINT [_TipToTipWord_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipWordsOnTips] DROP CONSTRAINT [TipWordsOnTips_tipId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipWordsOnTips] DROP CONSTRAINT [TipWordsOnTips_tipWordId_fkey];

-- AlterTable
ALTER TABLE [dbo].[TipWord] ADD [tipId] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[_TipToTipWord];

-- DropTable
DROP TABLE [dbo].[TipWordsOnTips];

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipWord] ADD CONSTRAINT [TipWord_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
