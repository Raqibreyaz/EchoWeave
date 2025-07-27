import React, { memo } from "react";

const GenerateButton = memo(({ onClick, loading }) => (
  <button onClick={onClick} disabled={loading}>
    {loading ? "Generating..." : "🚀 Generate Voiceover"}
  </button>
));

export default GenerateButton;
