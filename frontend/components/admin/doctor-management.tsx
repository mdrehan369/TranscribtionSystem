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
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import useDebounce from "@/hooks/use-debounce"
import CustomModal from "../CustomModal"
import CustomSelect from "../CustomSelect"
import CustomPagination from "../CustomPagination"


export function DoctorManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null)
  const debouncedSetSearch = useDebounce(setDebouncedSearch, 300);

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
    queryKey: ["doctors", page, limit, debouncedSearch],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: debouncedSearch,
      }).toString();
      return (await apiClient.get<{ data: IDoctor[] }>(`/api/v1/doctor?${queryParams}`)).data
    }
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
    mutationFn: (doctor_slug: string) => apiClient.delete(`/api/v1/doctor/${doctor_slug}`),
    onSuccess: () => {
      refetch()
    },
    onError: (error: Error) => {
      alert(`Error deleting doctor: ${error.message}`)
    },
  })

  const onSubmit = (data: z.infer<typeof addDoctorSchema>) => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              id="search"
              placeholder="Search by name, email, or specialty..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                debouncedSetSearch(e.target.value);
              }}
            />
          </div>
          <CustomSelect
            data={[
              { label: "10", value: "10" },
              { label: "15", value: "15" },
              { label: "20", value: "20" }
            ]}
            label="Per Page"
            defaultValue="10"
            onChange={(val) => setLimit(Number(val))}
          />
        </div>
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
                    <p className="text-sm text-(--color-text-muted)">{doctor.specialization.replaceAll("_", " ")}</p>
                    <p className="text-xs text-(--color-text-muted) mt-1">
                      {doctor.email} • {doctor.phoneNumber}
                    </p>
                  </div>
                  <Button variant={"destructive"} onClick={() => setSelectedDoctor(doctor)} className="cursor-pointer">Remove</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        <CustomModal
          open={!!selectedDoctor}
          onOpenChange={(open) => !open && setSelectedDoctor(null)}
          title="Delete Doctor"
          description="Are you sure you want to remove this doctor from the medical institute?"
          primaryActionText="Delete"
          onPrimaryAction={() => {
            if (selectedDoctor) {
              deleteDoctorMutation.mutate(selectedDoctor.slug)
            }
            setSelectedDoctor(null)
          }}
          onSecondaryAction={() => setSelectedDoctor(null)}
          disabled={deleteDoctorMutation.isPending}
        />

        <CustomPagination
          page={page}
          setPage={setPage}
          isNextAvailable={doctors.length == limit}
        />
      </div>
    </div>
  )
}
