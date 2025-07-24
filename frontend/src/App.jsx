import React, { useState, useEffect, useRef } from "react";
import UploadForm from "./components/UploadForm";
import ScriptInput from "./components/ScriptInput";
import VoiceDropdown from "./components/VoiceDropdown";
import GenerateButton from "./components/GenerateButton";
import { createDownloadLink } from "./utils";
import "./App.css";

function App() {
  const wpm = 110;

  const videoDuration = useRef(0);
  const feedbackElement = useRef(null);

  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [script, setScript] = useState("");
  const [voiceStyle, setVoiceStyle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) {
      const videoUrl = URL.createObjectURL(video);
      setPreviewUrl(videoUrl);

      const videoElem = document.createElement("video");
      videoElem.src = videoUrl;
      videoElem.preload = "metadata";
      videoElem.onloadedmetadata = () => {
        videoDuration.current = videoElem.duration;
        checkMatch();
      };
    }
  }, [video]);

  useEffect(() => {
    if (script) checkMatch();
  }, [script]);

  const handleGenerate = async () => {
    if (!video || !script || !voiceStyle) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("video", video);
    formData.append("text", script);
    formData.append("voice_id", voiceStyle);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      console.log(res);

      if (res.status != 200) {
        const errText = await res.text();
        throw new Error(`Server Error: ${errText}`);
      }

      const content_type = res.headers.get("content-type");
      if (!content_type.includes("video"))
        throw new Error("Expected video but got something else");

      // get data as blob
      const videoBlob = await res.blob();

      // create unique filename
      const unique = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `video-${unique}.mp4`;

      // // create download link and allow user to download
      createDownloadLink(videoBlob, filename);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  function checkMatch() {
    const text = script.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // get the estimated audio duration in seconds
    const estimatedAudioDuration = (wordCount / wpm) * 60;

    if (videoDuration.current === 0) {
      feedbackElement.current.innerText = "please upload a video";
      return;
    }

    const diff = estimatedAudioDuration - videoDuration.current;

    if (Math.abs(diff) <= 0.5) {
      feedbackElement.current.innerText =
        "✅ Perfect match between text and video duration.";
    } else if (diff > 0.5) {
      feedbackElement.current.innerText = `⚠️ Text is too long. Reduce by approx ${Math.ceil(
        (diff * wpm) / 60
      )} word(s).`;
    } else {
      feedbackElement.current.innerText = `⚠️ Text is too short. Add approx ${Math.ceil(
        (-diff * wpm) / 60
      )} word(s).`;
    }
  }

  return (
    <div className="app">
      <div className="card">
        <h1>EchoWeave UI</h1>
        <UploadForm setVideo={setVideo} previewUrl={previewUrl} />
        <ScriptInput script={script} setScript={setScript} />
        <VoiceDropdown voiceStyle={voiceStyle} setVoiceStyle={setVoiceStyle} />
        <p ref={feedbackElement} style={{ color: "black" }}></p>
        <GenerateButton loading={loading} onClick={handleGenerate} />
      </div>
    </div>
  );
}

export default App;
