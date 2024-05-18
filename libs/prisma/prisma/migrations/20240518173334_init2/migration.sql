-- AddForeignKey
ALTER TABLE "CompetitionUser" ADD CONSTRAINT "CompetitionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionUser" ADD CONSTRAINT "CompetitionUser_competitionUuid_fkey" FOREIGN KEY ("competitionUuid") REFERENCES "Competition"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenShortId" ADD CONSTRAINT "ScreenShortId_competitionUuid_fkey" FOREIGN KEY ("competitionUuid") REFERENCES "Competition"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
