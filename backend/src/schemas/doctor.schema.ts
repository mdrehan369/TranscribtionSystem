import type { FastifySchema } from "fastify";
import { Department, DoctorSpecialization, DoctorType } from "../prisma/generated/prisma/index.js";


export const AddDoctorSchema: FastifySchema = {
  tags: ['Doctor'],
  body: {
    required: ['firstName', 'lastName', 'specialization', 'phoneNumber', 'email', 'password', 'department', 'doctorType'],
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      specialization: { type: 'string', enum: Object.values(DoctorSpecialization), description: "Must be of the allowed values" },
      phoneNumber: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
      department: { type: 'string', enum: Object.values(Department), description: "Must be of the allowed values" },
      doctorType: { type: 'string', enum: Object.values(DoctorType), description: "Must be of the allowed values" }
    },
    additionalProperties: false
  }
};
