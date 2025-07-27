import React, { useState, useEffect, useRef, useCallback } from "react";
import UploadForm from "./components/UploadForm";
import ScriptInput from "./components/ScriptInput";
import VoiceSelector from "./components/VoiceSelector";
import GenerateButton from "./components/GenerateButton";
import { createDownloadLink } from "./utils";
import "./App.css";

const WPM = 110;

function App() {
  const videoDuration = useRef(0);
  const feedbackRef = useRef(null);
  const downloadHandlerRef = useRef(null);

  const [voices, setVoices] = useState([]);
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState({ voice_id: "", style: "" });
  const [loading, setLoading] = useState(false);

  // fetch voices from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/voices`)
      .then((res) => res.json())
      .then((data) => {
        console.log("no of voices: ", data.length);
        setVoices(data);
      })
      .catch((err) => alert("failed to fetch voices", err));
  }, []);

  // check matching of video duration over text
  useEffect(() => {
    if (!video) return;

    const videoUrl = URL.createObjectURL(video);
    setPreviewUrl(videoUrl);

    const videoElem = document.createElement("video");
    videoElem.src = videoUrl;
    videoElem.preload = "metadata";
    videoElem.onloadedmetadata = () => {
      videoDuration.current = videoElem.duration;
      checkMatch();
    };

    return () => URL.revokeObjectURL(videoUrl);
  }, [video]);


  // check matching of text over video duration
  useEffect(() => {
    if (script) checkMatch();
  }, [script]);


  const checkMatch = useCallback(function () {
    const text = script.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // get the estimated audio duration in seconds
    const estimatedAudioDuration = (wordCount / WPM) * 60;

    if (videoDuration.current === 0) {
      feedbackRef.current.innerText = "please upload a video";
      return;
    }

    const diff = estimatedAudioDuration - videoDuration.current;

    if (Math.abs(diff) <= 0.5) {
      feedbackRef.current.innerText =
        "✅ Perfect match between text and video duration.";
    } else if (diff > 0.5) {
      feedbackRef.current.innerText = `⚠️ Text is too long. Reduce by approx ${Math.ceil(
        (diff * WPM) / 60
      )} word(s).`;
    } else {
      feedbackRef.current.innerText = `⚠️ Text is too short. Add approx ${Math.ceil(
        (-diff * WPM) / 60
      )} word(s).`;
    }
  },[script]);

  const handleGenerate = useCallback(async () => {
    if (!video || !script || !voice.voice_id || !voice.style) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("text", script);
    formData.append("voice_id", voice.voice_id);
    formData.append("voice_style", voice.style);

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

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

      // create download link and allow user to download
      downloadHandlerRef.current = createDownloadLink(videoBlob, filename);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  }, [video, script, voice,setLoading]);

  return (
    <div className="container">
      <div>
        <h1>EchoWeave</h1>
        <UploadForm setVideo={setVideo} previewUrl={previewUrl} />
        <ScriptInput script={script} setScript={setScript} />
        <VoiceSelector voices={voices} onChange={setVoice} />
        <p className="feedback" ref={feedbackRef}></p>
        <GenerateButton loading={loading} onClick={handleGenerate} />
        {downloadHandlerRef.current && (
          <button
            className="download-button"
            onClick={() => downloadHandlerRef.current?.()}
          >
            Download Video
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
