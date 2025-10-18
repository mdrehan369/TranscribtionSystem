import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { MedicalInstituteService } from "./medicalInstitute.repository.js";
import { REGISTER_NEW_MEDICAL_INSTITUTE } from "../../paths/medicalInstitute.paths.js";
import { RegisterMedicalInstitueSchema } from "../../schemas/medicalInstitute.schema.js";
import type { RegisterNewMedicalInstituteBody } from "../../types/medicalInstitute.types.js";

const MedicalInstituteController: FastifyPluginCallback = async (instance, opts) => {

  const fastify = instance as FastifyInstance & {
    medicalInstituteService: MedicalInstituteService
  }

  fastify.decorate("medicalInstituteService", new MedicalInstituteService(instance.prisma))

  fastify.post(REGISTER_NEW_MEDICAL_INSTITUTE,
    { schema: RegisterMedicalInstitueSchema },
    async (req: FastifyRequest<{
      Body: RegisterNewMedicalInstituteBody
    }>, reply: FastifyReply) => {
      const response = await fastify.medicalInstituteService.registerNewMedicalInstitute(req.body)
      return reply.status(response.code).send(response)
    })
}

export default MedicalInstituteController
