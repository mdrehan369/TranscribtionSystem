import type { PrismaClient } from "../../prisma/generated/prisma/index.js";

export class DoctorRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }
}


