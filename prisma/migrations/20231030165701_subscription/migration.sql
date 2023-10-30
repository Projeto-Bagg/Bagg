/*
  Warnings:

  - You are about to drop the column `countryId` on the `City` table. All the data in the column will be lost.
  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `countryId` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[City] DROP CONSTRAINT [City_countryId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Country] DROP CONSTRAINT [Country_regionId_fkey];

-- AlterTable
ALTER TABLE [dbo].[City] DROP COLUMN [countryId];

-- AlterTable
ALTER TABLE [dbo].[Region] ADD [countryId] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[State];

-- CreateTable
CREATE TABLE [dbo].[SubscriptionPlan] (
    [id] INT NOT NULL IDENTITY(1,1),
    [planName] NVARCHAR(1000) NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SubscriptionPlan_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [SubscriptionPlan_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SubscriptionPlan_planName_key] UNIQUE NONCLUSTERED ([planName])
);

-- CreateTable
CREATE TABLE [dbo].[UserSubscribesPlan] (
    [id] INT NOT NULL IDENTITY(1,1),
    [subscriptionDate] DATETIME2 NOT NULL CONSTRAINT [UserSubscribesPlan_subscriptionDate_df] DEFAULT CURRENT_TIMESTAMP,
    [subscriptionPlanId] INT NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [UserSubscribesPlan_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AccountDeactivation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [requestDate] DATETIME2 NOT NULL CONSTRAINT [AccountDeactivation_requestDate_df] DEFAULT CURRENT_TIMESTAMP,
    [reason] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [AccountDeactivation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Region] ADD CONSTRAINT [Region_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[Country]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] ADD CONSTRAINT [UserSubscribesPlan_subscriptionPlanId_fkey] FOREIGN KEY ([subscriptionPlanId]) REFERENCES [dbo].[SubscriptionPlan]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] ADD CONSTRAINT [UserSubscribesPlan_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AccountDeactivation] ADD CONSTRAINT [AccountDeactivation_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
