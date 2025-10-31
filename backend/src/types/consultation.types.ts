import type { Doctor } from "../prisma/generated/prisma/index.js";
import type { CreatePatientBody } from "./patient.types.js";

export type AddConsultationBody = {
  patient: CreatePatientBody;
  notes: string;
  doctorId: Doctor['id'];
}
