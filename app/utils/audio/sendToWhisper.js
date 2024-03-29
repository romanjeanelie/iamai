const WHISPER_URL = import.meta.env.VITE_API_WHISPER_URL || "https://api.iamplus.chat/proxy-whisper-api-web/asr?task=transcribe&encode=true&output=json&word_timestamps=false&language=";
const sendToWispher = (url, lang="", attempt = 0) =>
  new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    
    var data = new FormData();
    data.append("audio_file", url, crypto.randomUUID() + ".wav");
    data.append("type", "audio/wav");
    xhr.open(
      "POST",
      WHISPER_URL+lang,
      true
    );
    console.log("sending to whisper")
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        var response = JSON.parse(this.responseText);
        resolve(response.text);
      }
    };
    xhr.addEventListener("error", function (e) {
      console.log(`Error on attempt ${attempt}:`, e);
      if (attempt < 2) {
        // If this was the first or second attempt, try again
        resolve(sendToWispher(url, lang, attempt + 1));
      } else {
        // If this was the third attempt, reject the promise
        resolve("error: text was not transcribed");
      }
    });
    xhr.send(data);
  });

export default sendToWispher;
