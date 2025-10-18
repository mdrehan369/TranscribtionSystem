import type { FastifySchema } from "fastify";


export const AddDoctorSchema: FastifySchema = {
  body: {
    required: ['firstName', 'lastName', 'specialization', 'phoneNumber', 'email', 'password'],
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      specialization: { type: 'string' },
      phoneNumber: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    additionalProperties: false
  }
};
