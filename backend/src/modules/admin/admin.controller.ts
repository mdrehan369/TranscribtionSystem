import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { AdminService } from "./admin.service.js";
import { OVERVIEW_STATS } from "../../paths/admin.paths.js";
import { Role } from "../../types/auth.types.js";
import statusCodes from "../../utils/statusCodes.js";
import { statusMessages } from "../../utils/statusMessages.js";

const AdminController: FastifyPluginCallback = async (instance, opts) => {
  const fastify = instance as FastifyInstance & {
    adminService: AdminService
  }

  fastify.decorate("adminService", new AdminService(fastify.prisma))

  fastify.addHook("onRequest", async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.role !== Role.ADMIN || !req.user) return reply.status(statusCodes.UNAUTHORIZED).send({ success: false, message: statusMessages.auth.accessDenied })
  })

  fastify.get(OVERVIEW_STATS,
    { schema: { tags: ['Admin'] } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const response = await fastify.adminService.getOverviewStats(req.user!.id)
      return reply.status(response.code).send(response)
    }
  )
}

export default AdminController
