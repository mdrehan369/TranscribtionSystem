"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface Doctor {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  specialization: string
}

export function DoctorManagement() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    password: "",
  })

  const { data: doctors = [], refetch } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => apiClient.get<Doctor[]>("/api/v1/doctor/"),
  })

  const addDoctorMutation = useMutation({
    mutationFn: (data: typeof formData) => apiClient.post("/api/v1/doctor/", data),
    onSuccess: () => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        specialization: "",
        password: "",
      })
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

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault()
    addDoctorMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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
            <form onSubmit={handleAddDoctor} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Specialization</label>
                  <Input
                    name="specialization"
                    placeholder="e.g., Cardiology"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Set password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={addDoctorMutation.isPending}>
                {addDoctorMutation.isPending ? "Adding..." : "Add Doctor"}
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
