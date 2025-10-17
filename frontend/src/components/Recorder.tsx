import { useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

export default function Recorder() {

  const {
    status,
    mediaBlobUrl,
    resumeRecording,
    pauseRecording,
    startRecording,
    stopRecording,
    clearBlobUrl
  } = useReactMediaRecorder({ audio: true, video: false })

  const handleSend = async (url?: string) => {
    console.log(url)
    if (!url) return
    const response = await fetch(url)
    const audioBlob = await response.blob()
    const formData = new FormData()

    formData.append("file", audioBlob, "recording.mp3")
    await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });
  }

  useEffect(() => {
    if (mediaBlobUrl) {
      handleSend(mediaBlobUrl)
      clearBlobUrl()
    }
  }, [mediaBlobUrl])
  return (
    <div>
      <p>{status}</p>
      {
        status === "idle" ?
          <button onClick={startRecording}>Start</button>
          : <button onClick={() => {
            stopRecording()
            handleSend(mediaBlobUrl)
          }}>Stop</button>
      }
      <br />
      {
        status !== "idle" && (
          status === "paused" ?
            <button onClick={resumeRecording}>Resume</button>
            : <button onClick={pauseRecording}>Pause</button>
        )
      }
      <audio src={mediaBlobUrl} controls />
    </div>
  );
}

