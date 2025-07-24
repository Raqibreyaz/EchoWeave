import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadForm from './components/UploadForm';
import ScriptInput from './components/ScriptInput';
import VoiceDropdown from './components/VoiceDropdown';
import GenerateButton from './components/GenerateButton';
import './App.css';

function App() {
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [script, setScript] = useState('');
  const [voiceStyle, setVoiceStyle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (video) setPreviewUrl(URL.createObjectURL(video));
  }, [video]);

  const handleGenerate = async () => {
    if (!video || !script || !voiceStyle) {
      alert('Please fill all fields.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('video', video);
    formData.append('script', script);
    formData.append('voiceStyle', voiceStyle);

    try {
      const res = await axios.post('http://localhost:5000/generate', formData);
      alert(res.data.message || 'Voiceover generated successfully!');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      alert('Something went wrong. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>MurfCast UI</h1>
        <UploadForm setVideo={setVideo} previewUrl={previewUrl} />
        <ScriptInput script={script} setScript={setScript} />
        <VoiceDropdown voiceStyle={voiceStyle} setVoiceStyle={setVoiceStyle} />
        <GenerateButton loading={loading} onClick={handleGenerate} />
      </div>
    </div>
  );
}

export default App;
