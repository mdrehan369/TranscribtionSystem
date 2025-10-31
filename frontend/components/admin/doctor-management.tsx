"use client"

import type React from "react"
import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { zodResolver } from "@hookform/resolvers/zod"

import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { addDoctorSchema } from "@/zod/doctor.schema"
import { Department, DoctorSpecialization, DoctorType, IDoctor } from "@/types/doctor.types"
import FormInput from "../form/FormInput"
import FormCombobox from "../form/FormCombobox"
import FormRadioGroup from "../form/FormRadioGroup"


export function DoctorManagement() {
  const [showAddForm, setShowAddForm] = useState(false)

  const { register, handleSubmit, formState, control } = useForm<z.infer<typeof addDoctorSchema>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      specialization: DoctorSpecialization.CARDIOLOGY,
      department: Department.ANESTHESIOLOGY,
      password: "",
      doctorType: DoctorType.CORPORATE
    },
    resolver: zodResolver(addDoctorSchema),
  })

  const { data: doctors = [], refetch } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => apiClient.get<IDoctor[]>("/api/v1/doctor/"),
  })

  const addDoctorMutation = useMutation({
    mutationFn: (data: z.infer<typeof addDoctorSchema>) => apiClient.post("/api/v1/doctor/", data),
    onSuccess: () => {
      setShowAddForm(false)
      refetch()
    },
    onError: (error: Error) => {
      alert(`Error adding doctor: ${error.message}`)
    },
  })

  const deleteDoctorMutation = useMutation({
    mutationFn: (doctorId: number) => apiClient.post(`/api/v1/doctor/${doctorId}/delete`, {}),
    onSuccess: () => {
      refetch()
    },
    onError: (error: Error) => {
      alert(`Error deleting doctor: ${error.message}`)
    },
  })

  const onSubmit = (data: z.infer<typeof addDoctorSchema>) => {
    console.log(data)
    addDoctorMutation.mutate(data)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Doctors</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "Cancel" : "Add Doctor"}</Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="First Name" name="firstName" placeholder="First name" register={register} errors={formState.errors} />
                <FormInput label="Last Name" name="lastName" placeholder="Last name" register={register} errors={formState.errors} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Email" name="email" type="email" placeholder="Email address" register={register} errors={formState.errors} />
                <Controller
                  name="department"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => <FormCombobox
                    label="Department"
                    data={Object.values(Department).map(dep => ({ value: dep, label: dep.replaceAll("_", " ") }))}
                    onChange={onChange}
                    placeholder="Select Department"
                    error={error}
                  />}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Phone Number" name="phoneNumber" placeholder="Phone number" register={register} errors={formState.errors} />
                <Controller
                  name="specialization"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => <FormCombobox
                    label="Specialization"
                    data={Object.values(DoctorSpecialization).map(dep => ({ value: dep, label: dep.replaceAll("_", " ") }))}
                    onChange={onChange}
                    placeholder="Select Specialization"
                    error={error}
                  />}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Password" name="password" type="password" placeholder="Password" register={register} errors={formState.errors} />
                <Controller
                  name="doctorType"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => <FormRadioGroup
                    label="Doctor Type"
                    onChange={onChange}
                    defaultValue={DoctorType.CORPORATE}
                    values={Object.keys(DoctorType)}
                    error={error}
                  />}
                />
              </div>
              <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Adding..." : "Add Doctor"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {doctors.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-(--color-text-muted)">No doctors added yet</CardContent>
          </Card>
        ) : (
          doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h4>
                    <p className="text-sm text-(--color-text-muted)">{doctor.specialization}</p>
                    <p className="text-xs text-(--color-text-muted) mt-1">
                      {doctor.email} • {doctor.phoneNumber}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteDoctorMutation.mutate(doctor.id)}
                    disabled={deleteDoctorMutation.isPending}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
