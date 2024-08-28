const WHISPER_URL =
  import.meta.env.VITE_API_WHISPER_URL ||
  "https://api.asterizk.ai/proxy-whisper-api-web/asr?task=transcribe&encode=true&output=json&word_timestamps=false&language=";
const GROQ_TOKEN = import.meta.env.VITE_API_GROQ_TOKEN;
  
const sendToWispher = (url, lang = "", attempt = 0) =>
  new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    var data = new FormData();
    data.append("audio_file", url, crypto.randomUUID() + ".wav");
    data.append("type", "audio/wav");
    xhr.open("POST", WHISPER_URL + lang, true);
    console.log("sending to whisper");
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

const sendToWisphergroq = (url, lang = "", attempt = 0) =>
  new Promise(async (resolve, reject) => {

    // WARNING: For POST requests, body is set to null by browsers.
    var data = new FormData();
    // data.append("file", fileInput.files[0], "file");
    data.append("file", url, crypto.randomUUID() + ".wav");
    data.append("model", "whisper-large-v3");
    data.append("temperature", "0");
    data.append("response_format", "json");
    data.append("language", "en");

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        var response = JSON.parse(this.responseText);
        resolve(response.text);
      }
    });

    xhr.open("POST", "https://api.groq.com/openai/v1/audio/transcriptions");
    xhr.setRequestHeader("Authorization", `Bearer ${GROQ_TOKEN}`);

    xhr.send(data);
    

    var xhr = new XMLHttpRequest();

    var data = new FormData();
    data.append("audio_file", url, crypto.randomUUID() + ".wav");
  });

export default sendToWispher;
