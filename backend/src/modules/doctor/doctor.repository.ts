import bcrypt from "bcryptjs";
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

  async findBySlug(slug: string) {
    const doctor = await this.prisma.doctor.findFirst({
      where: { slug }
    })

    return doctor ? true : false
  }

  async addDoctor(data: AddDoctorBody & { slug: string; }, instituteId: MedicalInstitute['id']) {
    data['password'] = bcrypt.hashSync(data['password'])
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

  async listDoctor(page: number = 1, limit: number = 10, search: string = "") {
    return await this.prisma.doctor.findMany({
      where: {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ]
      },
      orderBy: {
        createdAt: "desc"
      },
      skip: (page - 1) * limit,
      take: limit
    })
  }

  async deleteDoctor(slug: string) {
    const response = await this.prisma.doctor.delete({
      where: { slug }
    })
    if (response) return true
    return false
  }

}


