import { useState, memo } from "react";

export default memo(function VoiceSelector({ voices, onChange }) {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("");

  const handleVoiceChange = (e) => {
    const voice = voices.find((v) => v.voice_id === e.target.value);
    setSelectedVoice(voice);
    setSelectedStyle("");
    onChange?.({ voice_id: voice.voice_id, style: "" });
  };

  const handleStyleChange = (e) => {
    setSelectedStyle(e.target.value);
    onChange?.({ voice_id: selectedVoice.voice_id, style: e.target.value });
  };

  return (
    <div className="voice-selector">
      <div className="field">
        <label htmlFor="voice-select">🎤 Select Voice:</label>
        <select
          id="voice-select"
          onChange={handleVoiceChange}
          value={selectedVoice?.voice_id || ""}
        >
          <option value="">-- Choose Voice --</option>
          {voices.map((voice) => (
            <option key={voice.voice_id} value={voice.voice_id}>
              {`${voice.display_name} (${voice.gender}, ${voice.accent})`}
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
            {selectedVoice.available_styles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
});
