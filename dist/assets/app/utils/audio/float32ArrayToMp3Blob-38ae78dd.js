import "../../../node_modules/lamejs/src/js/index-954c9215.js";
import MPEGMode from "../../../node_modules/lamejs/src/js/MPEGMode-0894cda3.js";
import Lame from "../../../node_modules/lamejs/src/js/Lame-bb157bc4.js";
import BitStream from "../../../node_modules/lamejs/src/js/BitStream-c1106b65.js";
import { __exports as js } from "../../../_virtual/index-efaed3d8.js";
window.MPEGMode = MPEGMode;
window.Lame = Lame;
window.BitStream = BitStream;
function float32ArrayToMp3Blob(float32Array, sampleRate) {
  const buffer = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    buffer[i] = float32Array[i] * 32767;
  }
  const mp3encoder = new js.Mp3Encoder(1, sampleRate, 128);
  const mp3Data = [];
  const mp3buf = mp3encoder.encodeBuffer(buffer);
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }
  const endMp3Buf = mp3encoder.flush();
  if (endMp3Buf.length > 0) {
    mp3Data.push(endMp3Buf);
  }
  const blob = new Blob(mp3Data, { type: "audio/mpeg" });
  return blob;
}
export {
  float32ArrayToMp3Blob as default
};
