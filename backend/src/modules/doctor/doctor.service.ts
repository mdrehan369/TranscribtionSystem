import type { PrismaClient } from "../../prisma/generated/prisma/index.js";
import { DoctorRepository } from "./doctor.repository.js";

export class DoctorService {
  private doctorRepository: DoctorRepository

  constructor(prisma: PrismaClient) {
    this.doctorRepository = new DoctorRepository(prisma)
  }
}

