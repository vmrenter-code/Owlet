/*
  Warnings:

  - Added the required column `screeningId` to the `VideoSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoSession" ADD COLUMN     "screeningId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "VideoSession" ADD CONSTRAINT "VideoSession_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "Screening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
