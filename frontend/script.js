const server_url = "http://localhost:5000";

const uploadForm = document.getElementById("upload-form");
const videoInput = document.getElementById("video-input");
const textElement = document.getElementById("text");
const downloadButton = document.getElementById("download-button");

// disabling button initially
downloadButton.disabled = true;

uploadForm.addEventListener("submit", uploadFormHandler);

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

    // forward the data to server
    const res = await fetch(`${server_url}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to process video!");

    // get data as blob
    const videoBlob = await res.blob();

    // create unique filename
    const unique = new Date().toISOString().replace(":", "-");
    const filename = `video-${unique}.mp4`;

    // create download link and allow user to download
    createDownloadLink(videoBlob, filename);
  } catch (error) {
    console.error(error);
  }
}
