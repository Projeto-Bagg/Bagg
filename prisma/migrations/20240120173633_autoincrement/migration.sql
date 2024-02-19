BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fullName] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [birthdate] DATETIME2 NOT NULL,
    [image] NVARCHAR(1000),
    [emailVerified] BIT NOT NULL CONSTRAINT [User_emailVerified_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [password] NVARCHAR(1000) NOT NULL,
    [bio] NVARCHAR(1000),
    [cityId] INT,
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
    CONSTRAINT [Follow_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Follow_followerId_followingId_key] UNIQUE NONCLUSTERED ([followerId],[followingId])
);

-- CreateTable
CREATE TABLE [dbo].[TripDiary] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TripDiary_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [message] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [TripDiary_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DiaryPost] (
    [id] INT NOT NULL IDENTITY(1,1),
    [message] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DiaryPost_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] INT NOT NULL,
    [tripDiaryId] INT NOT NULL,
    CONSTRAINT [DiaryPost_pkey] PRIMARY KEY CLUSTERED ([id])
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
CREATE TABLE [dbo].[DiaryPostLike] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [diaryPostId] INT NOT NULL,
    [createdAt] DATETIME2 CONSTRAINT [DiaryPostLike_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [DiaryPostLike_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DiaryPostLike_userId_diaryPostId_key] UNIQUE NONCLUSTERED ([userId],[diaryPostId])
);

-- CreateTable
CREATE TABLE [dbo].[Tip] (
    [id] INT NOT NULL IDENTITY(1,1),
    [message] NVARCHAR(1000),
    [userId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Tip_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [cityId] INT NOT NULL,
    CONSTRAINT [Tip_pkey] PRIMARY KEY CLUSTERED ([id])
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
CREATE TABLE [dbo].[TipLike] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [tipId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TipLike_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [TipLike_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [TipLike_userId_tipId_key] UNIQUE NONCLUSTERED ([userId],[tipId])
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
CREATE TABLE [dbo].[Country] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [iso2] NVARCHAR(1000) NOT NULL,
    [capital] NVARCHAR(1000) NOT NULL,
    [latitude] FLOAT(53) NOT NULL,
    [longitude] FLOAT(53) NOT NULL,
    [regionId] INT,
    CONSTRAINT [Country_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Country_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [Country_iso2_key] UNIQUE NONCLUSTERED ([iso2])
);

-- CreateTable
CREATE TABLE [dbo].[Region] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [countryId] INT NOT NULL,
    [latitude] FLOAT(53) NOT NULL,
    [longitude] FLOAT(53) NOT NULL,
    CONSTRAINT [Region_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Region_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[City] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [regionId] INT NOT NULL,
    [latitude] FLOAT(53) NOT NULL,
    [longitude] FLOAT(53) NOT NULL,
    CONSTRAINT [City_pkey] PRIMARY KEY CLUSTERED ([id])
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
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followerId_fkey] FOREIGN KEY ([followerId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Follow] ADD CONSTRAINT [Follow_followingId_fkey] FOREIGN KEY ([followingId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TripDiary] ADD CONSTRAINT [TripDiary_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPost] ADD CONSTRAINT [DiaryPost_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPost] ADD CONSTRAINT [DiaryPost_tripDiaryId_fkey] FOREIGN KEY ([tripDiaryId]) REFERENCES [dbo].[TripDiary]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostMedia] ADD CONSTRAINT [DiaryPostMedia_diaryPostId_fkey] FOREIGN KEY ([diaryPostId]) REFERENCES [dbo].[DiaryPost]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DiaryPostLike] ADD CONSTRAINT [DiaryPostLike_diaryPostId_fkey] FOREIGN KEY ([diaryPostId]) REFERENCES [dbo].[DiaryPost]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tip] ADD CONSTRAINT [Tip_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tip] ADD CONSTRAINT [Tip_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipMedia] ADD CONSTRAINT [TipMedia_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipLike] ADD CONSTRAINT [TipLike_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TipComment] ADD CONSTRAINT [TipComment_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TipComment] ADD CONSTRAINT [TipComment_tipId_fkey] FOREIGN KEY ([tipId]) REFERENCES [dbo].[Tip]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Region] ADD CONSTRAINT [Region_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[Country]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[City] ADD CONSTRAINT [City_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CityVisit] ADD CONSTRAINT [CityVisit_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CityVisit] ADD CONSTRAINT [CityVisit_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CityInterest] ADD CONSTRAINT [CityInterest_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CityInterest] ADD CONSTRAINT [CityInterest_cityId_fkey] FOREIGN KEY ([cityId]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
