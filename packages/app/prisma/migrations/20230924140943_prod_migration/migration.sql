-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'EDITOR', 'READER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionUser" (
    "role" "Role" NOT NULL DEFAULT 'READER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "competition_uuid" TEXT NOT NULL,

    CONSTRAINT "CompetitionUser_pkey" PRIMARY KEY ("user_id","competition_uuid")
);

-- CreateTable
CREATE TABLE "Competition" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teamCount" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ScreenShortId" (
    "short_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "competition_uuid" TEXT NOT NULL,
    "screen_uuid" TEXT NOT NULL,

    CONSTRAINT "ScreenShortId_pkey" PRIMARY KEY ("short_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "CompetitionUser" ADD CONSTRAINT "CompetitionUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionUser" ADD CONSTRAINT "CompetitionUser_competition_uuid_fkey" FOREIGN KEY ("competition_uuid") REFERENCES "Competition"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScreenShortId" ADD CONSTRAINT "ScreenShortId_competition_uuid_fkey" FOREIGN KEY ("competition_uuid") REFERENCES "Competition"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
