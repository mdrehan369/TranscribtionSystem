import type { PrismaClient } from "../../prisma/generated/prisma/index.js";
import type { Role } from "../../types/auth.types.js";
import generateAccessToken from "../../utils/generateAccessToken.js";
import statusCodes from "../../utils/statusCodes.js";
import { statusMessages } from "../../utils/statusMessages.js";
import { AuthRepository } from "./auth.repository.js";
import bcrypt from "bcryptjs";

export class AuthService {
  private authRepository: AuthRepository

  constructor(prisma: PrismaClient) {
    this.authRepository = new AuthRepository(prisma)
  }

  async login(phoneNumber: string, password: string, role: Role) {

    const user = await this.authRepository.getUserByPhoneNumber(phoneNumber, role)
    if (!user) return { code: statusCodes.NOT_FOUND, message: statusMessages.notFound, success: false }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    if (!isPasswordCorrect) return { success: false, code: statusCodes.UNAUTHORIZED, message: statusMessages.auth.invalidCredentials }

    const token = generateAccessToken({
      id: user.id.toString(),
      role
    })

    return { success: true, message: statusMessages.auth.signedInSuccessfully, token, data: user, code: statusCodes.OK }
  }
}
