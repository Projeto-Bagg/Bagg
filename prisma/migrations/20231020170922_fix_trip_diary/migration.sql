/*
  Warnings:

  - You are about to drop the column `code` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `diaryPostId` on the `TripDiary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iso2]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `capital` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iso2` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionId` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripDiaryId` to the `DiaryPost` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[City] DROP CONSTRAINT [City_regionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CityInterest] DROP CONSTRAINT [CityInterest_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CityVisit] DROP CONSTRAINT [CityVisit_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPostLike] DROP CONSTRAINT [DiaryPostLike_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPostMedia] DROP CONSTRAINT [DiaryPostMedia_diaryPostId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Follow] DROP CONSTRAINT [Follow_followerId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Follow] DROP CONSTRAINT [Follow_followingId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Region] DROP CONSTRAINT [Region_countryId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Tip] DROP CONSTRAINT [Tip_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipComment] DROP CONSTRAINT [TipComment_tipId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipComment] DROP CONSTRAINT [TipComment_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipLike] DROP CONSTRAINT [TipLike_tipId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipLike] DROP CONSTRAINT [TipLike_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipMedia] DROP CONSTRAINT [TipMedia_tipId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TripDiary] DROP CONSTRAINT [TripDiary_diaryPostId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TripDiary] DROP CONSTRAINT [TripDiary_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Country] DROP COLUMN [code];
ALTER TABLE [dbo].[Country] ADD [capital] NVARCHAR(1000) NOT NULL,
[iso2] NVARCHAR(1000) NOT NULL,
[regionId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[DiaryPost] ADD [tripDiaryId] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Region] DROP COLUMN [countryId];

-- AlterTable
ALTER TABLE [dbo].[TripDiary] DROP COLUMN [diaryPostId];

-- CreateTable
CREATE TABLE [dbo].[State] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [countryIso2] NVARCHAR(1000) NOT NULL,
    [latitude] FLOAT(53) NOT NULL,
    [longitude] FLOAT(53) NOT NULL,
    [type] NVARCHAR(1000),
    CONSTRAINT [State_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [State_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateIndex
ALTER TABLE [dbo].[Country] ADD CONSTRAINT [Country_name_key] UNIQUE NONCLUSTERED ([name]);

-- CreateIndex
ALTER TABLE [dbo].[Country] ADD CONSTRAINT [Country_iso2_key] UNIQUE NONCLUSTERED ([iso2]);

-- CreateIndex
ALTER TABLE [dbo].[Region] ADD CONSTRAINT [Region_name_key] UNIQUE NONCLUSTERED ([name]);

-- AddForeignKey
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followerId_fkey] FOREIGN KEY ([followerId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followingId_fkey] FOREIGN KEY ([followingId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPost] ADD CONSTRAINT [DiaryPost_tripDiaryId_fkey] FOREIGN KEY ([tripDiaryId]) REFERENCES [dbo].[TripDiary]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TripDiary] ADD CONSTRAINT [TripDiary_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostMedia] ADD CONSTRAINT [DiaryPostMedia_diaryPostId_fkey] FOREIGN KEY ([diaryPostId]) REFERENCES [dbo].[DiaryPost]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipMedia] ADD CONSTRAINT [TipMedia_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tip] ADD CONSTRAINT [Tip_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Country] ADD CONSTRAINT [Country_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[City] ADD CONSTRAINT [City_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipComment] ADD CONSTRAINT [TipComment_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipComment] ADD CONSTRAINT [TipComment_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CityVisit] ADD CONSTRAINT [CityVisit_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CityInterest] ADD CONSTRAINT [CityInterest_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
