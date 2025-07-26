import { useState } from "react";

export default function VoiceSelector({ voices, onChange }) {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("");

  const handleVoiceChange = (e) => {
    const voice = voices.find((v) => v.voiceId === e.target.value);
    setSelectedVoice(voice);
    setSelectedStyle("");
    onChange?.({ voiceId: voice.voiceId, style: "" });
  };

  const handleStyleChange = (e) => {
    setSelectedStyle(e.target.value);
    onChange?.({ voiceId: selectedVoice.voiceId, style: e.target.value });
  };

  return (
    <div className="voice-selector">
      <div className="field">
        <label htmlFor="voice-select">🎤 Select Voice:</label>
        <select
          id="voice-select"
          onChange={handleVoiceChange}
          value={selectedVoice?.voiceId || ""}
        >
          <option value="">-- Choose Voice --</option>
          {voices.map((voice) => (
            <option key={voice.voiceId} value={voice.voiceId}>
              {`${voice.displayName} (${voice.gender}, ${voice.accent})`}
            </option>
          ))}
        </select>
      </div>

      {selectedVoice && (
        <div className="field">
          <label htmlFor="style-select">🎭 Select Style:</label>
          <select
            id="style-select"
            onChange={handleStyleChange}
            value={selectedStyle}
          >
            <option value="">-- Choose Style --</option>
            {selectedVoice.availableStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
