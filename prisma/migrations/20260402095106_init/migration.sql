/*
  Warnings:

  - Added the required column `videoNumber` to the `VideoSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoSession" ADD COLUMN     "videoNumber" INTEGER NOT NULL;
