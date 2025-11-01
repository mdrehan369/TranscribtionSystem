
import type { Admin, PrismaClient } from "../../prisma/generated/prisma/index.js";
import statusCodes from "../../utils/statusCodes.js";
import { statusMessages } from "../../utils/statusMessages.js";
import { AdminRepository } from "./admin.repository.js";

export class AdminService {
  private adminRepository: AdminRepository

  constructor(prisma: PrismaClient) {
    this.adminRepository = new AdminRepository(prisma)
  }

  async getOverviewStats(adminId: Admin['id']) {
    const doesExists = this.adminRepository.findById(adminId)
    if (!doesExists) return { success: false, code: statusCodes.NOT_FOUND, message: statusMessages.notFound }

    const data = await Promise.all([
      await this.adminRepository.getTotalDoctors(adminId),
      await this.adminRepository.getTotalConsultations(adminId),
      await this.adminRepository.getTotalPatients(adminId),
    ])

    const [doctors, consultations, patients] = data

    return { success: true, code: statusCodes.OK, message: statusMessages.success, data: { doctors, consultations, patients } }
  }

}

