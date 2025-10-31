/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `MedicalInstitute` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `MedicalInstitute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MedicalInstitute" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_slug_key" ON "Admin"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalInstitute_slug_key" ON "MedicalInstitute"("slug");
