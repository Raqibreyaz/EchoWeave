import React from 'react';

const VoiceDropdown = ({ voiceStyle, setVoiceStyle }) => (
  <div className="field">
    <label>🎙️ Voice Style</label>
    <select value={voiceStyle} onChange={e => setVoiceStyle(e.target.value)}>
      <option value="">Select Voice Style</option>
      <option value="emma">Emma (UK Female)</option>
      <option value="marcus">Marcus (US Male)</option>
      <option value="olivia">Olivia (Neutral Female)</option>
    </select>
  </div>
);

export default VoiceDropdown;
