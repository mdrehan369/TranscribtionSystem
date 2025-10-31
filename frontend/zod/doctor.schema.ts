import { Department, DoctorSpecialization, DoctorType } from '@/types/doctor.types'
import { z } from 'zod'

export const addDoctorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string({ required_error: "Phone number is required" }).min(10, "Phone number must be at least 10 digits"),
  specialization: z.nativeEnum(DoctorSpecialization, {
    errorMap: () => ({ message: "Invalid specialization" }),
  }),
  department: z.nativeEnum(Department, {
    errorMap: () => ({ message: "Invalid department" }),
  }),
  password: z.string().min(4, "Password must be at least 4 characters long"),
  doctorType: z.nativeEnum(DoctorType, {
    errorMap: () => ({ message: "Invalid type" })
  })
})
