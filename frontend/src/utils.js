// creates download link assigns to download button for the data with given filename
export function createDownloadLink(blob, filename = "video.mp4") {
  // create url for the data
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
