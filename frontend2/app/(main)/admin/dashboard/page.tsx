"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DoctorManagement } from "@/components/admin/doctor-management"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "doctors">("overview")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-(--color-text)">Administration Dashboard</h2>
        <p className="text-(--color-text-muted) mt-1">Manage your institution and doctors</p>
      </div>

      <div className="flex gap-2">
        <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
          Overview
        </Button>
        <Button variant={activeTab === "doctors" ? "default" : "outline"} onClick={() => setActiveTab("doctors")}>
          Manage Doctors
        </Button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-(--color-text-muted) mt-1">Active doctors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-(--color-text-muted) mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Transcriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-(--color-text-muted) mt-1">Being processed</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "doctors" && <DoctorManagement />}
    </div>
  )
}
