export type JwtToken = {
  id: string;
  role: Role
}

export enum Role {
  ADMIN = 'admin',
  DOCTOR = 'doctor'
}

export type LoginBody = {
  phoneNumber: string;
  password: string;
  role: Role
}
