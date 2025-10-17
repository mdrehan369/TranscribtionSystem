import fp from "fastify-plugin"
import { prisma } from "../prisma/index.js"

export default fp((fastify, opts, done) => {
  fastify.decorate("prisma", prisma)
  done()
})

declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma
  }
}
