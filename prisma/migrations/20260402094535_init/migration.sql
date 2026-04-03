/*
  Warnings:

  - You are about to drop the column `screeningId` on the `VideoSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VideoSession" DROP CONSTRAINT "VideoSession_screeningId_fkey";

-- AlterTable
ALTER TABLE "VideoSession" DROP COLUMN "screeningId";
