
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecordingComponent } from "@/components/recording/recording-component"

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-(--color-text)">Dashboard</h2>
        <p className="text-(--color-text-muted) mt-1">Record and manage your consultations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today's Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-(--color-text-muted) mt-1">Recorded today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-(--color-text-muted) mt-1">All time</p>
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

      <div className="flex gap-2">
        <Link href="/doctor/consultations" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            View Consultation History
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Consultation</CardTitle>
          <CardDescription>Start recording a new patient consultation</CardDescription>
        </CardHeader>
        <CardContent>
          <RecordingComponent />
        </CardContent>
      </Card>
    </div>
  )
}
