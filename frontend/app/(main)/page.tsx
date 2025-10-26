import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-(--color-primary) to-(--color-primary-dark) flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Medical Transcription</h1>
        <p className="text-lg mb-8 opacity-90">Professional consultation recording and transcription system</p>
        <div className="space-y-3">
          <Link href="/login" className="block">
            <Button className="w-full bg-white text-(--color-primary) hover:bg-gray-100">Login</Button>
          </Link>
          <Link href="/register" className="block">
            <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 bg-transparent">
              Register Institution
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
