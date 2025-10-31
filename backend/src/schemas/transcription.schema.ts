import type { FastifySchema } from "fastify";

export const CreateTranscriptionSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["patient"],
    properties: {
      patient: {
        type: "object",
        required: ["firstName", "phoneNumber", "lastName", "age"],
        properties: {
          phoneNumber: { type: "string", description: "Phone Number of the patient" },
          firstName: { type: "string", description: "First Name of the patient" },
          lastName: { type: "string", description: "Last Name of the patient" },
          age: { type: "number", description: "Age of the patient" },
        }
      },
      notes: { type: "string", description: "notes" }
    }
  },
  tags: ['Transcribe']
}
