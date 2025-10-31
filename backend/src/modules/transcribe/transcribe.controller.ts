import type { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { pipeline } from "stream/promises";
import { UPLOAD_AUDIO_PATH } from "../../paths/transcriber.paths.js";
import path from "path";
import { v4 } from "uuid"
import axios from "axios"
import statusCodes from "../../utils/statusCodes.js";
import { statusMessages } from "../../utils/statusMessages.js";
import FormData from "form-data";
import { Role } from "../../types/auth.types.js";
import { MedicalInstituteRepository } from "../medicalInstitute/medicalInstitute.repository.js";
import { DoctorType } from "../../prisma/generated/prisma/index.js";
import { CreateTranscriptionSchema } from "../../schemas/transcription.schema.js";
import { ConsultationService } from "../consultation/consultation.service.js";
import type { CreatePatientBody } from "../../types/patient.types.js";

const TranscribeController: FastifyPluginCallback = async (fastify, opts) => {

  fastify.post(
    UPLOAD_AUDIO_PATH,
    { schema: CreateTranscriptionSchema },
    async function upload(req: FastifyRequest<{
      Body: {
        patient: CreatePatientBody;
        notes: string;
      }
    }>, reply: FastifyReply) {
      fastify.log.info("Request Incoming for file upload")
      if (!req.user || req.role === Role.ADMIN) return reply.status(statusCodes.UNAUTHORIZED).send({ message: statusMessages.unauthorized, success: false })

      const file = await req.file();
      const { notes, patient } = req.body

      fastify.log.info(file?.filename)

      if (!file) return reply.status(400).send({ success: false, message: "File not send!" })

      const filename = v4()
      const uploadPath = path.join(process.cwd(), "tmp", filename)

      await pipeline(file.file, fs.createWriteStream(uploadPath))

      try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(uploadPath), file.filename);
        const response = await axios.post(
          "http://localhost:8000/api/v1/transcribe",
          formData,
          { headers: formData.getHeaders(), maxBodyLength: Infinity }
        )
        if (!response.data.success) return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send({ success: false, message: statusMessages.internalServerError })

        const medicalInstituteRepo = new MedicalInstituteRepository(fastify.prisma)
        const medicalInstitute = await medicalInstituteRepo.getInstituteById(req.user.medicalInstituteId)
        if (!medicalInstitute) return reply.status(statusCodes.NOT_FOUND).send({ success: false, message: statusMessages.notFound })

        const consultationService = new ConsultationService(fastify.prisma)
        const consultation = await consultationService.addConsultation({ patient, notes, doctorId: req.user.id })

        if ("doctorType" in req.user && req.user.doctorType === DoctorType.CORPORATE) {
          const webhookResponse = await axios.post(medicalInstitute.webhookUrl!, response.data, { validateStatus: () => true })
          return reply.status(statusCodes.OK).send({ success: true, message: "File uploaded successfully", data: { webhookResponse: webhookResponse.data, consultation } });
        } else {
          await consultationService.addTranscript(consultation.id, response.data.data)
          return reply.status(statusCodes.OK).send({ success: true, message: "File uploaded successfully", data: { consultation } });
        }
      } catch (error) {
        return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send({ success: true, message: statusMessages.internalServerError });
      } finally {
        fs.unlinkSync(uploadPath)
      }
    }
  );

}

export default TranscribeController
