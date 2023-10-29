/*
  Warnings:

  - Added the required column `cityId` to the `Tip` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[CityInterest] DROP CONSTRAINT [CityInterest_cityId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CityVisit] DROP CONSTRAINT [CityVisit_cityId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Tip] ADD [cityId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[User] ADD [cityId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tip] ADD CONSTRAINT [Tip_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CityVisit] ADD CONSTRAINT [CityVisit_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CityInterest] ADD CONSTRAINT [CityInterest_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
