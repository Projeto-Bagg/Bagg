/*
  Warnings:

  - You are about to drop the column `regionId` on the `Country` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,cityId]` on the table `CityInterest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,cityId]` on the table `CityVisit` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Country] DROP COLUMN [regionId];

-- CreateIndex
ALTER TABLE [dbo].[CityInterest] ADD CONSTRAINT [CityInterest_userId_cityId_key] UNIQUE NONCLUSTERED ([userId], [cityId]);

-- CreateIndex
ALTER TABLE [dbo].[CityVisit] ADD CONSTRAINT [CityVisit_userId_cityId_key] UNIQUE NONCLUSTERED ([userId], [cityId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
