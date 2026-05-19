-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessibility" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en';
