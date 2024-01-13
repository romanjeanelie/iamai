const WHISPER_URL = process.env.WHISPER_URL || "https://ai.iamplus.services/speech/asr?task=transcribe&encode=true&output=json&word_timestamps=false";
const sendToWispher = (url) =>
  new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    var data = new FormData();
    data.append("audio_file", url, crypto.randomUUID() + ".wav");
    data.append("type", "audio/wav");
    xhr.open(
      "POST",
      WHISPER_URL,
      true
    );
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        var response = JSON.parse(this.responseText);
        resolve(response.text);
      }
    };
    xhr.addEventListener("error", function (e) {
      console.log("error: " + e);
      resolve("error: text was not transcribed");
    });
    xhr.send(data);
  });

export default sendToWispher;
