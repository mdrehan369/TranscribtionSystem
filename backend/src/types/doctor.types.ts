import type { Department, DoctorSpecialization, DoctorType } from "../prisma/generated/prisma/index.js";


export type AddDoctorBody = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
  specialization: DoctorSpecialization;
  department: Department;
  doctorType: DoctorType;
}
