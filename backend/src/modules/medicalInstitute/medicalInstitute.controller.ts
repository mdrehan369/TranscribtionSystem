import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { MedicalInstituteService } from "./medicalInstitute.service.js";
import { REGISTER_NEW_MEDICAL_INSTITUTE } from "../../paths/medicalInstitute.paths.js";
import { RegisterMedicalInstitueSchema } from "../../schemas/medicalInstitute.schema.js";
import type { RegisterNewMedicalInstituteBody } from "../../types/medicalInstitute.types.js";
import { AuthService } from "../auth/auth.service.js";
import { Role } from "../../types/auth.types.js";
import { AUTH_TOKEN, cookieOptions } from "../../utils/constants.js";

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

      if (response.success) {
        const authService = new AuthService(fastify.prisma)
        const admin = response.data!.admin!
        const { success, token } = await authService.login(admin.phoneNumber, admin?.password, Role.ADMIN)
        if (success) reply.setCookie(AUTH_TOKEN, token!, cookieOptions)
      }

      return reply.status(response.code).send(response)
    })
}

export default MedicalInstituteController
