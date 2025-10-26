"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

interface ConsultationDetailProps {
  consultation: Consultation
  onBack: () => void
}

export function ConsultationDetail({ consultation, onBack }: ConsultationDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        ← Back to Consultations
      </Button>

      <div>
        <h2 className="text-3xl font-bold text-(--color-text)">{consultation.patientName}</h2>
        <p className="text-(--color-text-muted) mt-1">
          {new Date(consultation.createdAt).toLocaleDateString()} at{" "}
          {new Date(consultation.createdAt).toLocaleTimeString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audio Recording</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <audio
            ref={audioRef}
            src={consultation.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="flex items-center gap-4">
            <Button onClick={handlePlayPause} className="bg-(--color-primary) hover:bg-(--color-primary-dark)">
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={consultation.duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full"
              />
            </div>
            <span className="text-sm font-mono text-(--color-text-muted)">
              {formatTime(currentTime)} / {formatTime(consultation.duration)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consultation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-(--color-text-muted)">Status</label>
            <div className="mt-1">
              <span
                className={`text-sm px-3 py-1 rounded inline-block ${
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

          {consultation.notes && (
            <div>
              <label className="text-sm font-medium text-(--color-text-muted)">Notes</label>
              <p className="mt-2 text-(--color-text) whitespace-pre-wrap">{consultation.notes}</p>
            </div>
          )}

          {consultation.transcription && (
            <div>
              <label className="text-sm font-medium text-(--color-text-muted)">Transcription</label>
              <div className="mt-2 p-4 bg-(--color-surface) rounded border border-(--color-border)">
                <p className="text-(--color-text) whitespace-pre-wrap">{consultation.transcription}</p>
              </div>
            </div>
          )}

          {consultation.status === "pending" && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              Transcription is being processed. Please check back later.
            </div>
          )}

          {consultation.status === "failed" && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              Transcription failed. Please contact support if the issue persists.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
