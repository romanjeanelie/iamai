const ELEVENLABS_URL = process.env.ELEVENLABS_URL || "https://api.elevenlabs.io/v1/text-to-speech/ZVKjrJiWeTKF1FZwjENi/stream?optimize_streaming_latency=4";
const ELEVENLABS_TOKEN = process.env.ELEVENLABS_TOKEN || "bddfcabff8951ebb9e925d506452df93";
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
export default function textToSpeech(text, index) {
  const headers = {
    accept: "audio/mpeg",
    "xi-api-key": ELEVENLABS_TOKEN,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    text: text + " ",
    model_id: "eleven_turbo_v2",
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
    .then((audioBlob) => ({ audio: getAudio(audioBlob), index }))
    .catch((error) => console.error("Error:", error));
}
