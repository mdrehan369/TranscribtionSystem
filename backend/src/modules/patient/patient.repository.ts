import type { Doctor, DoctorType, Prisma, PrismaClient } from "../../prisma/generated/prisma/index.js"
import type { CreatePatientBody } from "../../types/patient.types.js"

export class PatientRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async doesPatientExists(phoneNumber: string, doctorId: Doctor['id']) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        AND: [
          { phoneNumber },
          { doctorId }
        ]
      }
    })

    return patient
  }

  async createPatient(data: CreatePatientBody, slug: string, doctorId: Doctor['id']) {
    return await this.prisma.patient.create({
      data: {
        ...data,
        slug,
        doctorId
      }
    })
  }

}


