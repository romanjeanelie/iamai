import AudioRecorder from "../app/AudioRecorder";
import sendToWispher from "../app/utils/audio/sendToWhisper";
import minSecStr from "../app/utils/minSecStr";


let backMicBtnContainer = document.querySelector(".mic-btn__container");
let backMicBtn = document.querySelector(".mic-btn");
let backMicText = document.querySelector("p");
let targetlang = document.getElementById("targetlang");
let voiceid = document.getElementById("voiceid");
let divcontainer = document.getElementById("divcontainer");

const ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech/$voiceid/stream?optimize_streaming_latency=4";
const ELEVENLABS_TOKEN = import.meta.env.VITE_API_ELEVENLABS_TOKEN || "bddfcabff8951ebb9e925d506452df93";
const GOOGLE_TTS_URL = import.meta.env.VITE_API_GOOGLE_TTS_URL || "https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyBA_hE3ia77DTErB6SejtlEwDBdKN-5WFA";

function getAudio(blob) {
    const audioURL = URL.createObjectURL(blob);
    const audio = new Audio(audioURL);
    return audio;
}


let isSmallRecording = false;
let audioRecorder = new AudioRecorder({
    onComplete: onCompleteRecording.bind(this),
});

backMicBtn.addEventListener("click", () => {
    if (!isSmallRecording) {
        isSmallRecording = true;
        startRecording();
        backMicBtnContainer.classList.add("active");
    } else {
        stopRecording();
        isSmallRecording = false;
        backMicBtnContainer.classList.remove("active");
    }
});
// Audio
function startRecording() {
    audioRecorder.startRecording();
    audioRecorder.onUpdate((sec) => {
        const time = minSecStr((sec / 60) | 0) + ":" + minSecStr(sec % 60);
        backMicText.textContent = time;
    });
}

function stopRecording() {
    audioRecorder.stopRecording();
    backMicText.textContent = "0:00";
}

async function onCompleteRecording(blob) {

    let textRecorded = await sendToWispher(blob);
    // let textRecorded = await sendToWispher(blob, this.discussion.Chat.sourcelang);
    const divorignaltext = document.createElement("div");
    divorignaltext.className = "divorignaltext";

    const divorignaltextp = document.createElement("p");
    divorignaltextp.textContent = textRecorded;
    divorignaltext.appendChild(divorignaltextp);
    divcontainer.prepend(divorignaltext);

    // orignaltext.textContent = textRecorded;
    var response = await googletranslate(textRecorded, targetlang.value, "");
    // translatedtext.textContent = response.data.translations[0].translatedText;
    const divtranslated = document.createElement("div");
    divtranslated.className = "divtranslated";
    const divtranslatedp = document.createElement("p");
    divtranslatedp.textContent = response.data.translations[0].translatedText;
    divtranslated.appendChild(divtranslatedp);
    const divtranslatedaudioplayer = document.createElement("audio");
    divtranslatedaudioplayer.controls = true;
    const { audio, index } = await textToSpeech(response.data.translations[0].translatedText, targetlang.value, 1);
    console.log("audio", audio)
    divtranslatedaudioplayer.src = audio.src;
    divtranslated.appendChild(divtranslatedaudioplayer);
    divcontainer.prepend(divtranslated);
    // divtranslatedaudioplayer.load();
}

const googletranslate = (text, lang, sourcelang) =>
    new Promise(async (resolve, reject) => {
        var xhr = new XMLHttpRequest();
        var url = "https://translation.googleapis.com/language/translate/v2";
        var apiKey = "AIzaSyBA_hE3ia77DTErB6SejtlEwDBdKN-5WFA";

        xhr.open("POST", `${url}?key=${apiKey}`, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("google:" + xhr.responseText);
                var jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse.data && jsonResponse.data.translations) {
                    resolve(jsonResponse);
                }
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                console.error("Error:", xhr.responseText);
            }
        };
        var data = "";
        if (sourcelang && sourcelang != "") {
            var data = JSON.stringify({
                q: text,
                target: lang,
                source: sourcelang,
            });
        } else {
            data = JSON.stringify({
                q: text,
                target: lang,
            });
        }
        xhr.send(data);
    });

function textToSpeech(text, targetlang, index, attempt = 0) {
    if (1 == 2) {
        const headers = {
            accept: "audio/mpeg",
            "xi-api-key": ELEVENLABS_TOKEN,
            "Content-Type": "application/json",
        };
        var model_id = "eleven_turbo_v2";
        if (targetlang != "en") {
            model_id = "eleven_multilingual_v2";
        }
        const body = JSON.stringify({
            text: text + " ",
            model_id: model_id,
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5,
            },
        });

        return fetch(ELEVENLABS_URL.replace("$voiceid", voiceid.value), {
            method: "POST",
            headers: headers,
            body: body,
        })
            .then((response) => response.blob())
            .then((audioBlob) => {
                console.log("from text to speech  : ", audioBlob, index);
                return { audio: getAudio(audioBlob), index };
            })
            .catch((error) => {
                console.error(`Error on attempt ${attempt}:`, error);
                if (attempt < 2) {
                    // If this was the first or second attempt, try again
                    return new Promise((resolve, reject) => {
                        // Wait for 1 second before retrying
                        console.error;
                        setTimeout(() => {
                            textToSpeech(text, targetlang, index, attempt + 1)
                                .then(resolve) // If the retry is successful, resolve this promise
                                .catch(reject); // If the retry fails, reject this promise
                        }, 1000);
                    });
                } else {
                    // If this was the third attempt, throw the error
                    throw error;
                }
            });
    } else {
        const body = JSON.stringify({
            "input": {
                "text": text + " "
            },
            "voice": {
                "languageCode": "ta-IN",
                "name": "ta-IN-Wavenet-A",
                "ssmlGender": "FEMALE"
            },
            "audioConfig": {
                "audioEncoding": "MP3"
            }
        });
        const headers = {
            "Content-Type": "application/json",
        };
        return fetch(GOOGLE_TTS_URL, {
            method: "POST",
            headers: headers,
            body: body,
        })
            .then(async (response) => {
                const audidata = await response.text();
                console.log("response.text()", audidata)
                const base64 = JSON.parse(audidata).audioContent;
                const binaryString = window.atob(base64);
                const length = binaryString.length;
                const bytes = new Uint8Array(length);

                for (let i = 0; i < length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return new Blob([bytes], { type: "audio/mpeg" })
            })
            .then((audioBlob) => {
                console.log("from text to speech  : ", audioBlob, index);
                return { audio: getAudio(audioBlob), index };
            })
            .catch((error) => {
                console.error(`Error on attempt ${attempt}:`, error);
                if (attempt < 2) {
                    // If this was the first or second attempt, try again
                    return new Promise((resolve, reject) => {
                        // Wait for 1 second before retrying
                        console.error;
                        setTimeout(() => {
                            textToSpeech(text, targetlang, index, attempt + 1)
                                .then(resolve) // If the retry is successful, resolve this promise
                                .catch(reject); // If the retry fails, reject this promise
                        }, 1000);
                    });
                } else {
                    // If this was the third attempt, throw the error
                    throw error;
                }
            });
    }
}
