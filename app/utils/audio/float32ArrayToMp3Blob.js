import lamejs from "lamejs";
import MPEGMode from "lamejs/src/js/MPEGMode";
import Lame from "lamejs/src/js/Lame";
import BitStream from "lamejs/src/js/BitStream";

window.MPEGMode = MPEGMode;
window.Lame = Lame;
window.BitStream = BitStream;

export default function float32ArrayToMp3Blob(float32Array, sampleRate) {
  const buffer = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    buffer[i] = float32Array[i] * 0x7fff; // convert float to 16-bit signed integer
  }

  const mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128); // mono, sampleRate, bitRate
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
