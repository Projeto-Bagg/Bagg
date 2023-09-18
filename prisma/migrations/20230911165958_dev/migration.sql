BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [displayName] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [birthdate] DATETIME2 NOT NULL,
    [image] NVARCHAR(1000),
    [emailVerified] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [password] NVARCHAR(1000) NOT NULL,
    [bio] NVARCHAR(1000),
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Follow] (
    [id] INT NOT NULL IDENTITY(1,1),
    [followerId] INT NOT NULL,
    [followingId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Follow_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Follow_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DiaryPost] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000),
    [message] NVARCHAR(1000),
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DiaryPost_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [DiaryPost_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TripDiary] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TripDiary_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [message] NVARCHAR(1000) NOT NULL,
    [diaryPostId] INT NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [TripDiary_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DiaryPostMedia] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DiaryPostMedia_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [url] NVARCHAR(1000) NOT NULL,
    [diaryPostId] INT NOT NULL,
    CONSTRAINT [DiaryPostMedia_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TipMedia] (
    [id] INT NOT NULL IDENTITY(1,1),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TipMedia_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [url] NVARCHAR(1000) NOT NULL,
    [tipId] INT NOT NULL,
    CONSTRAINT [TipMedia_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DiaryPostLike] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [postId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DiaryPostLike_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [tipId] INT NOT NULL,
    CONSTRAINT [DiaryPostLike_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TipLike] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [tipId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TipLike_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [TipLike_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Tip] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000),
    [message] NVARCHAR(1000),
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Tip_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Tip_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Country] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Country_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Region] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [countryId] INT NOT NULL,
    CONSTRAINT [Region_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[City] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [regionId] INT NOT NULL,
    CONSTRAINT [City_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TipComment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [tipId] INT NOT NULL,
    [message] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TipComment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [TipComment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [TipComment_userId_key] UNIQUE NONCLUSTERED ([userId]),
    CONSTRAINT [TipComment_tipId_key] UNIQUE NONCLUSTERED ([tipId])
);

-- CreateTable
CREATE TABLE [dbo].[CityVisit] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [cityId] INT NOT NULL,
    [rating] INT NOT NULL,
    [message] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [CityVisit_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CityInterest] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [cityId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CityInterest_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CityInterest_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followerId_fkey] FOREIGN KEY ([followerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followingId_fkey] FOREIGN KEY ([followingId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPost] ADD CONSTRAINT [DiaryPost_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TripDiary] ADD CONSTRAINT [TripDiary_diaryPostId_fkey] FOREIGN KEY ([diaryPostId]) REFERENCES [dbo].[DiaryPost]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TripDiary] ADD CONSTRAINT [TripDiary_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostMedia] ADD CONSTRAINT [DiaryPostMedia_diaryPostId_fkey] FOREIGN KEY ([diaryPostId]) REFERENCES [dbo].[DiaryPost]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipMedia] ADD CONSTRAINT [TipMedia_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_postId_fkey] FOREIGN KEY ([postId]) REFERENCES [dbo].[DiaryPost]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tip] ADD CONSTRAINT [Tip_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Region] ADD CONSTRAINT [Region_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[Country]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[City] ADD CONSTRAINT [City_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipComment] ADD CONSTRAINT [TipComment_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipComment] ADD CONSTRAINT [TipComment_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CityVisit] ADD CONSTRAINT [CityVisit_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CityVisit] ADD CONSTRAINT [CityVisit_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CityInterest] ADD CONSTRAINT [CityInterest_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CityInterest] ADD CONSTRAINT [CityInterest_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
