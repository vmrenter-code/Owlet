-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "reviewedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expoPushToken" TEXT;
