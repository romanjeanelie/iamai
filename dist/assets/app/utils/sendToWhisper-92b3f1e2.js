const sendtowispher = (url) => new Promise((resolve, reject) => {
  var xhr = new XMLHttpRequest();
  var data = new FormData();
  data.append("audio_file", url, crypto.randomUUID() + ".wav");
  data.append("type", "audio/wav");
  xhr.open(
    "POST",
    "https://ai.iamplus.services/speech/asr?task=transcribe&encode=true&output=json&word_timestamps=false",
    true
  );
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var response = JSON.parse(this.responseText);
      resolve(response.text);
    }
  };
  xhr.addEventListener("error", function(e) {
    console.log("error: " + e);
    resolve("error: text was not transcribed");
  });
  xhr.send(data);
});
export {
  sendtowispher as default
};
