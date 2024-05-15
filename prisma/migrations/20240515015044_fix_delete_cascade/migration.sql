BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[TipCommentReport] DROP CONSTRAINT [TipCommentReport_tipCommentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipReport] DROP CONSTRAINT [TipReport_tipId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TipReport] DROP CONSTRAINT [TipReport_userId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[TipReport] ADD CONSTRAINT [TipReport_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipReport] ADD CONSTRAINT [TipReport_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipCommentReport] ADD CONSTRAINT [TipCommentReport_tipCommentId_fkey] FOREIGN KEY ([tipCommentId]) REFERENCES [dbo].[TipComment]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
