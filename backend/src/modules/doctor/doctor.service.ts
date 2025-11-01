import type { MedicalInstitute, PrismaClient } from "../../prisma/generated/prisma/index.js";
import type { AddDoctorBody } from "../../types/doctor.types.js";
import generateAlphanumeric from "../../utils/generateSlug.js";
import statusCodes from "../../utils/statusCodes.js";
import { statusMessages } from "../../utils/statusMessages.js";
import { MedicalInstituteRepository } from "../medicalInstitute/medicalInstitute.repository.js";
import { DoctorRepository } from "./doctor.repository.js";

export class DoctorService {
  private doctorRepository: DoctorRepository
  private medicalInstituteRepository: MedicalInstituteRepository

  constructor(prisma: PrismaClient) {
    this.doctorRepository = new DoctorRepository(prisma)
    this.medicalInstituteRepository = new MedicalInstituteRepository(prisma)
  }

  async addDoctor(data: AddDoctorBody, instituteId: MedicalInstitute['id']) {
    const doesExists = await this.doctorRepository.doesExists(data.phoneNumber)
    if (doesExists) return { success: false, message: statusMessages.doctor.alreadyExists, code: statusCodes.BAD_REQUEST }

    const doesInstituteExists = await this.medicalInstituteRepository.getInstituteById(Number(instituteId))
    if (!doesInstituteExists) return { success: false, message: statusMessages.doctor.noInstitute, code: statusCodes.BAD_REQUEST }

    const slug = generateAlphanumeric(10)

    const newDoctor = await this.doctorRepository.addDoctor({ ...data, slug }, instituteId)
    return { success: true, message: statusMessages.success, code: statusCodes.CREATED, data: newDoctor }
  }

  async listDoctor(page: number = 1, limit: number = 10, search: string = "") {
    const data = await this.doctorRepository.listDoctor(page, limit, search)
    return { success: true, message: statusMessages.success, code: statusCodes.OK, data }
  }

  async deleteDoctor(slug: string) {
    const doesExists = await this.doctorRepository.findBySlug(slug)
    if (!doesExists) return { success: false, message: statusMessages.notFound, code: statusCodes.NOT_FOUND }
    await this.doctorRepository.deleteDoctor(slug)
    return { success: true, message: statusMessages.success, code: statusCodes.OK }
  }
}

