
import type { PrismaClient } from "../../prisma/generated/prisma/index.js";

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

}
