import type { PrismaClient } from "../../prisma/generated/prisma/index.js";
import { Role } from "../../types/auth.types.js";

export class AuthRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async getUserByPhoneNumber(phoneNumber: string, role: Role) {
    let user = null
    if (role == Role.ADMIN)
      user = await this.prisma.admin.findFirst({
        where: {
          phoneNumber
        }
      })
    else
      user = await this.prisma.doctor.findFirst({
        where: {
          phoneNumber
        }
      })

    return user
  }
}
