import React, { memo } from "react";

const UploadForm = memo(({ setVideo, previewUrl }) => (
  <div>
    <label>🎬 Upload Video</label>
    <input
      type="file"
      accept="video/*"
      onChange={(e) => {
        const file = e.target.files[0];
        setVideo(file);
      }}
    />
    {previewUrl && (
      <video src={previewUrl} controls className="video-preview" />
    )}
  </div>
));

export default UploadForm;
