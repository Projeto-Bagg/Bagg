BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Country] DROP CONSTRAINT [Country_continentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Region] DROP CONSTRAINT [Region_countryId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_accountId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_cityId_fkey];

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[Account]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Country] ADD CONSTRAINT [Country_continentId_fkey] FOREIGN KEY ([continentId]) REFERENCES [dbo].[Continent]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Region] ADD CONSTRAINT [Region_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[Country]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
