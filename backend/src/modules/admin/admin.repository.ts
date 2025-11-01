
import type { Admin, PrismaClient } from "../../prisma/generated/prisma/index.js";

export class AdminRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async doesExists(contactEmail: string, contactNumber: string) {
    const admin = await this.prisma.admin.findFirst({
      where: {
        OR: [
          { email: contactEmail },
          { phoneNumber: contactNumber }
        ]
      }
    })

    return admin ? true : false
  }

  async findById(id: Admin['id']) {
    const admin = await this.prisma.admin.findFirst({
      where: {
        id
      }
    })

    return admin ? true : false
  }

  async getTotalDoctors(adminId: Admin['id']) {
    return await this.prisma.doctor.count({
      where: {
        medicalInstitute: {
          admin: {
            id: adminId
          }
        }
      }
    })
  }

  async getTotalConsultations(adminId: Admin['id']) {
    return await this.prisma.consultation.count({
      where: {
        doctor: {
          medicalInstitute: {
            admin: {
              id: adminId
            }
          }
        }
      }
    })
  }

  async getTotalPatients(adminId: Admin['id']) {
    return await this.prisma.patient.count({
      where: {
        doctor: {
          medicalInstitute: {
            admin: {
              id: adminId
            }
          }
        }
      }
    })
  }

}
