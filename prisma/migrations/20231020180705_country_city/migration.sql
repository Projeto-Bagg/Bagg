/*
  Warnings:

  - Added the required column `countryId` to the `City` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[City] DROP CONSTRAINT [City_regionId_fkey];

-- AlterTable
ALTER TABLE [dbo].[City] ADD [countryId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[City] ADD CONSTRAINT [City_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[Country]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[City] ADD CONSTRAINT [City_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
