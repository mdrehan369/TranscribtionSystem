"use client"

import { useState, useRef, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"

interface RecordingData {
  patientName: string
  notes: string
  audioBlob: Blob
}

export function RecordingComponent() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [patientName, setPatientName] = useState("")
  const [notes, setNotes] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const uploadMutation = useMutation({
    mutationFn: async (data: RecordingData) => {
      const formData = new FormData()
      formData.append("file", data.audioBlob, "recording.mp3")
      // formData.append("patientName", data.patientName)
      // formData.append("notes", data.notes)
      return apiClient.postFormData("/api/v1/transcribe/upload-audio", formData)
    },
    onSuccess: () => {
      setPatientName("")
      setNotes("")
      setRecordingTime(0)
      alert("Consultation recorded successfully!")
    },
    onError: (error: Error) => {
      alert(`Error uploading recording: ${error.message}`)
    },
  })

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      alert("Unable to access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        })
        setIsRecording(false)

        if (patientName.trim()) {
          uploadMutation.mutate({
            patientName,
            notes,
            audioBlob,
          })
        } else {
          alert("Please enter patient name")
        }
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Patient Name</label>
        <Input
          placeholder="Enter patient name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          disabled={isRecording}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (Optional)</label>
        <textarea
          placeholder="Add any notes about the consultation"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isRecording}
          className="w-full p-2 border border-(--color-border) rounded text-sm"
          rows={3}
        />
      </div>

      <Card className="bg-(--color-surface) p-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-3xl font-mono font-bold text-(--color-primary)">{formatTime(recordingTime)}</div>
            <p className="text-sm text-(--color-text-muted) mt-1">{isRecording ? "Recording..." : "Ready to record"}</p>
          </div>
        </div>
      </Card>

      <div className="flex gap-2">
        {!isRecording ? (
          <Button onClick={startRecording} className="flex-1 bg-(--color-success) hover:bg-green-600">
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              onClick={stopRecording}
              className="flex-1 bg-(--color-error) hover:bg-red-600"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Stop Recording"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
