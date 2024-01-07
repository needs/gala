-- CreateIndex
CREATE INDEX `CompetitionUser_competition_uuid_idx` ON `CompetitionUser`(`competition_uuid`);

-- CreateIndex
CREATE INDEX `CompetitionUser_user_id_idx` ON `CompetitionUser`(`user_id`);

-- CreateIndex
CREATE INDEX `ScreenShortId_competition_uuid_idx` ON `ScreenShortId`(`competition_uuid`);
