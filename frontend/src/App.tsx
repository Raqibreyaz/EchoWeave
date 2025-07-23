import React, { useState } from "react";
import axios from "axios";

function App() {
  const [video, setVideo] = useState<File | null>(null);
  const [script, setScript] = useState<string>("");
  const [voice, setVoice] = useState<string>("en_us_1");
  const [downloadLink, setDownloadLink] = useState<string>("");

  const handleSubmit = async () => {
    if (!video || !script) {
      alert("Please upload a video and enter a script.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("script", script);
    formData.append("voice_id", voice);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "video/mp4" });
      const url = window.URL.createObjectURL(blob);
      setDownloadLink(url);
    } catch (error) {
      alert("❌ Failed to generate video");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1>🎙️ MurfCast: AI Voice to Video</h1>
      <p>
        This is your React frontend for adding AI-generated voiceovers to muted
        videos.
      </p>

      <input
        type="file"
        accept="video/*"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setVideo(e.target.files?.[0] || null)
        }
      />
      <br />
      <br />

      <textarea
        rows={5}
        cols={60}
        placeholder="✍️ Enter your voice-over script here..."
        value={script}
        onChange={(e) => setScript(e.target.value)}
        style={{ padding: "10px" }}
      />
      <br />
      <br />

      <label>Select Voice:&nbsp;</label>
      <select value={voice} onChange={(e) => setVoice(e.target.value)}>
        <option value="en_us_1">English Male</option>
        <option value="en_us_2">English Female</option>
      </select>
      <br />
      <br />

      <button
        onClick={handleSubmit}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        🚀 Generate Video
      </button>

      {downloadLink && (
        <div style={{ marginTop: "30px" }}>
          <a href={downloadLink} download="murfcast_output.mp4">
            📥 Download Final Video
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
