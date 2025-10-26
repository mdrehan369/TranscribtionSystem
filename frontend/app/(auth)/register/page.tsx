"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService, type RegisterInstitutionRequest } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    institutionName: "",
    address: "",
    contactNumber: "",
    contactEmail: "",
    webhookUrl: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPhoneNumber: "",
    adminPassword: "",
    adminPasswordConfirm: "",
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInstitutionRequest) => authService.registerInstitution(data),
    onSuccess: () => {
      router.push("/login")
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.adminPassword !== formData.adminPasswordConfirm) {
      setError("Passwords do not match")
      return
    }

    registerMutation.mutate({
      name: formData.institutionName,
      address: formData.address,
      contactNumber: formData.contactNumber,
      contactEmail: formData.contactEmail,
      webhookUrl: formData.webhookUrl,
      admin: {
        firstName: formData.adminFirstName,
        lastName: formData.adminLastName,
        email: formData.adminEmail,
        phoneNumber: formData.adminPhoneNumber,
        password: formData.adminPassword,
      },
    })
  }

  return (
    <div className="min-h-screen bg-(--color-surface) py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Register Institution</CardTitle>
            <CardDescription>Register your medical institution and create an admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Institution Details */}
              <div>
                <h3 className="font-semibold mb-4 text-(--color-text)">Institution Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Institution Name</label>
                    <Input
                      name="institutionName"
                      placeholder="Enter institution name"
                      value={formData.institutionName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      name="address"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Contact Number</label>
                      <Input
                        name="contactNumber"
                        type="tel"
                        placeholder="Phone number"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Email</label>
                      <Input
                        name="contactEmail"
                        type="email"
                        placeholder="Email address"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Webhook URL (Optional)</label>
                    <Input
                      name="webhookUrl"
                      type="url"
                      placeholder="https://example.com/webhook"
                      value={formData.webhookUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Admin Details */}
              <div>
                <h3 className="font-semibold mb-4 text-(--color-text)">Admin Account</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input
                        name="adminFirstName"
                        placeholder="First name"
                        value={formData.adminFirstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input
                        name="adminLastName"
                        placeholder="Last name"
                        value={formData.adminLastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      name="adminEmail"
                      type="email"
                      placeholder="Admin email"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      name="adminPhoneNumber"
                      type="tel"
                      placeholder="Admin phone number"
                      value={formData.adminPhoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Password</label>
                      <Input
                        name="adminPassword"
                        type="password"
                        placeholder="Create password"
                        value={formData.adminPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Confirm Password</label>
                      <Input
                        name="adminPasswordConfirm"
                        type="password"
                        placeholder="Confirm password"
                        value={formData.adminPasswordConfirm}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && <div className="text-sm text-(--color-error) bg-red-50 p-3 rounded">{error}</div>}

              <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Registering..." : "Register"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-(--color-text-muted)">Already have an account? </span>
              <Link href="/login" className="text-(--color-primary) hover:underline">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
