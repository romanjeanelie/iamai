function getAudio(blob) {
  const audioURL = URL.createObjectURL(blob);
  const audio = new Audio(audioURL);
  //   let audio = document.createElement("audio");
  //   audio.setAttribute("x-webkit-airplay", "deny"); // Disable the iOS control center media widget
  //   audio.preload = "auto";
  //   audio.src = audioURL;
  return audio;
}

export default function textToSpeech(text) {
  const url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream?optimize_streaming_latency=4";
  const headers = {
    accept: "audio/mpeg",
    "xi-api-key": "bddfcabff8951ebb9e925d506452df93",
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    text: text,
    model_id: "eleven_turbo_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5,
    },
  });

  return fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  })
    .then((response) => response.blob())
    .then((audioBlob) => getAudio(audioBlob))
    .catch((error) => console.error("Error:", error));
}
