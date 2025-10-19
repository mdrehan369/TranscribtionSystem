import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
  return NextResponse.json({
    success: true,
    status: "UP",
    uptime: process.uptime().toFixed(1),
    timestamp: new Date().toISOString()
  }, { status: 200 })
}
