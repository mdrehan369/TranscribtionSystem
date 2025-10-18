import type { FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import type { Admin, Doctor } from "../prisma/generated/prisma/index.js"
import jwt from "jsonwebtoken"
import type { JwtToken } from "../types/auth.types.js"

export default fp(async (fastify, opts) => {

  fastify.addHook("onRequest", async (req: FastifyRequest, reply: FastifyReply) => {

    const token = req.cookies.auth_token
    if (token) {
      const decodedToken = jwt.decode(token) as JwtToken
      let user = null
      if (decodedToken) {
        if (decodedToken.role === "doctor")
          user = await fastify.prisma.doctor.findFirst({
            where: {
              id: Number(decodedToken.id)
            }
          })
        else
          user = await fastify.prisma.admin.findFirst({
            where: {
              id: Number(decodedToken.id)
            }
          })

        if (!user) fastify.log.error("Invalid Token! No User Found")

        fastify.decorate("user", user)
        fastify.decorate("role", decodedToken.role)

        fastify.log.info(`Authorized Request Coming From ${user!.id}`)
      }
    } else {
      fastify.log.info("Unauthorized Request Incoming!")
    }
  })

})

declare module "fastify" {
  interface FastifyRequest {
    user?: Doctor | Admin,
    role: "doctor" | "admin"
  }
}
