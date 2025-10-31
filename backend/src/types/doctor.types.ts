import type { Department, DoctorType } from "../prisma/generated/prisma/index.js";


export type AddDoctorBody = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  department: Department;
  doctorType: DoctorType;
}
