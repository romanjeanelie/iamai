export default function downloadAudio(audio) {
  //   const audioUrl = URL.createObjectURL(blob);
  //   const au = document.createElement("audio");
  const audioLink = document.createElement("a");

  //   au.controls = true;
  //   au.src = audioUrl;

  // console.log(audio);
  audioLink.href = audio.src;
  audioLink.download = new Date().toISOString() + ".mp3";

  audioLink.click();
}
