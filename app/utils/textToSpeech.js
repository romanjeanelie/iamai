const ELEVENLABS_URL =
  import.meta.env.VITE_API_ELEVENLABS_URL ||
  "https://api.elevenlabs.io/v1/text-to-speech/ZVKjrJiWeTKF1FZwjENi/stream?optimize_streaming_latency=4";
const ELEVENLABS_TOKEN = import.meta.env.VITE_API_ELEVENLABS_TOKEN || "bddfcabff8951ebb9e925d506452df93";
const GOOGLE_TTS_URL = import.meta.env.VITE_API_GOOGLE_TTS_URL;
function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function getAudio(blob) {
  const audioURL = URL.createObjectURL(blob);
  const audio = new Audio(audioURL);
  return audio;
}

// export default function textToSpeech(text, index) {
//   const voiceId = "21m00Tcm4TlvDq8ikWAM"; // replace with your voice_id
//   const model = "eleven_monolingual_v1";
//   const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}`;
//   const socket = new WebSocket(wsUrl);
//   let audioChunks = [];

//   return new Promise((resolve, reject) => {
//     // Initialize the connection by sending the BOS message
//     socket.onopen = function (event) {
//       const bosMessage = {
//         text: " ",
//         voice_settings: {
//           stability: 0.5,
//           similarity_boost: 0.8,
//         },
//         xi_api_key: import.meta.env.VITE_API_KEY_ELEVENTLABS, // replace with your API key
//       };

//       socket.send(JSON.stringify(bosMessage));

//       // Send the input text message
//       const textMessage = {
//         text: text + " ",
//         try_trigger_generation: true,
//       };

//       socket.send(JSON.stringify(textMessage));

//       // Send the EOS message with an empty string to signal the end of the text
//       const eosMessage = {
//         text: "",
//       };

//       socket.send(JSON.stringify(eosMessage));
//     };

//     // Handle server responses
//     socket.onmessage = function (event) {
//       const response = JSON.parse(event.data);

//       if (response.audio) {
//         const audioChunk = base64ToUint8Array(response.audio); // decode base64
//         audioChunks.push(audioChunk);
//       } else {
//         console.log("No audio data in the response");
//       }

//       if (response.isFinal) {
//         // The generation is complete
//       }

//       if (response.normalizedAlignment) {
//         // Use the alignment info if needed
//       }
//     };

//     // Handle errors
//     socket.onerror = function (error) {
//       console.error(`WebSocket Error: ${error}`);
//       reject(error);
//     };

//     // Handle socket closing
//     socket.onclose = function (event) {
//       if (event.wasClean) {
//         console.info(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
//       } else {
//         console.warn("Connection died");
//       }

//       // Concatenate audio chunks and create a Blob
//       const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
//       const audio = getAudio(audioBlob);

//       // Resolve the Promise with the final audio element
//       resolve({ audio, index });
//     };
//   });
// }
export default async function textToSpeech(text, targetlang, index, attempt = 0) {
  let filteredLanguages = await getlangselected(targetlang);
  // console.log("textToSpeech filteredLanguages:", filteredLanguages);
  if (!filteredLanguages.length || filteredLanguages[0].provider == "elevenlabs") {
    const headers = {
      accept: "audio/mpeg",
      "xi-api-key": ELEVENLABS_TOKEN,
      "Content-Type": "application/json",
    };
    var model_id = "eleven_turbo_v2_5";
    // var model_id = "eleven_turbo_v2";
    if (targetlang != "en") {
      // model_id = "eleven_multilingual_v2";
    }
    const body = JSON.stringify({
      text: text + " ",
      model_id: model_id,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    });

    return fetch(ELEVENLABS_URL, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => response.blob())
      .then((audioBlob) => {
        // console.log("from text to speech elevenlabs  : ", getAudio(audioBlob), index);
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
      input: {
        text: text + " ",
      },
      voice: {
        languageCode: filteredLanguages[0].languagecode,
        name: filteredLanguages[0].voice,
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
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
        // console.log("response.text()", audidata);
        const base64 = JSON.parse(audidata).audioContent;
        const binaryString = window.atob(base64);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);

        for (let i = 0; i < length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: "audio/mpeg" });
      })
      .then((audioBlob) => {
        // console.log("from text to speech google : ", audioBlob, index);
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

async function getlangselected(targetlang) {
  // Return the promise here
  return new Promise((resolve, reject) => {
    fetch("lang.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok: " + response.statusText);
        }
        return response.json(); // Directly return JSON if the response type is known to be JSON
      })
      .then((data) => {
        const languagesArray = data; // Assuming data is the array
        const filteredLanguages = languagesArray.filter((language) =>
          language.code?.toLowerCase().startsWith(targetlang ? targetlang.toLowerCase() : "en")
        );
        // console.log("getlangselected:", filteredLanguages);
        resolve(filteredLanguages);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        reject(error);
      });
  });
}
