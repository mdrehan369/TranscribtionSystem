
import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { DoctorService } from "./doctor.service.js";

const DoctorController: FastifyPluginCallback = async (instance, opts) => {

  const fastify = instance as FastifyInstance & {
    doctorService: DoctorService
  }

  fastify.decorate("doctorService", new DoctorService(instance.prisma))
}

export default DoctorController
