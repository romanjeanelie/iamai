import { connect, StringCodec, AckPolicy, JSONCodec } from "https://cdn.jsdelivr.net/npm/nats.ws@latest/esm/nats.js";
import Config from "../app/getConfig.js";
var NATS_URL = "";
var NATS_USER = "";
var NATS_PASS = "";
const PHONECALLCONNECTED = "PHONE_CALL_CONNECTED",
  TRANSCRIPT = "TRANSCRIPT",
  PHONECALLENDED = "PHONE_CALL_ENDED",
  ASSISTANT = "Assistant",
  USER = "User";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

window.onload = async function () {
  const callres = document.getElementById("callresinner");
  const uuid = getQueryParam("UUID");
  const streamName = getHash(uuid);
  const subject = `${streamName}.call.>`;
  // console.log("subject: ", subject);
  const config = new Config();
  config.getWebsiteConfig().then(async data => {
    if (data) {
      NATS_URL = data.NATS_URL;
      NATS_USER = data.NATS_USER;
      NATS_PASS = data.NATS_PASS;


      let nc = await connect({
        servers: [NATS_URL],
        user: NATS_USER,
        pass: NATS_PASS,
      });
      const p = document.createElement("p");
      p.className = "call__title";
      p.innerHTML = "Connected"
      callres.appendChild(p);
      // console.log("nats connected");
      // const jsm = await nc.jetstreamManager();

      // let si = await jsm.streams.add({
      //   name: streamName,
      //   subjects: [subject],
      // });
      // // console.log("Stream add_stream =", si);
      // // Add the consumer
      // si = await jsm.consumers.add(streamName, {
      //   durable_name: streamName,
      //   config: {
      //     durable_name: streamName,
      //   },
      // });

      // let nc = await connect({
      //     servers: [NATS_URL],
      //     user: NATS_USER,
      //     pass: NATS_PASS,
      // });
      const js = nc.jetstream();
      const c = await js.consumers.get(streamName);
      let iter = await c.consume();
      nc.onclose = function (e) {
        console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
        setTimeout(async function () {
          console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
          nc = await connect({
            servers: [NATS_URL],
            user: NATS_USER,
            pass: NATS_PASS,
          });
        }, 1000);
      };

      nc.onerror = function (err) {
        console.error("Socket encountered error: ", err.message, "Closing socket");
        ws.close();
      };
      for await (const m of iter) {
        var mdata = m.json();
        console.log("mdata:", mdata);
        // m.ack();
        if (mdata.event) {
          if (mdata.event == PHONECALLCONNECTED || mdata.event == PHONECALLENDED) {
            const p = document.createElement("p");
            p.className = "call__title";
            p.innerHTML = mdata.event;
            callres.appendChild(p);
          } else if (mdata.event == TRANSCRIPT) {
            if (mdata.sender == USER) {
              const ptitle = document.createElement("p");
              ptitle.className = "call__usertitle";
              ptitle.innerHTML = "USER";
              callres.appendChild(ptitle);
              const p = document.createElement("p");
              p.className = "call__user";
              p.innerHTML = mdata.transcript;
              callres.appendChild(p);
            } else if (mdata.sender == ASSISTANT) {
              const ptitle = document.createElement("p");
              ptitle.className = "call__aititle";
              ptitle.innerHTML = "AI";
              callres.appendChild(ptitle);
              const p = document.createElement("p");
              p.className = "call__ai";
              p.innerHTML = mdata.transcript;
              callres.appendChild(p);
            }
          }
        }
      }
      nc.drain();
    } else {
      console.log('No data available');
    }
  }).catch(error => {
    console.error('Error:', error);
  });
};

function getHash(input) {
  // This is a placeholder function. You should implement your own hash function here.
  return input; // Replace with actual hash logic
}
