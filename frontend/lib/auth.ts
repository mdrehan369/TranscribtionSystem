import { IAdmin } from "@/types/admin.types"
import { apiClient } from "./api-client"
import { IDoctor } from "@/types/doctor.types"
import { Role } from "@/types/auth.types"

export interface LoginRequest {
  phoneNumber: string
  password: string
  role: "doctor" | "admin"
}

export interface LoginResponse {
  success: boolean
  data: {
    user: IDoctor | IAdmin;
    role: Role
  }
}

export interface GetUserResponse {
  success: boolean
  data: {
    user: IAdmin | IDoctor | null;
    role: Role;
  }
}

export interface RegisterInstitutionRequest {
  name: string
  address: string
  contactNumber: string
  contactEmail: string
  webhookUrl?: string
  admin: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    password: string
  }
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/api/v1/auth/login", credentials)
  },

  async logout(): Promise<void> {
    await apiClient.get("/api/v1/auth/logout")
  },

  async getUser(): Promise<GetUserResponse | null> {
    try {
      const response = await apiClient.get("/api/v1/auth/")
      return response as GetUserResponse
    } catch (error) {
      console.log(error)
      return null
    }
  },

  async registerInstitution(data: RegisterInstitutionRequest): Promise<{ message: string }> {
    return apiClient.post("/api/v1/medical-institute/", data)
  },
}
