BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Admin] DROP CONSTRAINT [Admin_accountId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipWord] DROP CONSTRAINT [TipWord_tipId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_accountId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] DROP CONSTRAINT [UserSubscribesPlan_subscriptionPlanId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] DROP CONSTRAINT [UserSubscribesPlan_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[DiaryPostReport] ADD [reviewed] BIT NOT NULL CONSTRAINT [DiaryPostReport_reviewed_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[TipCommentReport] ADD [reviewed] BIT NOT NULL CONSTRAINT [TipCommentReport_reviewed_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[TipReport] ADD [reviewed] BIT NOT NULL CONSTRAINT [TipReport_reviewed_df] DEFAULT 0;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Admin] ADD CONSTRAINT [Admin_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] ADD CONSTRAINT [UserSubscribesPlan_subscriptionPlanId_fkey] FOREIGN KEY ([subscriptionPlanId]) REFERENCES [dbo].[SubscriptionPlan]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserSubscribesPlan] ADD CONSTRAINT [UserSubscribesPlan_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipWord] ADD CONSTRAINT [TipWord_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
