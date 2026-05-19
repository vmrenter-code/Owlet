-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Screening" ADD CONSTRAINT "Screening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
