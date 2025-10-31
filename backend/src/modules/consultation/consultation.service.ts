import type { Consultation, PrismaClient } from "../../prisma/generated/prisma/index.js"
import type { AddConsultationBody } from "../../types/consultation.types.js"
import generateAlphanumeric from "../../utils/generateSlug.js"
import { PatientRepository } from "../patient/patient.repository.js"
import { ConsultationRepository } from "./consultation.repository.js"


export class ConsultationService {

  private consultationRepository: ConsultationRepository
  private patientRepository: PatientRepository

  constructor(prisma: PrismaClient) {
    this.consultationRepository = new ConsultationRepository(prisma)
    this.patientRepository = new PatientRepository(prisma)
  }

  async addConsultation(data: AddConsultationBody) {
    const { patient, notes, doctorId } = data
    let patientData = await this.patientRepository.doesPatientExists(patient.phoneNumber, doctorId)

    if (!patientData) {
      const slug = generateAlphanumeric(10)
      patientData = await this.patientRepository.createPatient(patient, slug, doctorId)
    }

    const slug = generateAlphanumeric(10)
    const newConsultation = await this.consultationRepository.addConsultation({ doctorId, notes, patientId: patientData.id, slug })

    return newConsultation
  }

  async addTranscript(consultationId: Consultation['id'], transcript: string) {
    const doesExists = await this.consultationRepository.consultationExists(consultationId)
    if (!doesExists) return false

    await this.consultationRepository.addTranscript({ consultationId, transcript })
    return true
  }

}

