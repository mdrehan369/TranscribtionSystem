/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('ANESTHESIOLOGY', 'CARDIOLOGY', 'DERMATOLOGY', 'GENERAL', 'GASTROENTEROLOGY', 'NEUROLOGY', 'OBSTETRICS_GYNECOLOGY', 'ONCOLOGY', 'OPHTHALMOLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 'PSYCHIATRY', 'RADIOLOGY', 'SURGERY', 'UROLOGY');

-- CreateEnum
CREATE TYPE "DoctorType" AS ENUM ('INDIVIDUAL', 'CORPORATE');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "department" "Department" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "doctorType" "DoctorType" NOT NULL DEFAULT 'CORPORATE',
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MedicalInstitute" ALTER COLUMN "webhookUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "consultationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "age" INTEGER NOT NULL DEFAULT 18,
    "bloodGroup" "BloodGroup",
    "doctorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "transcript" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_slug_key" ON "Patient"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Consultation_slug_key" ON "Consultation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_slug_key" ON "Doctor"("slug");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
