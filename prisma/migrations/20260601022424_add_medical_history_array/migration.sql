/*
  Warnings:

  - The `medicalHistory` column on the `Child` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Child" DROP COLUMN "medicalHistory",
ADD COLUMN     "medicalHistory" TEXT[];
