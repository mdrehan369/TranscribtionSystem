import type { FastifySchema } from "fastify";


export const LoginSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['phoneNumber', 'password', 'role'],
    properties: {
      phoneNumber: { type: 'string' },
      password: { type: 'string', minLength: 2 },
      role: { type: 'string', enum: ['doctor', 'admin'] }
    },
    additionalProperties: false
  },
}
