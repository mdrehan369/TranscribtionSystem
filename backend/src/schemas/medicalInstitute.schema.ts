import type { FastifySchema } from "fastify";

export const RegisterMedicalInstitueSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["name", "address", "contactNumber", "admin", "contactEmail"],
    properties: {
      name: { type: "string", minLength: 3 },
      address: { type: "string", minLength: 10 },
      contactNumber: { type: "string", pattern: "^[0-9]{10,15}$" },
      contactEmail: { type: "string", format: "email" },
      webhookUrl: { type: "string" },
      admin: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'phoneNumber', 'password'],
        properties: {
          phoneNumber: { type: "string", pattern: "^[0-9]{10,15}$" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
        }
      }
    },
    additionalProperties: false
  }
}
