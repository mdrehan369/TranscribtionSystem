import type { Consultation, Doctor, Patient, PrismaClient } from "../../prisma/generated/prisma/index.js"

export class ConsultationRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async addConsultation(data: { patientId: Patient['id']; slug: string; doctorId: Doctor['id'], notes: string }) {
    const { doctorId, notes, patientId, slug } = data
    return await this.prisma.consultation.create({
      data: {
        notes,
        slug,
        doctorId,
        patientId
      }
    })
  }

  async consultationExists(consultationId: Consultation['id']) {
    return await this.prisma.consultation.findFirst({
      where: { id: consultationId }
    })
  }

  async addTranscript(data: { consultationId: Consultation['id']; transcript: string; }) {

    const { consultationId, transcript } = data
    return await this.prisma.consultation.update({
      where: { id: consultationId },
      data: {
        transcript
      }
    })
  }

}


