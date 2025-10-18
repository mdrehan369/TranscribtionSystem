import type { Role } from "../types/auth.types.js";
import jwt from "jsonwebtoken"

function generateAccessToken({ id, role }: { id: string, role: Role }) {
  const key = process.env.JWT_SECRET_KEY || "secret"
  const token = jwt.sign(
    { id, role },
    key,
    {
      expiresIn: "1d"
    }
  )

  return token
}

export default generateAccessToken
