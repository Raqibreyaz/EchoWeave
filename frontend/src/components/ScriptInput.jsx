import React from 'react';

const ScriptInput = ({ script, setScript }) => (
  <div className="field">
    <label>📝 Script</label>
    <textarea
      value={script}
      placeholder="Write your voiceover here..."
      onChange={e => setScript(e.target.value)}
    />
  </div>
);

export default ScriptInput;
