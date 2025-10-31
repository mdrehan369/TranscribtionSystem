/*
  Warnings:

  - Changed the type of `specialization` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DoctorSpecialization" AS ENUM ('GENERAL_MEDICINE', 'INTERNAL_MEDICINE', 'ORTHOPAEDICS', 'PAEDIATRICS', 'CARDIOLOGY', 'NEUROLOGY', 'GASTROENTEROLOGY', 'OPHTHALMOLOGY', 'ENT', 'DERMATOLOGY', 'GYNAECOLOGY_OBSTETRICS', 'RADIOLOGY', 'ANESTHESIOLOGY', 'PSYCHIATRY');

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "specialization",
ADD COLUMN     "specialization" "DoctorSpecialization" NOT NULL;
