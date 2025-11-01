
import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { DoctorService } from "./doctor.service.js";
import { ADD_DOCTOR, DELETE_DOCTOR, LIST_DOCTOR } from "../../paths/doctor.paths.js";
import { AddDoctorSchema, DeleteDoctorSchema, ListDoctorSchema } from "../../schemas/doctor.schema.js";
import type { AddDoctorBody } from "../../types/doctor.types.js";
import statusCodes from "../../utils/statusCodes.js";
import { Role } from "../../types/auth.types.js";
import { statusMessages } from "../../utils/statusMessages.js";

const DoctorController: FastifyPluginCallback = async (instance, opts) => {

  const fastify = instance as FastifyInstance & {
    doctorService: DoctorService
  }

  fastify.decorate("doctorService", new DoctorService(instance.prisma))

  fastify.post(ADD_DOCTOR,
    { schema: AddDoctorSchema },
    async (req: FastifyRequest<{ Body: AddDoctorBody }>, reply: FastifyReply) => {
      if (!req.user || req.role === Role.DOCTOR) return reply.status(statusCodes.UNAUTHORIZED).send({ success: false, message: statusMessages.unauthorized })
      const response = await fastify.doctorService.addDoctor(req.body, req.user.medicalInstituteId)
      return reply.status(response.code).send(response)
    })

  fastify.get(LIST_DOCTOR,
    { schema: ListDoctorSchema },
    async (req: FastifyRequest<{ Querystring: { page?: number; limit?: number; search?: string } }>, reply: FastifyReply) => {
      if (!req.user || req.role === Role.DOCTOR) return reply.status(statusCodes.UNAUTHORIZED).send({ success: false, message: statusMessages.unauthorized })
      const { page, limit, search } = req.query
      const response = await fastify.doctorService.listDoctor(page, limit, search)
      return reply.status(response.code).send(response)
    }
  )

  fastify.delete(DELETE_DOCTOR,
    { schema: DeleteDoctorSchema },
    async (req: FastifyRequest<{ Params: { doctor_slug: string } }>, reply: FastifyReply) => {
      if (!req.user || req.role === Role.DOCTOR) return reply.status(statusCodes.UNAUTHORIZED).send({ success: false, message: statusMessages.unauthorized })
      const response = await fastify.doctorService.deleteDoctor(req.params.doctor_slug)
      return reply.status(response.code).send(response)
    }
  )
}

export default DoctorController
