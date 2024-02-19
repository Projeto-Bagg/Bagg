BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Region] DROP CONSTRAINT [Region_name_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
