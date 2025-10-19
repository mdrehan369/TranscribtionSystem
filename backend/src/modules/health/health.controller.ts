import type { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { LIVE_CHECK, READY_CHECK } from "../../paths/health.paths.js";
import statusCodes from "../../utils/statusCodes.js";
import { statusMessages } from "../../utils/statusMessages.js";
import { checkDbHealth, checkExternalServiceHealth } from "../../utils/health.js";
import type { EnvConfig } from "../../config/env.config.js";

const HealthController: FastifyPluginCallback = async (fastify, opts) => {
  fastify.get(LIVE_CHECK, {}, async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.status(statusCodes.OK).send({
      success: true,
      message: statusMessages.health.live,
      status: "OK",
      uptime: process.uptime().toFixed(1),
      timestamp: new Date().toISOString()
    })
  })

  fastify.get(READY_CHECK, {}, async (req: FastifyRequest, reply: FastifyReply) => {

    const response = {
      status: "UP",
      success: true,
      message: statusMessages.health.ready,
      uptime: process.uptime().toFixed(1),
      timestamp: new Date().toISOString(),
      database: {},
      transcriber: {},
      frontend: {}
    }

    const transcriberHealthEndpoint = `${fastify.getEnvs<EnvConfig>().TRANSCRIBER_URL}/health/live`
    const frontendHealthEndpoint = `${fastify.getEnvs<EnvConfig>().FRONTEND_URL}/api/health/live`

    const databaseStatus = await checkDbHealth(fastify.prisma)
    const transcriberStatus = await checkExternalServiceHealth(transcriberHealthEndpoint)
    const frontendStatus = await checkExternalServiceHealth(frontendHealthEndpoint)

    if ([databaseStatus, frontendStatus, transcriberStatus].find(service => service.status !== "UP")) response.status = "DOWN"

    response.database = databaseStatus
    response.transcriber = transcriberStatus
    response.frontend = frontendStatus

    return reply.status(statusCodes.OK).send(response)
  })

}

export default HealthController
