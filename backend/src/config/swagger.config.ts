import type { SwaggerOptions } from "@fastify/swagger"
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui"
import type { FastifyRegisterOptions } from "fastify"

export const swaggerConfig: SwaggerOptions = {
  openapi: {
    info: {
      title: 'My Transcriber API',
      description: 'API documentation for transcriber',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    }
  },
}

export const swaggerUiConfig: FastifyRegisterOptions<FastifySwaggerUiOptions> = {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'none',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function(_request, _reply, next) { next() },
    preHandler: function(_request, _reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => { return swaggerObject },
  transformSpecificationClone: true
}
