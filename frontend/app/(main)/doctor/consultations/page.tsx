"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api-client"
import { ConsultationDetail } from "@/components/consultation/consultation-detail"

interface Consultation {
  id: number
  patientName: string
  notes: string
  audioUrl: string
  transcription?: string
  status: "pending" | "completed" | "failed"
  createdAt: string
  duration: number
}

export default function ConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)

  const { data: consultations = [], isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: () => apiClient.get<Consultation[]>("/api/v1/consultation/list"),
  })

  const filteredConsultations = consultations.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.notes.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (selectedConsultation) {
    return <ConsultationDetail consultation={selectedConsultation} onBack={() => setSelectedConsultation(null)} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-(--color-text)">Consultation History</h2>
        <p className="text-(--color-text-muted) mt-1">View and manage your recorded consultations</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search by patient name or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6 text-center text-(--color-text-muted)">Loading consultations...</CardContent>
        </Card>
      ) : filteredConsultations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-(--color-text-muted)">
            {consultations.length === 0 ? "No consultations recorded yet" : "No consultations match your search"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredConsultations.map((consultation) => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-(--color-text)">{consultation.patientName}</h3>
                    <p className="text-sm text-(--color-text-muted) mt-1">
                      {new Date(consultation.createdAt).toLocaleDateString()} • {Math.floor(consultation.duration / 60)}
                      m {consultation.duration % 60}s
                    </p>
                    {consultation.notes && (
                      <p className="text-sm text-(--color-text-muted) mt-2 line-clamp-2">{consultation.notes}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          consultation.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : consultation.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => setSelectedConsultation(consultation)} className="ml-4">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
