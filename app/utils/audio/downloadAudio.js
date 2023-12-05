export default function downloadLink(blob) {
  const audioUrl = URL.createObjectURL(blob);
  const au = document.createElement("audio");
  const audioLink = document.createElement("a");

  au.controls = true;
  au.src = audioUrl;

  audioLink.href = audioUrl;
  audioLink.download = new Date().toISOString() + ".mp3";

  audioLink.click();
}
