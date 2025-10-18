-- DropForeignKey
ALTER TABLE "public"."Admin" DROP CONSTRAINT "Admin_medicalInstituteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Doctor" DROP CONSTRAINT "Doctor_medicalInstituteId_fkey";

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_medicalInstituteId_fkey" FOREIGN KEY ("medicalInstituteId") REFERENCES "MedicalInstitute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_medicalInstituteId_fkey" FOREIGN KEY ("medicalInstituteId") REFERENCES "MedicalInstitute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
