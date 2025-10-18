import type { Prisma, PrismaClient } from "../../prisma/generated/prisma/index.js";
import type { RegisterNewMedicalInstituteBody } from "../../types/medicalInstitute.types.js";

export class MedicalInstituteRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async doesExists(name: string, contactEmail: string, contactNumber: string) {
    const institute = await this.prisma.medicalInstitute.findFirst({
      where: {
        OR: [
          { name },
          { contactEmail },
          { contactNumber }
        ]
      }
    })

    return institute ? true : false
  }

  async registerMedicalInstitute({
    address,
    contactEmail,
    contactNumber,
    name,
    webhookUrl,
    admin
  }: RegisterNewMedicalInstituteBody) {
    const newInstitute = await this.prisma.medicalInstitute.create({
      data: {
        address,
        name,
        contactEmail,
        contactNumber,
        webhookUrl,
        admin: {
          create: admin
        }
      }
    })

    return newInstitute
  }

}
