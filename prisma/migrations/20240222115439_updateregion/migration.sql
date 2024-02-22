/*
  Warnings:

  - Made the column `createdAt` on table `DiaryPostLike` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `stateCode` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[CityVisit] ALTER COLUMN [rating] INT NULL;
ALTER TABLE [dbo].[CityVisit] ALTER COLUMN [message] NVARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE [dbo].[DiaryPostLike] ALTER COLUMN [createdAt] DATETIME2 NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Region] ADD [stateCode] NVARCHAR(1000) NOT NULL,
[type] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
