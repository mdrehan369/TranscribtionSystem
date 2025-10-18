import type { PrismaClient } from "../../prisma/generated/prisma/index.js";
import type { RegisterNewMedicalInstituteBody } from "../../types/medicalInstitute.types.js";
import statusCodes from "../../utils/statusCodes.js";
import { AdminRepository } from "../admin/admin.repository.js";
import { MedicalInstituteRepository } from "./medicalInstitute.service.js";

export class MedicalInstituteService {
  private medicalInstituteRepository: MedicalInstituteRepository
  private adminRepository: AdminRepository

  constructor(prisma: PrismaClient) {
    this.medicalInstituteRepository = new MedicalInstituteRepository(prisma)
    this.adminRepository = new AdminRepository(prisma)
  }

  async registerNewMedicalInstitute(data: RegisterNewMedicalInstituteBody) {
    const doesExists = await this.medicalInstituteRepository.doesExists(data.name, data.contactEmail, data.contactNumber)
    if (doesExists) return { code: statusCodes.BAD_REQUEST, message: "Medical Institute Already Exists", success: false }

    const doesAdminExists = await this.adminRepository.doesExists(data.admin.email, data.admin.phoneNumber)
    if (doesAdminExists) return { code: statusCodes.BAD_REQUEST, message: "Admin Already Exists For Other Medical Institution", success: false }

    const newInstitute = await this.medicalInstituteRepository.registerMedicalInstitute(data)

    return { code: statusCodes.CREATED, data: newInstitute, success: true }
  }

}
