import React, { memo } from "react";

const ScriptInput = memo(({ script, setScript }) => (
  <div>
    <label>📝 Script</label>
    <textarea
      value={script}
      placeholder="Write your voiceover here..."
      onChange={(e) => setScript(e.target.value)}
    />
  </div>
));

export default ScriptInput;
