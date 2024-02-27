/*
  Warnings:

  - Added the required column `cityId` to the `TripDiary` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[TripDiary] ADD [cityId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[TripDiary] ADD CONSTRAINT [TripDiary_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
