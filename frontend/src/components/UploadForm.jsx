import React from 'react';

const UploadForm = ({ setVideo, previewUrl }) => (
  <div className="field upload-field">
    <label>🎬 Upload Video</label>
    <input type="file" accept="video/*" onChange={e => {
        const file = e.target.files[0];
        setVideo(file);
    }} />
    { previewUrl &&
      <video src={previewUrl} controls className="video-preview" />
    }
  </div>
);

export default UploadForm;
