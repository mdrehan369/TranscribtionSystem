import { IAdmin } from "@/types/admin.types";
import { Role } from "@/types/auth.types";
import { IDoctor } from "@/types/doctor.types";
import { createSlice } from "@reduxjs/toolkit"

interface IUserSlice {
  auth: boolean;
  user: IDoctor | IAdmin | null;
  role: Role
}

const initialState: IUserSlice = {
  auth: false,
  user: null,
  role: Role.DOCTOR
}

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    login: (state, action: { payload: { user: IDoctor | IAdmin, role: Role } }) => {
      state.auth = true
      state.user = action.payload.user
      state.role = action.payload.role

    },
    logout: (state) => {
      state.auth = false
      state.user = null
    }
  }
})


export default userSlice.reducer
export const { login, logout } = userSlice.actions
