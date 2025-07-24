import React from 'react';

const GenerateButton = ({ onClick, loading }) => (
  <button className="generate-btn" onClick={onClick} disabled={loading}>
    {loading ? 'Generating...' : '🚀 Generate Voiceover'}
  </button>
);

export default GenerateButton;
