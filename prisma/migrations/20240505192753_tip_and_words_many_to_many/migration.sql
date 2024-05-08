/*
  Warnings:

  - You are about to drop the column `stateCode` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the `AccountDeactivation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[AccountDeactivation] DROP CONSTRAINT [AccountDeactivation_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CityInterest] DROP CONSTRAINT [CityInterest_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[CityVisit] DROP CONSTRAINT [CityVisit_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPost] DROP CONSTRAINT [DiaryPost_tripDiaryId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPost] DROP CONSTRAINT [DiaryPost_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DiaryPostLike] DROP CONSTRAINT [DiaryPostLike_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Follow] DROP CONSTRAINT [Follow_followerId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Follow] DROP CONSTRAINT [Follow_followingId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Tip] DROP CONSTRAINT [Tip_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipComment] DROP CONSTRAINT [TipComment_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipLike] DROP CONSTRAINT [TipLike_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TripDiary] DROP CONSTRAINT [TripDiary_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] DROP CONSTRAINT [UserSubscribesPlan_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Country] ADD [continentId] INT;

-- AlterTable
ALTER TABLE [dbo].[DiaryPost] ADD [softDelete] BIT NOT NULL CONSTRAINT [DiaryPost_softDelete_df] DEFAULT 0,
[status] NVARCHAR(1000) NOT NULL CONSTRAINT [DiaryPost_status_df] DEFAULT 'active';

-- AlterTable
ALTER TABLE [dbo].[Region] DROP COLUMN [stateCode],
[type];

-- AlterTable
ALTER TABLE [dbo].[Tip] ADD [softDelete] BIT NOT NULL CONSTRAINT [Tip_softDelete_df] DEFAULT 0,
[status] NVARCHAR(1000) NOT NULL CONSTRAINT [Tip_status_df] DEFAULT 'active';

-- AlterTable
ALTER TABLE [dbo].[TipComment] ADD [softDelete] BIT NOT NULL CONSTRAINT [TipComment_softDelete_df] DEFAULT 0,
[status] NVARCHAR(1000) NOT NULL CONSTRAINT [TipComment_status_df] DEFAULT 'active';

-- DropTable
DROP TABLE [dbo].[AccountDeactivation];

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [Account_active_df] DEFAULT 1,
    CONSTRAINT [Account_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Account_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Admin] (
    [id] INT NOT NULL,
    [accountId] INT NOT NULL,
    CONSTRAINT [Admin_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Admin_accountId_key] UNIQUE NONCLUSTERED ([accountId])
);

-- CreateTable
CREATE TABLE [dbo].[DiaryPostReport] (
    [id] INT NOT NULL IDENTITY(1,1),
    [diaryPostId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DiaryPostReport_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] INT NOT NULL,
    [reason] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DiaryPostReport_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DiaryPostReport_userId_diaryPostId_key] UNIQUE NONCLUSTERED ([userId],[diaryPostId])
);

-- CreateTable
CREATE TABLE [dbo].[TipReport] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TipReport_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [tipId] INT NOT NULL,
    [userId] INT NOT NULL,
    [reason] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [TipReport_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [TipReport_userId_tipId_key] UNIQUE NONCLUSTERED ([userId],[tipId])
);

-- CreateTable
CREATE TABLE [dbo].[TipCommentReport] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TipCommentReport_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [tipCommentId] INT NOT NULL,
    [userId] INT NOT NULL,
    [reason] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [TipCommentReport_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [TipCommentReport_userId_tipCommentId_key] UNIQUE NONCLUSTERED ([userId],[tipCommentId])
);

-- CreateTable
CREATE TABLE [dbo].[Continent] (
    [id] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Continent_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TipWordsOnTips] (
    [tipId] INT NOT NULL,
    [tipWordId] INT NOT NULL,
    CONSTRAINT [TipWordsOnTips_pkey] PRIMARY KEY CLUSTERED ([tipId],[tipWordId])
);

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_email_key];
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_username_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'User'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_User] (
    [id] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [username] NVARCHAR(1000) NOT NULL,
    [fullName] NVARCHAR(1000) NOT NULL,
    [birthdate] DATETIME2 NOT NULL,
    [image] NVARCHAR(1000),
    [emailVerified] BIT NOT NULL CONSTRAINT [User_emailVerified_df] DEFAULT 0,
    [bio] NVARCHAR(1000),
    [cityId] INT,
    [accountId] INT NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [User_accountId_key] UNIQUE NONCLUSTERED ([accountId])
);
IF EXISTS(SELECT * FROM [dbo].[User])
    EXEC('INSERT INTO [dbo].[_prisma_new_User] ([bio],[birthdate],[cityId],[createdAt],[emailVerified],[fullName],[id],[image],[username]) SELECT [bio],[birthdate],[cityId],[createdAt],[emailVerified],[fullName],[id],[image],[username] FROM [dbo].[User] WITH (holdlock tablockx)');
DROP TABLE [dbo].[User];
EXEC SP_RENAME N'dbo._prisma_new_User', N'User';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[Admin] ADD CONSTRAINT [Admin_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followerId_fkey] FOREIGN KEY ([followerId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followingId_fkey] FOREIGN KEY ([followingId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TripDiary] ADD CONSTRAINT [TripDiary_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPost] ADD CONSTRAINT [DiaryPost_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPost] ADD CONSTRAINT [DiaryPost_tripDiaryId_fkey] FOREIGN KEY ([tripDiaryId]) REFERENCES [dbo].[TripDiary]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostReport] ADD CONSTRAINT [DiaryPostReport_diaryPostId_fkey] FOREIGN KEY ([diaryPostId]) REFERENCES [dbo].[DiaryPost]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostReport] ADD CONSTRAINT [DiaryPostReport_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Tip] ADD CONSTRAINT [Tip_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipReport] ADD CONSTRAINT [TipReport_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipReport] ADD CONSTRAINT [TipReport_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipComment] ADD CONSTRAINT [TipComment_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipCommentReport] ADD CONSTRAINT [TipCommentReport_tipCommentId_fkey] FOREIGN KEY ([tipCommentId]) REFERENCES [dbo].[TipComment]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipCommentReport] ADD CONSTRAINT [TipCommentReport_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Country] ADD CONSTRAINT [Country_continentId_fkey] FOREIGN KEY ([continentId]) REFERENCES [dbo].[Continent]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CityVisit] ADD CONSTRAINT [CityVisit_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CityInterest] ADD CONSTRAINT [CityInterest_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] ADD CONSTRAINT [UserSubscribesPlan_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipWordsOnTips] ADD CONSTRAINT [TipWordsOnTips_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipWordsOnTips] ADD CONSTRAINT [TipWordsOnTips_tipWordId_fkey] FOREIGN KEY ([tipWordId]) REFERENCES [dbo].[TipWord]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
