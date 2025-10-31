import { FC } from "react"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { Input } from "../ui/input"

const FormInput: FC<{
  label: string,
  name: string,
  type?: string,
  placeholder: string,
  register: UseFormRegister<any>,
  errors?: FieldErrors<any>
}> = ({ label, name, type = "text", placeholder, register, errors }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <Input
      type={type || "text"}
      placeholder={placeholder}
      {...register(name)}
      className={errors?.[name] ? "border-red-500" : ""}
    />
    {errors?.[name] && <span className="text-xs text-red-500">{errors[name]?.message?.toString()}</span>}
  </div>
)

export default FormInput
