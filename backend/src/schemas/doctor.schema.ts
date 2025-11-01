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

export const ListDoctorSchema: FastifySchema = {
  tags: ['Doctor'],
  querystring: {
    type: "object",
    required: [],
    properties: {
      page: { type: 'integer', minimum: 1 },
      limit: { type: 'integer', minimum: 10 },
      search: { type: 'string', default: "" }
    }
  }
}

export const DeleteDoctorSchema: FastifySchema = {
  tags: ['Doctor'],
  params: {
    type: "object",
    required: ['doctor_slug'],
    properties: {
      doctor_slug: { type: "string", description: "Slug of the doctor to delete" }
    }
  }
}
