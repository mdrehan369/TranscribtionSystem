import type { MedicalInstitute, PrismaClient } from "../../prisma/generated/prisma/index.js";
import type { AddDoctorBody } from "../../types/doctor.types.js";

export class DoctorRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async doesExists(phoneNumber: string) {
    const doctor = await this.prisma.doctor.findFirst({
      where: { phoneNumber }
    })

    return doctor ? true : false
  }

  async addDoctor(data: AddDoctorBody, instituteId: MedicalInstitute['id']) {
    const newDoctor = await this.prisma.doctor.create({
      data: {
        ...data,
        medicalInstituteId: instituteId
      },
      omit: {
        password: true
      }
    })

    return newDoctor
  }

}


