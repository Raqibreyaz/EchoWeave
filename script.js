const server_url = "http://127.0.0.1:5000";

const uploadForm = document.getElementById("upload-form");
const videoInput = document.getElementById("video-input");
const textElement = document.getElementById("text");
const downloadButton = document.getElementById("download-button");
const feedbackElement = document.getElementById("feedback");

// disabling button initially
downloadButton.disabled = true;

let videoDuration = 0;

// 110 words/min for the audio
const wpm = 110;

// when a video is selected then take it's duration and check for match with text
videoInput.addEventListener("change", function () {
  const file = videoInput.files[0];
  if (!file) return;

  const video = document.createElement("video");
  video.preload = "metadata";

  video.onloadedmetadata = function (params) {
    videoDuration = video.duration;
    checkMatch();
  };
  video.src = URL.createObjectURL(file);
});

textElement.addEventListener("input", checkMatch);

uploadForm.addEventListener("submit", uploadFormHandler);

// just checks how much the text and video duration matches
function checkMatch() {
  const text = textElement.value.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // get the estimated audio duration in seconds
  const estimatedAudioDuration = (wordCount / wpm) * 60;

  if (videoDuration === 0) {
    feedbackElement.innerText = "please upload a video";
    return;
  }

  const diff = estimatedAudioDuration - videoDuration;

  if (Math.abs(diff) <= 0.5) {
    feedback.innerText = "✅ Perfect match between text and video duration.";
  } else if (diff > 0.5) {
    feedback.innerText = `⚠️ Text is too long. Reduce by approx ${Math.ceil(
      (diff * wpm) / 60
    )} word(s).`;
  } else {
    feedback.innerText = `⚠️ Text is too short. Add approx ${Math.ceil(
      (-diff * wpm) / 60
    )} word(s).`;
  }
}

// creates download link assigns to download button for the data with given filename
function createDownloadLink(blob, filename = "video.mp4") {
  // create url for the data
  const url = URL.createObjectURL(blob);

  // now enable the button so that user can download the audio
  downloadButton.disabled = false;

  // add download event
  downloadButton.addEventListener("click", function () {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  });
}

async function uploadFormHandler(event) {
  try {
    event.preventDefault();

    const file = videoInput.files[0];
    if (!file) {
      alert("please select a video file");
      return;
    }

    const textData = textElement.value;
    if (!textData) {
      alert("please give text for audio");
      return;
    }

    // disabling the download button so that no unexpected action can be done
    downloadButton.disabled = true;

    const formData = new FormData();
    formData.append("video", file);
    formData.append("text", textElement.value);

    const timeToWait = Math.max(2 * 1000 * videoDuration,30000)

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, timeToWait);

    // forward the data to server
    const res = await fetch(`${server_url}/upload`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server Error: ${errText}`);
    }

    const content_type = res.headers.get("Content-Type");
    if (!content_type.includes("video"))
      throw new Error("Expected video but got something else");

    // get data as blob
    const videoBlob = await res.blob();

    // create unique filename
    const unique = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `video-${unique}.mp4`;

    // create download link and allow user to download
    createDownloadLink(videoBlob, filename);
  } catch (error) {
    console.error("Upload failed:", error);
    alert(`Upload failed: ${error.message}`);
  }
}
