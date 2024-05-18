-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'EDITOR', 'READER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionUser" (
    "role" "Role" NOT NULL DEFAULT 'READER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "competitionUuid" TEXT NOT NULL,

    CONSTRAINT "CompetitionUser_pkey" PRIMARY KEY ("userId","competitionUuid")
);

-- CreateTable
CREATE TABLE "Competition" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamCount" INTEGER NOT NULL,
    "playerCount" INTEGER NOT NULL DEFAULT 0,
    "cumulativeDuration" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isPublicShowcase" BOOLEAN NOT NULL DEFAULT false,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ScreenShortId" (
    "shortId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "competitionUuid" TEXT NOT NULL,
    "screenUuid" TEXT NOT NULL,

    CONSTRAINT "ScreenShortId_pkey" PRIMARY KEY ("shortId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CompetitionUser_competitionUuid_idx" ON "CompetitionUser"("competitionUuid");

-- CreateIndex
CREATE INDEX "CompetitionUser_userId_idx" ON "CompetitionUser"("userId");

-- CreateIndex
CREATE INDEX "ScreenShortId_competitionUuid_idx" ON "ScreenShortId"("competitionUuid");
