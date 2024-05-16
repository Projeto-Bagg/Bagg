/*
  Warnings:

  - You are about to drop the `SubscriptionPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSubscribesPlan` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] DROP CONSTRAINT [UserSubscribesPlan_subscriptionPlanId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] DROP CONSTRAINT [UserSubscribesPlan_userId_fkey];

-- DropTable
DROP TABLE [dbo].[SubscriptionPlan];

-- DropTable
DROP TABLE [dbo].[UserSubscribesPlan];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
