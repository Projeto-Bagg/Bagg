/*
  Warnings:

  - You are about to drop the column `tipId` on the `TipWord` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[TipWord] DROP CONSTRAINT [TipWord_tipId_fkey];

-- AlterTable
ALTER TABLE [dbo].[TipWord] DROP COLUMN [tipId];

-- CreateTable
CREATE TABLE [dbo].[_TipToTipWord] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_TipToTipWord_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_TipToTipWord_B_index] ON [dbo].[_TipToTipWord]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_TipToTipWord] ADD CONSTRAINT [_TipToTipWord_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Tip]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TipToTipWord] ADD CONSTRAINT [_TipToTipWord_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[TipWord]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
