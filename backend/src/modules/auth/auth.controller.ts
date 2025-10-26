import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service.js";
import { GET_USER_PATH, LOGIN_PATH, LOGOUT_PATH } from "../../paths/auth.paths.js";
import { LoginSchema } from "../../schemas/auth.schema.js";
import type { LoginBody } from "../../types/auth.types.js";
import statusCodes from "../../utils/statusCodes.js";
import { statusMessages } from "../../utils/statusMessages.js";
import { AUTH_TOKEN, cookieOptions } from "../../utils/constants.js";


const AuthController: FastifyPluginCallback = async (instance, opts) => {

  const fastify = instance as FastifyInstance & {
    authService: AuthService
  }

  fastify.decorate("authService", new AuthService(fastify.prisma))

  fastify.post(LOGIN_PATH,
    { schema: LoginSchema },
    async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      if (req.user) return reply.status(statusCodes.BAD_REQUEST).send({ message: statusMessages.auth.alreadyLoggedIn, success: false })

      const { password, phoneNumber, role } = req.body
      const response = await fastify.authService.login(phoneNumber, password, role)

      if (response.success) {
        reply.setCookie(AUTH_TOKEN, response.token!, cookieOptions)
      }

      return reply.status(response.code).send(response)
    })

  fastify.get(LOGOUT_PATH,
    { schema: { tags: ['Auth'] } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      if (!req.user) return reply.status(statusCodes.BAD_REQUEST).send({ success: false, message: statusMessages.auth.notLoggedIn })
      reply.clearCookie(AUTH_TOKEN).status(statusCodes.OK).send({ success: true, message: statusMessages.auth.signedOutSuccessfully })
    })

  fastify.get(GET_USER_PATH,
    { schema: { tags: ['Auth'] } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      if (!req.user) return reply.status(statusCodes.BAD_REQUEST).send({ success: false, message: statusMessages.auth.tokenExpired })
      return reply.status(statusCodes.OK).send({ success: true, message: statusMessages.success, data: { user: req.user, role: req.role } })
    }
  )
}

export default AuthController
