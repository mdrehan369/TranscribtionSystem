/*
  Warnings:

  - You are about to drop the column `medicalInsituteId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `medicalInsituteId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the `MedicalInsitute` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[medicalInstituteId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `medicalInstituteId` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalInstituteId` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_medicalInsituteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Doctor" DROP CONSTRAINT "Doctor_medicalInsituteId_fkey";

-- DropIndex
DROP INDEX "public"."Admin_medicalInsituteId_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "medicalInsituteId",
ADD COLUMN     "medicalInstituteId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "medicalInsituteId",
ADD COLUMN     "medicalInstituteId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."MedicalInsitute";

-- CreateTable
CREATE TABLE "MedicalInstitute" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "webhookUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalInstitute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicalInstitute_contactEmail_key" ON "MedicalInstitute"("contactEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_medicalInstituteId_key" ON "Admin"("medicalInstituteId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_medicalInstituteId_fkey" FOREIGN KEY ("medicalInstituteId") REFERENCES "MedicalInstitute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_medicalInstituteId_fkey" FOREIGN KEY ("medicalInstituteId") REFERENCES "MedicalInstitute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
