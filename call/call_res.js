import { connect, AckPolicy, JSONCodec } from "https://cdn.jsdelivr.net/npm/nats.ws@latest/esm/nats.js";
const NATS_URL = import.meta.env.VITE_API_NATS_URL || "wss://nats.asterizk.ai";
const NATS_USER = import.meta.env.VITE_API_NATS_USER || "iamplus-acc";
const NATS_PASS = import.meta.env.VITE_API_NATS_PASS || "cis8Asto6HepremoGApI";

let nc = await connect({
    servers: [NATS_URL],
    user: NATS_USER,
    pass: NATS_PASS,
});
const stream_name = "26a8a0ccb2a7814485b194f2e0eecb3eb8a6b50f";
const js = nc.jetstream();
const c = await js.consumers.get(stream_name, stream_name);
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
    console.log(mdata);
    m.ack();
}
nc.drain();