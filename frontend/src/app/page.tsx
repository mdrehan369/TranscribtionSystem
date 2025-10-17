"use client"

import dynamic from "next/dynamic";

const Recorder = dynamic(
  () => import("@/components/Recorder"),
  { ssr: false }
)

export default function Home() {
  return (
    <div>
      <Recorder />
    </div>
  );
}
