import Discussion from "./Discussion.js";
import { connect, AckPolicy, JSONCodec } from "https://cdn.jsdelivr.net/npm/nats.ws@latest/esm/nats.js";
// const uuid = "omega_" + crypto.randomUUID();
// import { getUser } from "../User.js";
// const IS_DEV_MODE = import.meta.env.MODE === "development";
const IS_DEV_MODE = false;
const HOST = import.meta.env.VITE_API_HOST || "https://api.iamplus.chat"
const NATS_URL = import.meta.env.VITE_API_NATS_URL || "wss://nats.iamplus.chat"
const NATS_USER = import.meta.env.VITE_API_NATS_USER || "iamplus-acc"
const NATS_PASS = import.meta.env.VITE_API_NATS_PASS || "cis8Asto6HepremoGApI"
let steamseq = [];

class Chat {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.discussionContainer = this.callbacks.discussionContainer;
    this.autodetect = false;
    this.targetlang = "en";
    this.sourcelang = "en";
    this.location = "US";
    this.status = "";
    this.sessionID = "";
    this.workflowID = "";
    this.awaiting = false;
    this.agentawaiting = false;
    this.domain = "";
    this.FlightSearch = "";
    this.FlightSearchResults = "";
    this.TaxiSearch = "";
    this.TaxiSearchResults = "";
    this.ProductSearch = "";
    this.ProductSearchResults = "";
    this.container = null;
    this.textContainer = null;
    this.RAG_CHAT = "";
    this.MovieSearch = "";
    this.MovieSearchResults = "";
    this.Sources = "";
    this.deploy_ID = "";
    this.image_urls = "";
    this.task_name = "";
    this.user = this.callbacks.user;
    this.callbacks.disableInput();
  }

  callsubmit = async (text, img, container) => {
    this.container = container;
    var input_text = text;
    var original_text = input_text;
    if (this.autodetect) {
      var response = await this.googletranslate(input_text, this.targetlang, "");
      input_text = response.data.translations[0].translatedText;
      console.log("response.data.translations[0].detectedSourceLanguage", response.data.translations[0].detectedSourceLanguage)
      if (response.data.translations[0].detectedSourceLanguage)
        this.sourcelang = response.data.translations[0].detectedSourceLanguage;
    } else if (this.sourcelang != this.targetlang) {
      var response = await this.googletranslate(input_text, this.targetlang, this.sourcelang);
      input_text = response.data.translations[0].translatedText;
    }
    if (!IS_DEV_MODE) {
      // if (this.awaiting && this.workflowID != "") {
      if (this.workflowID != "") {
        if (img) {
          // console.log("img:", img);
          this.submituserreply(input_text, this.workflowID, img.map((imgs) => imgs.src));
        } else this.submituserreply(input_text, this.workflowID, img);
      } else {
        this.workflowID = this.sessionID;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = async () => {
          if (xhr.readyState == 4) {
            console.log(xhr.response);
            let text = JSON.parse(xhr.response);
            // console.log(text.stream_id);
            let stream_name = text.stream_id;
            this.getstreamdata(stream_name);
          }
        };

        xhr.addEventListener("error", async function (e) {
          console.log("error: " + e);
          var AIAnswer = "An error occurred while attempting to connect.";
          if (this.sourcelang != "en") {
            var transresponse = await this.googletranslate(
              AIAnswer,
              this.sourcelang,
              this.targetlang
            );
            AIAnswer = transresponse.data.translations[0].translatedText;
          }
          await this.callbacks.addAIText({ text: AIAnswer, container: this.container, targetlang: this.sourcelang });
          this.callbacks.enableInput();
        });
        if (this.sessionID && this.sessionID != "") {
          xhr.open("POST", HOST + "/workflows/conversation", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          if (this.sessionID.startsWith("wf-external-conversation")) {
            xhr.send(
              JSON.stringify({
                session_id: this.sessionID,
                uuid: "omega_" + crypto.randomUUID() + "@iamplus.com",
              })
            );
          } else {
            xhr.send(
              JSON.stringify({
                session_id: this.sessionID,
                // uuid: uuid + "@iamplus.com",
                uuid: this.deploy_ID,
              })
            );
          }
        } else {
          xhr.open("POST", HOST + "/workflows/tasks", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(
            JSON.stringify({
              query: input_text,
              // uuid: uuid + "@iamplus.com",
              uuid: this.user.uuid,
            })
          );
        }
      }
    } else {
      await this.getdevstream("DEV_STREAM");
      // this.getstreamdata("DEV_STREAM");
    }
  };
  getstreamdata = async (stream_name) => {
    let nc = await connect({
      servers: [NATS_URL],
      user: NATS_USER,
      pass: NATS_PASS,
    });

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
      // console.log(m.seq);
      // console.log(m.redelivered);
      if (steamseq.includes(m.seq) && m.redelivered) {
        console.log("prevent duplicate");
        m.ack();
      } else {
        // console.log(mdata);
        steamseq.push(m.seq);
        this.status = mdata.status;
        this.task_name = mdata.task_name;
        // console.timeEnd("RequestStart");
        var mtext = mdata.data;
        // m.ack();

        //get UI and RAG params
        // if (mdata.message_type == "ui" || mdata.message_type == "conversation_question") {
        if (mdata.message_type == "ui") {
          this.domain = mdata.ui_params.domain;
          console.log("domain:" + this.domain);
          if (this.domain == "MovieSearch") {
            this.MovieSearch = JSON.parse(mdata.ui_params.MovieSearch);
            this.MovieSearchResults = JSON.parse(mdata.ui_params.MovieSearchResults);
          } else if (this.domain == "TaxiSearch") {
            this.TaxiSearch = JSON.parse(mdata.ui_params.TaxiSearch);
            this.TaxiSearchResults = JSON.parse(mdata.ui_params.TaxiSearchResults);
          } else if (this.domain == "RAG_CHAT") {
            this.RAG_CHAT = JSON.parse(mdata.ui_params.RAG_CHAT);
            // console.log("domain RAG_CHAT:" + this.RAG_CHAT);
          } else if (this.domain == "FlightSearch") {
            this.FlightSearch = JSON.parse(mdata.ui_params.FlightSearch);
            this.FlightSearchResults = JSON.parse(mdata.ui_params.FlightSearchResults);
          } else if (this.domain == "ProductSearch") {
            this.ProductSearch = JSON.parse(mdata.ui_params.ProductSearch);
            this.ProductSearchResults = JSON.parse(mdata.ui_params.ProductSearchResults);
          }
        } else if (mdata.message_type == "image") {
          this.image_urls = JSON.parse(mdata.ui_params.image_urls);
          this.callbacks.addImages({ imgSrcs: this.image_urls });
        } else if (mdata.message_type == "Sources") {
          this.Sources = JSON.parse(mdata.ui_params.Sources);
          this.callbacks.addSources(this.Sources)
          // Add Call to add sources
        }

        //check if awaiting
        if (mdata.awaiting) {
          this.workflowID = mdata.session_id;
          this.awaiting = true;
        }

        //check if agent is awaiting
        if (mdata.awaiting && mdata.message_type == "user_question") {
          this.agentawaiting = true;
        }

        //generate data
        if (mdata.streaming && mdata.streaming == true) {
          if (mtext.trim().length > 0) {
            var AIAnswer = await this.toTitleCase2(mtext);
            if (this.sourcelang != "en") {
              var transresponse = await this.googletranslate(
                await this.toTitleCase2(mtext),
                this.sourcelang,
                this.targetlang
              );
              AIAnswer = transresponse.data.translations[0].translatedText;
            }
            await this.callbacks.addAIText({ text: AIAnswer, container: this.container, targetlang: this.sourcelang });
          }
          if (mdata.stream_status && mdata.stream_status == "ended") {
            this.callbacks.emitter.emit("endStream");
            // this.callbacks.enableInput();
            // await this.callbacks.addAIText({ text: "\n\n", container: this.container });
          }
          // } else if (mdata.status == "Agent ended") {
          //   this.workflowID = "";
          //   this.awaiting = false;
          //   this.callbacks.enableInput();
          //   return;

          // this is for external conversation
        } else if (mdata.status.toLowerCase() == "agent ended" && mdata.message_type == "system") {
          this.sessionID = "";
          this.deploy_ID = "";
          this.callbacks.addURL({
            text: "",
            label: "Please click here, to start a new session to chat or close the browser.",
            container: this.container,
            url: "./index.html",
          });
          // await this.callbacks.addAIText({ text: "Please click here, to start a new session to chat or close the browser.", type: 'link', container: this.container });
          // textEl.innerHTML = 'Please click <a href="./index.html">here</a>, to start a new session to chat or close the browser.';
        } else if (mdata.awaiting && mdata.message_type != "image" && mdata.message_type != "Sources") {
          console.log("awaiting:" + mdata.message_type);
          console.log("mtext:" + mtext);
          this.workflowID = mdata.session_id;
          this.awaiting = true;
          var AIAnswer = await this.toTitleCase2(mtext);
          console.log("AIAnswer:" + AIAnswer);
          if (this.sourcelang != "en") {
            var transresponse = await this.googletranslate(
              await this.toTitleCase2(mtext),
              this.sourcelang,
              this.targetlang
            );
            AIAnswer = transresponse.data.translations[0].translatedText;
          }
          await this.callbacks.addAIText({ text: AIAnswer, container: this.container, targetlang: this.sourcelang });
          this.callbacks.emitter.emit("endStream");

          if (this.domain == "RAG_CHAT") {
            console.log("here RAG_CHAT:" + this.RAG_CHAT);
            this.getGucciUI();
            (this.domain = ""), (this.RAG_CHAT = "");
          } else if (this.domain == "MovieSearch") {
            this.getMovies();
            (this.domain = ""), (this.MovieSearchResults = ""), (this.MovieSearch = "");
          }
          this.callbacks.enableInput();
        } else if (mdata.status == "central finished") {
          this.callbacks.emitter.emit("centralFinished")
          if (this.domain == "MovieSearch") {
            this.getMovies();
            (this.domain = ""), (this.MovieSearchResults = ""), (this.MovieSearch = "");
          } else if (this.domain == "TaxiSearch") {
            this.getTaxiUI();
            (this.TaxiSearchResults = ""), (this.TaxiSearch = ""), (this.domain = "");
          } else if (this.domain == "FlightSearch") {
            this.getFlightUI();
            (this.FlightSearch = ""), (this.domain = ""), (this.FlightSearchResults = "");
          } else if (this.domain == "ProductSearch") {
            this.getProductUI();
            (this.ProductSearch = ""), (this.domain = ""), (this.ProductSearchResults = "");
          }
        } else if (mdata.message_type == "status") {
          if (mtext != "") {
            var AIAnswer = await this.toTitleCase2(mtext);
            if (this.sourcelang != "en") {
              var transresponse = await this.googletranslate(AIAnswer, this.sourcelang, this.targetlang);
              AIAnswer = transresponse.data.translations[0].translatedText;
            }
            AIAnswer += "\n\n";
            await this.callbacks.addAIText({ text: AIAnswer, container: this.container, targetlang: this.sourcelang, type: "status" });
          }
        } else if (mdata.status.toLowerCase() == "pa end") {
          this.callbacks.enableInput();
          this.callbacks.emitter.emit("paEnd");
        } else if ( mdata.message_type != "system" && mtext.trim().length > 0) { //ADDED THIS FOR conversation_question and other cases.
          var AIAnswer = await this.toTitleCase2(mtext);
          if (this.sourcelang != "en") {
            var transresponse = await this.googletranslate(
              await this.toTitleCase2(mtext),
              this.sourcelang,
              this.targetlang
            );
            AIAnswer = transresponse.data.translations[0].translatedText;
          }
          await this.callbacks.addAIText({ text: AIAnswer, container: this.container, targetlang: this.sourcelang });
        }
        m.ack();
      }
    }
    nc.drain();
  };

  getdevstream = (stream_name) =>
    new Promise(async (resolve, reject) => {
      let nc = await connect({
        servers: [NATS_URL],
        user: NATS_USER,
        pass: NATS_PASS,
      });
      // create the stream
      const jsm = await nc.jetstreamManager();

      const cfg = {
        name: stream_name,
        subjects: ["DEV_STREAM"],
      };

      await jsm.streams.add(cfg);
      await jsm.consumers.add(stream_name, {
        durable_name: stream_name,
        ack_policy: AckPolicy.Explicit,
      });
      const jc = JSONCodec();

      const js = nc.jetstream();
      //   this.pushstramingdata(js);
      this.pushlightdata(js);

      // console.log("published messages");
      // let info = await jsm.streams.info(cfg.name);
      // console.log(info.state);

      resolve("");
    });

  delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  async pushstramingdata(js) {
    const jc = JSONCodec();
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Conversation with user",
        data: " Hello! It's great to hear from you.",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "active",
        message_type: "conversation_question",
        ui_params: {},
        awaiting: true,
        streaming: true,
        stream_status: "started",
      })
    );

    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Conversation with user",
        data: " How can I assist you today?",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "active",
        message_type: "conversation_question",
        ui_params: {},
        awaiting: true,
        streaming: true,
        stream_status: "started",
      })
    );
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Conversation with user",
        data: " Is there anything on your mind that you'd like to talk about?",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "active",
        message_type: "conversation_question",
        ui_params: {},
        awaiting: true,
        streaming: true,
        stream_status: "started",
      })
    );
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Conversation with user",
        data: " ",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "active",
        message_type: "conversation_question",
        ui_params: {},
        awaiting: true,
        streaming: true,
        stream_status: "ended",
      })
    );
  }
  async pushlightdata(js) {
    const jc = JSONCodec();
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Status Push",
        data: "Working on it! Searching the web for the dates you need. . .\n",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "Status Push started",
        message_type: "status",
        ui_params: {},
        awaiting: false,
        streaming: false,
        stream_status: "",
      })
    );
    await this.delay(4000);
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Status Push",
        data: "Finding the date for this Thursday. Stay tuned! . .\n",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "Status Push started",
        message_type: "status",
        ui_params: {},
        awaiting: false,
        streaming: false,
        stream_status: "",
      })
    );
    await this.delay(4000);
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Status Push",
        data: "Searching for the date of the following Monday, please wait. . .\n",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "Status Push started",
        message_type: "status",
        ui_params: {},
        awaiting: false,
        streaming: false,
        stream_status: "",
      })
    );
    await this.delay(4000);
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Status Push",
        data: "Wrapping up the task, all plans executed and completed, task resolved. . .\n",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "Status Push started",
        message_type: "status",
        ui_params: {},
        awaiting: false,
        streaming: false,
        stream_status: "",
      })
    );
    await this.delay(4000);
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Status Push",
        data: "I'm currently searching for the best round-trip flights from Singapore to Bali on your preferred dates. . .\n",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "Status Push started",
        message_type: "status",
        ui_params: {},
        awaiting: false,
        streaming: false,
        stream_status: "",
      })
    );
    await this.delay(4000);
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Status Push",
        data: "Analyzing travel details for flights from Singapore to Bali on Dec 14-18, 2023. . .\n",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "Status Push started",
        message_type: "status",
        ui_params: {},
        awaiting: false,
        streaming: false,
        stream_status: "",
      })
    );
    await this.delay(4000);
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Status Push",
        data: "Finding the best flights for your Singapore-Bali trip, stay tuned! . .\n",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "Status Push started",
        message_type: "status",
        ui_params: {},
        awaiting: false,
        streaming: false,
        stream_status: "",
      })
    );
    await this.delay(4000);
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name:
          "Search for round-trip flights from Singapore to Bali on December 14, 2023, returning on December 18, 2023, including the cheapest options",
        data: "",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "flight_search_booking_tool params and results",
        message_type: "ui",
        ui_params: {
          domain: "FlightSearch",
          FlightSearch:
            '{"departure_start_date": "", "departure_end_date": "2024-12-14", "departure_start_time": "", "departure_end_time": "", "return_start_date": "", "return_end_date": "2023-12-18", "return_start_time": "", "return_end_time": "", "source": "Singapore", "source_airport_name": "Changi Airport", "source_airport_code": "SIN", "destination": "Bali", "destination_airport_name": "Ngurah Rai International Airport", "destination_airport_code": "DPS", "class": "", "num_of_tickets": 1, "sort": "Price", "round_trip": "True", "preferred_airline": null}',
          FlightSearchResults:
            '{"Outbound": [], "Return": [{"website": "skyscanner", "currency": "USD", "price": "$95.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.skyscanner.com/transport/flights/DPS/SIN/231218/?adultsv2=1&childrenv2=&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1&cabinclass=economy", "travel_date": "18-12-2023", "travel": {"airlines": "LionAir Indonesia", "airlines_logo": "http://www.skyscanner.net/images/airlines/small/JT.png", "start_time": "13:50", "end_time": "16:25", "duration": "2h 35", "stops": 0}}, {"website": "kayak", "currency": "USD", "price": "$96.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.kayak.com/flights/DPS-SIN/2023-12-18/economy/1adults?fs=fdDir=true;stops=~0&sort=price_a", "travel_date": "18-12-2023", "travel": {"airlines": "KLM", "airlines_logo": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/KL.png?crop=false&width=108&height=92&fallback=default2.png&_v=c00721138846ce25f134390de9e21708", "start_time": "21:40", "end_time": "00:10", "duration": "2h 30m", "stops": 0}}, {"website": "skyscanner", "currency": "USD", "price": "$96.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.skyscanner.com/transport/flights/DPS/SIN/231218/?adultsv2=1&childrenv2=&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1&cabinclass=economy", "travel_date": "18-12-2023", "travel": {"airlines": "Indonesia AirAsia", "airlines_logo": "http://www.skyscanner.net/images/airlines/small/QZ.png", "start_time": "07:10", "end_time": "09:55", "duration": "2h 45", "stops": 0}}, {"website": "airasia", "currency": "USD", "price": "$96", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.airasia.com/flights/search/?origin=DPS&destination=SIN&departDate=18/12/2023&child=0&infant=0&locale=en-gb&currency=USD&airlineProfile=k,g&type=bundled&isOC=false&isDC=false&uce=false&ancillaryAbTest=true&adult=1&cabinClass=economy&tripType=O", "travel_date": "18-12-2023", "travel": {"airlines": " Batik Air", "airlines_logo": "https://static.airasia.com/flights/images/airlines/logos/64/ID.png?default=airline.png&key=0.18836108081040548_1702572090186", "start_time": "13:50", "end_time": "16:25", "duration": "2h 35m", "stops": 0}}, {"website": "skyscanner", "currency": "USD", "price": "$97.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.skyscanner.com/transport/flights/DPS/SIN/231218/?adultsv2=1&childrenv2=&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1&cabinclass=economy", "travel_date": "18-12-2023", "travel": {"airlines": "KLM", "airlines_logo": "http://www.skyscanner.net/images/airlines/small/KL.png", "start_time": "21:40", "end_time": "00:10", "duration": "2h 30", "stops": 0}}, {"website": "skyscanner", "currency": "USD", "price": "$97.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.skyscanner.com/transport/flights/DPS/SIN/231218/?adultsv2=1&childrenv2=&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1&cabinclass=economy", "travel_date": "18-12-2023", "travel": {"airlines": "Jetstar", "airlines_logo": "http://www.skyscanner.net/images/airlines/small/JQ.png", "start_time": "10:45", "end_time": "13:25", "duration": "2h 40", "stops": 0}}, {"website": "kayak", "currency": "USD", "price": "$99.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.kayak.com/flights/DPS-SIN/2023-12-18/economy/1adults?fs=fdDir=true;stops=~0&sort=price_a", "travel_date": "18-12-2023", "travel": {"airlines": "Indonesia AirAsia", "airlines_logo": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/QZ.png?crop=false&width=108&height=92&fallback=default1.png&_v=2b88720c140bed98f0c9fc7a63612fed", "start_time": "07:10", "end_time": "09:55", "duration": "2h 45m", "stops": 0}}, {"website": "expedia", "currency": "USD", "price": "$100.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.expedia.com/Flights-Search?flight-type=on&leg1=from:DPS,to:SIN,departure:12/18/2023TANYT&mode=search&passengers=adults:1,infantinlap:N&trip=oneway&sortOrder=INCREASING&sortType=CHEAPEST&options=cabinclass:economy", "travel_date": "18-12-2023", "travel": {"airlines": "Indonesia AirAsia", "airlines_logo": "https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/QZ_sq.svg", "start_time": "07:10", "end_time": "09:55", "duration": "2h 45m ", "stops": 0}}, {"website": "kayak", "currency": "USD", "price": "$101.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.kayak.com/flights/DPS-SIN/2023-12-18/economy/1adults?fs=fdDir=true;stops=~0&sort=price_a", "travel_date": "18-12-2023", "travel": {"airlines": "Batik Air", "airlines_logo": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/ID.png?crop=false&width=108&height=92&fallback=default1.png&_v=8bb7f65340e1b6513de5f3e58f53a4b9", "start_time": "13:50", "end_time": "16:25", "duration": "2h 35m", "stops": 0}}, {"website": "skyscanner", "currency": "USD", "price": "$101.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.skyscanner.com/transport/flights/DPS/SIN/231218/?adultsv2=1&childrenv2=&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1&cabinclass=economy", "travel_date": "18-12-2023", "travel": {"airlines": "BatikAir Indonesia", "airlines_logo": "http://www.skyscanner.net/images/airlines/small/ID.png", "start_time": "13:50", "end_time": "16:25", "duration": "2h 35", "stops": 0}}, {"website": "expedia", "currency": "USD", "price": "$101.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.expedia.com/Flights-Search?flight-type=on&leg1=from:DPS,to:SIN,departure:12/18/2023TANYT&mode=search&passengers=adults:1,infantinlap:N&trip=oneway&sortOrder=INCREASING&sortType=CHEAPEST&options=cabinclass:economy", "travel_date": "18-12-2023", "travel": {"airlines": "Jetstar Asia", "airlines_logo": "https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/3K_sq.svg", "start_time": "10:45", "end_time": "13:25", "duration": "2h 40m ", "stops": 0}}, {"website": "airasia", "currency": "USD", "price": "$103", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.airasia.com/flights/search/?origin=DPS&destination=SIN&departDate=18/12/2023&child=0&infant=0&locale=en-gb&currency=USD&airlineProfile=k,g&type=bundled&isOC=false&isDC=false&uce=false&ancillaryAbTest=true&adult=1&cabinClass=economy&tripType=O", "travel_date": "18-12-2023", "travel": {"airlines": " KLM Royal Dutch Airlines", "airlines_logo": "https://static.airasia.com/flights/images/airlines/logos/64/KL.png?default=airline.png&key=0.18836108081040548_1702572090186", "start_time": "21:40", "end_time": "00:10", "duration": "2h 30m", "stops": 0}}, {"website": "booking", "currency": "USD", "price": "$103.38", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://flights.booking.com/flights/DPS.AIRPORT-SIN.AIRPORT/?adults=1&children=&from=DPS.AIRPORT&to=SIN.AIRPORT&depart=2023-12-18&sort=CHEAPEST&cabinClass=ECONOMY&type=ONEWAY", "travel_date": "18-12-2023", "travel": {"airlines": "Batik Air Indonesia", "airlines_logo": "https://r-xx.bstatic.com/data/airlines_logo/ID.png", "start_time": "13:50", "end_time": "16:25", "duration": "2h 35m", "stops": 0}}, {"website": "booking", "currency": "USD", "price": "$104.17", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://flights.booking.com/flights/DPS.AIRPORT-SIN.AIRPORT/?adults=1&children=&from=DPS.AIRPORT&to=SIN.AIRPORT&depart=2023-12-18&sort=CHEAPEST&cabinClass=ECONOMY&type=ONEWAY", "travel_date": "18-12-2023", "travel": {"airlines": "KLM", "airlines_logo": "https://r-xx.bstatic.com/data/airlines_logo/KL.png", "start_time": "21:40", "end_time": "00:10", "duration": "2h 30m", "stops": 0}}, {"website": "kayak", "currency": "USD", "price": "$107.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.kayak.com/flights/DPS-SIN/2023-12-18/economy/1adults?fs=fdDir=true;stops=~0&sort=price_a", "travel_date": "18-12-2023", "travel": {"airlines": "Jetstar Asia", "airlines_logo": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/3K.png?crop=false&width=108&height=92&fallback=default1.png&_v=8afe46d7f75c92f0bff8ca0d36ea9be9", "start_time": "10:45", "end_time": "13:25", "duration": "2h 40m", "stops": 0}}, {"website": "airasia", "currency": "USD", "price": "$108", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.airasia.com/flights/search/?origin=DPS&destination=SIN&departDate=18/12/2023&child=0&infant=0&locale=en-gb&currency=USD&airlineProfile=k,g&type=bundled&isOC=false&isDC=false&uce=false&ancillaryAbTest=true&adult=1&cabinClass=economy&tripType=O", "travel_date": "18-12-2023", "travel": {"airlines": " Jetstar Asia Airways", "airlines_logo": "https://static.airasia.com/flights/images/airlines/logos/64/3K.png?default=airline.png&key=0.18836108081040548_1702572090186", "start_time": "10:45", "end_time": "13:25", "duration": "2h 40m", "stops": 0}}, {"website": "kayak", "currency": "USD", "price": "$109.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.kayak.com/flights/DPS-SIN/2023-12-18/economy/1adults?fs=fdDir=true;stops=~0&sort=price_a", "travel_date": "18-12-2023", "travel": {"airlines": "Jetstar Asia", "airlines_logo": "https://content.r9cdn.net/rimg/provider-logos/airlines/v/3K.png?crop=false&width=108&height=92&fallback=default1.png&_v=8afe46d7f75c92f0bff8ca0d36ea9be9", "start_time": "19:25", "end_time": "22:10", "duration": "2h 45m", "stops": 0}}, {"website": "skyscanner", "currency": "USD", "price": "$110.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.skyscanner.com/transport/flights/DPS/SIN/231218/?adultsv2=1&childrenv2=&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1&cabinclass=economy", "travel_date": "18-12-2023", "travel": {"airlines": "Jetstar", "airlines_logo": "http://www.skyscanner.net/images/airlines/small/JQ.png", "start_time": "19:25", "end_time": "22:10", "duration": "2h 45", "stops": 0}}, {"website": "booking", "currency": "USD", "price": "$112.72", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://flights.booking.com/flights/DPS.AIRPORT-SIN.AIRPORT/?adults=1&children=&from=DPS.AIRPORT&to=SIN.AIRPORT&depart=2023-12-18&sort=CHEAPEST&cabinClass=ECONOMY&type=ONEWAY", "travel_date": "18-12-2023", "travel": {"airlines": "Jetstar Asia", "airlines_logo": "https://r-xx.bstatic.com/data/airlines_logo/3K.png", "start_time": "10:45", "end_time": "13:25", "duration": "2h 40m", "stops": 0}}, {"website": "expedia", "currency": "USD", "price": "$114.0", "airport1_code": "DPS", "airport2_code": "SIN", "airport1_name": "Ngurah Rai (Bali) International Airport", "airport2_name": "Singapore Changi International Airport", "number_of_tickets": 1, "travel_type": "Return", "cabin_type": "economy", "link_url": "https://www.expedia.com/Flights-Search?flight-type=on&leg1=from:DPS,to:SIN,departure:12/18/2023TANYT&mode=search&passengers=adults:1,infantinlap:N&trip=oneway&sortOrder=INCREASING&sortType=CHEAPEST&options=cabinclass:economy", "travel_date": "18-12-2023", "travel": {"airlines": "Jetstar Asia", "airlines_logo": "https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/3K_sq.svg", "start_time": "19:25", "end_time": "22:10", "duration": "2h 45m ", "stops": 0}}]}',
        },
        awaiting: false,
        streaming: false,
        stream_status: "",
      })
    );
    await this.delay(4000);
    await js.publish(
      "DEV_STREAM",
      jc.encode({
        session_id:
          "wf-personal_assistant-7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405-a7d3f581-8a9f-44fa-b77b-5ead185531d8",
        task_name: "Status Push",
        data: "Finalizing the planner flow, all plans are complete. Task is resolved. . .\n",
        uuid: "7d5f4251-02e6-43a2-9770-17c7c13a9834_117821391875821748405",
        status: "Status Push started",
        message_type: "status",
        ui_params: {},
        awaiting: false,
        streaming: false,
        stream_status: "",
      })
    );
  }

  translate = (text, lang) =>
    new Promise(async (resolve, reject) => {
      var data = JSON.stringify([{ text: text }]);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          var response = JSON.parse(this.responseText);
          resolve(response);
        }
      });
      xhr.open("POST", "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" + lang);
      xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "dd0450eaa72d4b628c901af99e551c8a");
      xhr.setRequestHeader("Ocp-Apim-Subscription-Region", "centralindia");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.addEventListener("error", function (e) {
        console.log("error: " + e);
        reject(e);
      });
      xhr.send(data);
    });
  googletranslate = (text, lang, sourcelang) =>
    new Promise(async (resolve, reject) => {
      var xhr = new XMLHttpRequest();
      var url = "https://translation.googleapis.com/language/translate/v2";
      var apiKey = "AIzaSyC1I58b1AR5z5V0b32ROnw55iFUjVso5dY";

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

      var data = JSON.stringify({
        q: text,
        target: lang,
        source: sourcelang,
      });

      xhr.send(data);
    });
  toTitleCase(str) {
    str = str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    // str = str
    //   .replace(/&/g, "&amp;")
    //   .replace(/</g, "&lt;")
    //   .replace(/>/g, "&gt;")
    //   .replace(/'/g, "&#39;")
    //   .replace(/"/g, "&#34;");
    str = str.replaceAll("\n", "<br>");
    return str;
  }
  toTitleCase2(str) {
    // str = str
    //   .replace(/&/g, "&amp;")
    //   .replace(/</g, "&lt;")
    //   .replace(/>/g, "&gt;")
    //   .replace(/'/g, "&#39;")
    //   .replace(/"/g, "&#34;");
    str = str.replaceAll("\n", "<br>");
    return str;
  }
  truncate(str) {
    var n = 200;
    return str && str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
  }
  submituserreply(text, suworkflowid, img) {
    var data = "";
    if (img && img.length > 0) {
      data = JSON.stringify({
        message_type: "user_reply",
        user: "User",
        message: {
          type: "text",
          json: {},
          text: text,
        },
        user_data: {
          type: "image",
          url: img,
        },
      });
    } else {
      data = JSON.stringify({
        message_type: "user_reply",
        user: "User",
        message: {
          type: "text",
          json: {},
          text: text,
        },
      });
    }

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        console.time("RequestStart");
      }
    });

    xhr.open("POST", HOST + "/workflows/message/" + suworkflowid);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  }

  updateTextContainer(){
    this.textContainer = this.container.querySelector(".text__container")

    if (!this.textContainer){
      this.textContainer = document.createElement("div");
      this.textContainer.className = "text__container";
      this.container.appendChild(this.textContainer);
    }
  }

  getMovies() {
    const moviesdiv = document.createElement("div");
    const moviescardcontainerdiv = document.createElement("div");
    moviescardcontainerdiv.className = "moviescard-container";

    this.MovieSearchResults.forEach((element) => {
      const moviescarddiv = document.createElement("div");
      moviescarddiv.className = "movies-card";
      moviescarddiv.setAttribute("data-info", "movies-details");
      moviescarddiv.setAttribute("data-details", JSON.stringify(element).replace(/'/g, "&#39;"));
      moviescarddiv.addEventListener("click", (event) => this.showMovieDetail(event));
      const moviesimg = document.createElement("img");
      moviesimg.className = "movies-image";
      moviesimg.setAttribute("alt", element.MovieTitle.replace(/'/g, "&#39;"));
      moviesimg.setAttribute("src", element.MoviePoster);
      moviescarddiv.appendChild(moviesimg);
      const moviestitlep = document.createElement("p");
      moviestitlep.className = "movies-title";
      moviestitlep.innerText = element.MovieTitle;
      moviescarddiv.appendChild(moviestitlep);
      moviescardcontainerdiv.appendChild(moviescarddiv);
    });
    moviesdiv.appendChild(moviescardcontainerdiv);
    const moviedetailsdiv = document.createElement("div");
    moviedetailsdiv.setAttribute("id", "movie-details");
    moviesdiv.appendChild(moviedetailsdiv);

    this.updateTextContainer()
    this.textContainer.appendChild(moviesdiv);
  }

  showMovieDetail(event) {
    let element = event.target;
    let moviedetail = element.parentElement.parentElement.parentElement.querySelector("#movie-details");
    moviedetail.innerHTML = "";
    let moviedetaildata = JSON.parse(element.parentElement.getAttribute("data-details").replace("&#39;", /'/g));
    // let divinnerhtml = "";
    moviedetaildata.Theatre.forEach((theatre) => {
      const moviedetailscarddiv = document.createElement("div");
      moviedetailscarddiv.className = "movie-details-card";
      const moviedetailstheaterdiv = document.createElement("div");
      moviedetailstheaterdiv.className = "movie-details-theater-header";
      moviedetailstheaterdiv.innerHTML = theatre.Name;
      moviedetailscarddiv.appendChild(moviedetailstheaterdiv);
      const moviedetailsdatesdiv = document.createElement("div");
      moviedetailsdatesdiv.className = "movie-details-dates";
      moviedetailsdatesdiv.setAttribute("data-details", JSON.stringify(theatre).replace(/'/g, "&#39;"));
      this.getMoviesDateShowtime(moviedetaildata.MovieTitle, theatre, theatre.DateTime[0].Date, moviedetailsdatesdiv);
      console.log(moviedetaildata.MovieTitle);
      moviedetailscarddiv.appendChild(moviedetailsdatesdiv);
      moviedetail.appendChild(moviedetailscarddiv);
    });
    this.scrollToDiv(moviedetail);
  }

  scrollToDiv(element) {
    let divOffset = 0;
    let currentElement = element;
    // Fix to compute the proper disctance from this.discussionContainer
    while (currentElement && this.discussionContainer.contains(currentElement)) {
      divOffset += currentElement.offsetTop;
      currentElement = currentElement.offsetParent;
    }
    this.discussionContainer.scrollTo({
      top: divOffset,
      behavior: "smooth",
    });
  }

  getMoviesDateShowtime(MovieTitle, theatre, date, moviedetailsdatesdiv) {
    const moviedetailsdateselectordiv = document.createElement("div");
    moviedetailsdateselectordiv.className = "movie-details-date-selector";
    const moviedetailsdateleftbuttonbutton = document.createElement("button");
    moviedetailsdateleftbuttonbutton.className = "arrow left-arrow";
    moviedetailsdateleftbuttonbutton.innerHTML = "&lt;&nbsp;&nbsp;";
    moviedetailsdateleftbuttonbutton.addEventListener("click", (event) =>
      this.getmovieshowtimes(event, -1, MovieTitle)
    );
    if (theatre.DateTime[0].Date == date) moviedetailsdateleftbuttonbutton.disabled = true;
    moviedetailsdateselectordiv.appendChild(moviedetailsdateleftbuttonbutton);

    const moviedetailsdatespan = document.createElement("span");
    moviedetailsdatespan.innerText = date;
    moviedetailsdateselectordiv.appendChild(moviedetailsdatespan);

    const moviedetailsdaterightbuttonbutton = document.createElement("button");
    moviedetailsdaterightbuttonbutton.className = "arrow right-arrow";
    moviedetailsdaterightbuttonbutton.innerHTML = "&nbsp;&nbsp;&gt;";
    moviedetailsdaterightbuttonbutton.addEventListener("click", (event) =>
      this.getmovieshowtimes(event, 1, MovieTitle)
    );
    if (theatre.DateTime[theatre.DateTime.length - 1].Date == date) moviedetailsdaterightbuttonbutton.disabled = true;
    moviedetailsdateselectordiv.appendChild(moviedetailsdaterightbuttonbutton);
    moviedetailsdatesdiv.appendChild(moviedetailsdateselectordiv);

    theatre.DateTime.forEach((moviesdatetime) => {
      if (moviesdatetime.Date == date) {
        const moviedetailsshowtimesdiv = document.createElement("div");
        moviedetailsshowtimesdiv.className = "movie-details-showtimes";
        moviesdatetime.Show.forEach((moviestime) => {
          const moviedetailsshowtimebutton = document.createElement("button");
          moviedetailsshowtimebutton.className = "movie-details-showtime";
          moviedetailsshowtimebutton.innerHTML = moviestime.Time.slice(0, -3);
          moviedetailsshowtimebutton.setAttribute("onclick", "window.open('" + moviestime.BookingUrl + "', '_blank');");
          // moviedetailsshowtimebutton.addEventListener("click", (event) =>
          //   this.submitmovieselection(MovieTitle, theatre.Name, moviesdatetime.Date, moviestime.Time.slice(0, -3),moviestime.BookingUrl)
          // );
          moviedetailsshowtimesdiv.appendChild(moviedetailsshowtimebutton);
        });
        moviedetailsdatesdiv.appendChild(moviedetailsshowtimesdiv);
      }
    });
  }

  getmovieshowtimes(event, day, MovieTitle) {
    let element = event.target;
    let moviedetail = element.parentElement.parentElement.parentElement.querySelector(".movie-details-dates");
    let moviedetaildata = JSON.parse(moviedetail.getAttribute("data-details").replace("&#39;", /'/g));
    if (day == 1) {
      const previousSiblingSpan =
        element.previousElementSibling.tagName === "SPAN" ? element.previousElementSibling : null;
      let date = new Date(previousSiblingSpan.innerHTML);
      date.setDate(date.getDate() + 1);
      moviedetail.innerHTML = "";
      this.getMoviesDateShowtime(MovieTitle, moviedetaildata, date.toISOString().slice(0, 10), moviedetail);
    } else {
      const nextSiblingSpan = element.nextElementSibling.tagName === "SPAN" ? element.nextElementSibling : null;
      let date = new Date(nextSiblingSpan.innerHTML);
      date.setDate(date.getDate() - 1);
      moviedetail.innerHTML = "";
      this.getMoviesDateShowtime(MovieTitle, moviedetaildata, date.toISOString().slice(0, 10), moviedetail);
    }
  }

  async submitmovieselection(MovieTitle, Theatre, Date, Time, BookingUrl) {
    MovieTitle = MovieTitle.replace("’", "'");
    if (this.agentawaiting) {
      var texttosend =
        "book movie ticket for " +
        JSON.stringify({
          movie_name: MovieTitle,
          theatre_name: Theatre,
          movie_date: Date,
          movie_time: Time,
        });
      var data = JSON.stringify({
        message_type: "user_reply",
        user: "User",
        message: {
          type: "text",
          json: {},
          text: texttosend,
        },
      });

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });

      xhr.open("POST", HOST + "/workflows/message/" + this.workflowID);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.send(data);
      this.agentawaiting = false;
    } else {
      var texttosend =
        "book movie ticket for " +
        JSON.stringify({
          movie_name: MovieTitle,
          theatre_name: Theatre,
          movie_date: Date,
          movie_time: Time,
        });
      console.log("texttosend:" + texttosend);
      this.callsubmit(texttosend, "", this.container);
    }
  }

  getTaxiUI() {
    const taxidiv = document.createElement("div");
    taxidiv.className = "rides-list-wrapper";

    let data = this.TaxiSearchResults;
    for (let taxii = 0; taxii < data.services.length; taxii++) {
      let service = data.services[taxii];
      if (service) {
        const rideslistitemdiv = document.createElement("div");
        rideslistitemdiv.className = "rides-list-item";
        taxidiv.appendChild(rideslistitemdiv);
        const rideslistitemheaderdiv = document.createElement("div");
        rideslistitemheaderdiv.className = "rides-list-item-header";
        rideslistitemdiv.appendChild(rideslistitemheaderdiv);
        const rideslistitemheaderlogo = document.createElement("figure");
        rideslistitemheaderlogo.className = "rides-list-item-header-logo";
        rideslistitemheaderdiv.appendChild(rideslistitemheaderlogo);
        const rideslistitemheaderlogoimg = document.createElement("img");
        rideslistitemheaderlogoimg.setAttribute("src", "./images/logo/" + service.provider + "-logo.svg");
        rideslistitemheaderlogoimg.setAttribute("alt", service.provider);
        rideslistitemheaderlogo.appendChild(rideslistitemheaderlogoimg);
        const rideslistitemheaderinfodiv = document.createElement("div");
        rideslistitemheaderinfodiv.className = "rides-list-item-header-info";
        const rideslistitemheaderinfodivp = document.createElement("p");
        if (service.name.includes("TAXI_HAILING")) rideslistitemheaderinfodivp.innerHTML = "Taxi Hailing";
        else rideslistitemheaderinfodivp.innerHTML = service.name;

        rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfodivp);
        const rideslistitemheaderinfodescriptionp = document.createElement("p");
        rideslistitemheaderinfodescriptionp.innerHTML = service.description;
        rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfodescriptionp);
        const rideslistitemheaderinfoseatsp = document.createElement("p");
        rideslistitemheaderinfoseatsp.innerHTML = service.seats;
        rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfoseatsp);
        if (service.deeplink) {
          const rideslistitemheaderinfollink = document.createElement("a");
          rideslistitemheaderinfollink.setAttribute("href", service.deeplink);
          rideslistitemheaderinfollink.setAttribute("target", "_blank");
          rideslistitemheaderinfollink.innerHTML = "Link";
          rideslistitemheaderinfodiv.appendChild(rideslistitemheaderinfollink);
        }
        rideslistitemheaderdiv.appendChild(rideslistitemheaderinfodiv);
        // rideslistitemdiv.appendChild(rideslistitemheaderdiv)
        const rideslistitemcontentdiv = document.createElement("div");
        rideslistitemcontentdiv.className = "rides-list-item-content";

        const rideslistitemcontentpricesdiv = document.createElement("div");
        rideslistitemcontentpricesdiv.className = "rides-list-item-content-prices";
        if (service.price) {
          if (service.price.length > 1) {
            const ridespricespan1 = document.createElement("span");
            ridespricespan1.innerText = "$";
            rideslistitemcontentpricesdiv.appendChild(ridespricespan1);
            const ridespricespan2 = document.createElement("span");
            ridespricespan2.innerText = service.price[0] + "-" + service.price[1];
            rideslistitemcontentpricesdiv.appendChild(ridespricespan2);

            if (taxii == 0) {
              const ridespricecheapestspan = document.createElement("span");
              ridespricecheapestspan.className = "rides-list-item-content-sticker";
              ridespricecheapestspan.innerText = "cheapest";
              rideslistitemcontentdiv.appendChild(ridespricecheapestspan);
            }
          } else {
            const ridespricespan1 = document.createElement("span");
            ridespricespan1.innerText = "$";
            rideslistitemcontentpricesdiv.appendChild(ridespricespan1);
            const ridespricespan2 = document.createElement("span");
            ridespricespan2.innerText = service.price;
            rideslistitemcontentpricesdiv.appendChild(ridespricespan2);

            if (taxii == 0) {
              const ridespricecheapestspan = document.createElement("span");
              ridespricecheapestspan.className = "rides-list-item-content-sticker";
              ridespricecheapestspan.innerText = "cheapest";
              rideslistitemcontentdiv.appendChild(ridespricecheapestspan);
            }
          }
        } else {
          const ridespricespan1 = document.createElement("span");
          const ridespricespan2 = document.createElement("span");
          rideslistitemcontentpricesdiv.appendChild(ridespricespan1);
          rideslistitemcontentpricesdiv.appendChild(ridespricespan2);
        }
        rideslistitemcontentdiv.appendChild(rideslistitemcontentpricesdiv);
        rideslistitemdiv.appendChild(rideslistitemcontentdiv);
        // rideslistitemheaderdiv.appendChild(rideslistitemheaderinfodiv);
        taxidiv.appendChild(rideslistitemdiv);
        
        this.updateTextContainer()
        this.textContainer.appendChild(taxidiv);
      }
    }
  }

  getFlightUI() {
    const FlightContainerdiv = document.createElement("div");
    FlightContainerdiv.className = "FlightContainer Flight-Container";
    FlightContainerdiv.setAttribute("name", "flightResult");

    if (this.FlightSearch.departure_end_date.length > 0 && this.FlightSearch.return_end_date.length > 0) {
      const flighttogglebuttoncontainerdiv = document.createElement("div");
      flighttogglebuttoncontainerdiv.className = "flight-toggle-button-container";
      FlightContainerdiv.appendChild(flighttogglebuttoncontainerdiv);

      const flighttogglebutton = document.createElement("button");
      flighttogglebutton.className = "flight-toggle-button active";
      flighttogglebutton.addEventListener("click", (event) => this.toggleflights(event));
      flighttogglebutton.innerHTML = "Outbound";
      flighttogglebutton.id = "Outbound";
      flighttogglebuttoncontainerdiv.appendChild(flighttogglebutton);

      const flighttogglebutton2 = document.createElement("button");
      flighttogglebutton2.className = "flight-toggle-button";
      flighttogglebutton2.addEventListener("click", (event) => this.toggleflights(event));
      flighttogglebutton2.id = "Return";
      flighttogglebutton2.innerHTML = "Return";
      flighttogglebuttoncontainerdiv.appendChild(flighttogglebutton2);
    }
    let FlightSearchResultsArr = this.FlightSearchResults.Outbound;
    for (let flightsi = 0; flightsi < 2; flightsi++) {
      if (flightsi == 1) FlightSearchResultsArr = this.FlightSearchResults.Return;
      if (FlightSearchResultsArr.length > 0) {
        const flightResultdiv = document.createElement("div");
        flightResultdiv.className = "flightResult";
        if (flightsi == 0) {
          flightResultdiv.className = "flightResult";
          flightResultdiv.setAttribute("id", "flightResultOutbound");
          FlightContainerdiv.appendChild(flightResultdiv);
        }
        if (flightsi == 1) {
          flightResultdiv.setAttribute("id", "flightResultReturn");
          flightResultdiv.setAttribute("style", "display:None");
          FlightContainerdiv.appendChild(flightResultdiv);
        }
        let flightcheapest = 0;
        FlightSearchResultsArr.forEach((FlightSearchResult) => {
          const flightCarddiv = document.createElement("div");
          flightCarddiv.className = "flightCard";
          flightCarddiv.setAttribute("onclick", "window.open('" + FlightSearchResult.link_url + "', '_blank');");
          flightResultdiv.appendChild(flightCarddiv);

          const rowFlightCarddiv = document.createElement("div");
          rowFlightCarddiv.className = "rowFlightCard";
          flightCarddiv.appendChild(rowFlightCarddiv);
          const logoFightdiv = document.createElement("div");
          logoFightdiv.className = "logoFight";
          rowFlightCarddiv.appendChild(logoFightdiv);
          const logoFightdivdiv = document.createElement("div");
          logoFightdiv.appendChild(logoFightdivdiv);

          const flightlogoimg = document.createElement("img");
          // flightlogoimg.setAttribute("src", FlightSearchResult.travel.airlines_logo);
          flightlogoimg.setAttribute(
            "src",
            FlightSearchResult.travel.airlines_logo ? FlightSearchResult.travel.airlines_logo : "./images/flight.jpg"
          );
          flightlogoimg.setAttribute("style", "height: 40px;mix-blend-mode: multiply;");
          logoFightdivdiv.appendChild(flightlogoimg);

          const flghtCostdiv = document.createElement("div");
          flghtCostdiv.className = "flghtCost";
          rowFlightCarddiv.appendChild(flghtCostdiv);

          const flghtCostspan = document.createElement("span");
          flghtCostspan.className = "currency";
          flghtCostspan.innerHTML = "USD";
          flghtCostdiv.appendChild(flghtCostspan);

          const flghtCostP = document.createElement("p");
          flghtCostP.className = "big";
          flghtCostP.innerHTML = FlightSearchResult.price.split("$")[1];
          flghtCostdiv.appendChild(flghtCostP);

          const rowFlightCarddiv2 = document.createElement("div");
          rowFlightCarddiv2.className = "rowFlightCard";
          flightCarddiv.appendChild(rowFlightCarddiv2);

          const startdiv = document.createElement("div");
          startdiv.className = "start";
          rowFlightCarddiv2.appendChild(startdiv);

          const flghtairportsourcespan = document.createElement("span");
          flghtairportsourcespan.innerHTML = FlightSearchResult.airport1_code;
          startdiv.appendChild(flghtairportsourcespan);

          const flghtdurationP = document.createElement("p");
          flghtdurationP.className = "big";
          flghtdurationP.innerHTML =
            FlightSearchResult.travel.start_time.split("\n")[0] +
            (FlightSearchResult.travel.start_time.split("\n")[1]
              ? '<span class="small">' + FlightSearchResult.travel.start_time.split("\n")[1] + "</span>"
              : "");
          startdiv.appendChild(flghtdurationP);

          const durationdiv = document.createElement("div");
          durationdiv.className = "duration";
          rowFlightCarddiv2.appendChild(durationdiv);

          const timeHourMinP = document.createElement("p");
          timeHourMinP.className = "timeHourMin";
          timeHourMinP.innerHTML =
            FlightSearchResult.travel.duration.split("h")[0] +
            '<span style="color: rgba(0, 0, 0, 0.40);">h</span> ' +
            FlightSearchResult.travel.duration.substring(
              FlightSearchResult.travel.duration.indexOf(" "),
              FlightSearchResult.travel.duration.indexOf("m")
            ) +
            '<span style="color: rgba(0, 0, 0, 0.40);">m</span>';
          durationdiv.appendChild(timeHourMinP);

          const dDirectiondiv = document.createElement("div");
          dDirectiondiv.className = "dDirection";
          durationdiv.appendChild(dDirectiondiv);

          let flightsresultsstr =
            '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.053 15.5789L12 24L10 24L12.526 15.5789L7.166 15.5789L5.5 18.7368L4 18.7368L5 14L4 9.26316L5.5 9.26316L7.167 12.4211L12.527 12.4211L10 4L12 4L17.053 12.4211L22.5 12.4211C22.8978 12.4211 23.2794 12.5874 23.5607 12.8835C23.842 13.1796 24 13.5812 24 14C24 14.4188 23.842 14.8204 23.5607 15.1165C23.2794 15.4126 22.8978 15.5789 22.5 15.5789L17.053 15.5789Z" fill="black" fill-opacity="0.4"/></svg>';
          if (FlightSearchResult.travel.stops == 0) {
            flightsresultsstr +=
              '<svg xmlns="http://www.w3.org/2000/svg" width="152" height="28" viewBox="0 0 152 28" fill="none">';
            flightsresultsstr +=
              '<line x1="0.6" y1="13.4" x2="151.4" y2="13.4" stroke="black" stroke-opacity="0.4" stroke-width="1.2"';
            flightsresultsstr += 'stroke-linecap="round" stroke-dasharray="0.1 4" />';
            flightsresultsstr += "</svg>";
          } else {
            flightsresultsstr +=
              '<svg width="136" height="28" viewBox="0 0 136 28" fill="none" xmlns="http://www.w3.org/2000/svg">';
            flightsresultsstr +=
              '<line x1="0.6" y1="13.4" x2="58.4" y2="13.4" stroke="black" stroke-opacity="0.4" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="0.1 4"/>';
            flightsresultsstr += '<g clip-path="url(#clip0_10855_133720)">';
            flightsresultsstr +=
              '<circle cx="68" cy="14" r="3.00002" stroke="black" stroke-opacity="0.4" stroke-width="1.50001"/>';
            flightsresultsstr += "</g>";
            flightsresultsstr +=
              '<line x1="77.1" y1="13.4" x2="134.9" y2="13.4" stroke="black" stroke-opacity="0.4" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="0.1 4"/>';
            flightsresultsstr += "<defs>";
            flightsresultsstr += '<clipPath id="clip0_10855_133720">';
            flightsresultsstr += '<rect width="18" height="28" fill="white" transform="translate(58.5)"/>';
            flightsresultsstr += "</clipPath>";
            flightsresultsstr += "</defs>";
            flightsresultsstr += "</svg>";
          }
          flightsresultsstr +=
            '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">';
          flightsresultsstr += '<circle cx="9.50002" cy="10.0001" r="3.75002" fill="black" fill-opacity="0.4" />';
          flightsresultsstr += "</svg>";
          durationdiv.innerHTML = flightsresultsstr;

          const directionstopsP = document.createElement("p");
          directionstopsP.className = "dDirection";

          if (FlightSearchResult.travel.stops == 0) {
            directionstopsP.innerHTML = "Direct";
          } else if (FlightSearchResult.travel.stops == 1) {
            directionstopsP.innerHTML = FlightSearchResult.travel.stops + " connection";
          } else {
            directionstopsP.innerHTML = FlightSearchResult.travel.stops + " connections";
          }
          durationdiv.appendChild(directionstopsP);

          const destinationdiv = document.createElement("div");
          destinationdiv.className = "destination";
          rowFlightCarddiv2.appendChild(destinationdiv);

          const destinationdivspan = document.createElement("span");
          destinationdivspan.innerHTML = FlightSearchResult.airport2_code;
          destinationdiv.appendChild(destinationdivspan);

          const destinationdivP = document.createElement("p");
          destinationdivP.className = "big";
          destinationdivP.innerHTML =
            FlightSearchResult.travel.end_time.split("\n")[0] +
            (FlightSearchResult.travel.end_time.split("\n")[1]
              ? '<span class="small">' + FlightSearchResult.travel.end_time.split("\n")[1] + "</span>"
              : "");
          destinationdiv.appendChild(destinationdivP);

          if (flightcheapest == 0) {
            const recommanddiv = document.createElement("div");
            recommanddiv.className = "recommand";
            recommanddiv.innerHTML = "CHEAPEST";
            flightCarddiv.appendChild(recommanddiv);
          }
          const sitediv = document.createElement("div");
          sitediv.className = "site";
          sitediv.innerHTML = FlightSearchResult.website;
          flightCarddiv.appendChild(sitediv);
          flightcheapest++;
        });
      }
    }

    this.updateTextContainer();
    this.textContainer.append(FlightContainerdiv)
  }

  toggleflights(event) {
    let element = event.target;
    if (element.id == "Outbound") {
      element.classList.add("active");
      element.parentElement.querySelector("#Return").classList.remove("active");
      element.parentElement.parentElement.querySelector("#flightResultOutbound").style.display = "flex";
      element.parentElement.parentElement.querySelector("#flightResultReturn").style.display = "none";
    } else {
      element.classList.add("active");
      element.parentElement.querySelector("#Outbound").classList.remove("active");
      element.parentElement.parentElement.querySelector("#flightResultOutbound").style.display = "none";
      element.parentElement.parentElement.querySelector("#flightResultReturn").style.display = "flex";
    }
  }

  getGucciUI() {
    const productdiv = document.createElement("div");
    const productcardcontainerdiv = document.createElement("div");
    productcardcontainerdiv.className = "productcard-container";
    productdiv.appendChild(productcardcontainerdiv);

    this.RAG_CHAT.forEach((element) => {
      const productcarddiv = document.createElement("div");
      productcarddiv.className = "product-card";
      productcarddiv.setAttribute("data-info", "product-details");
      productcarddiv.setAttribute("data-details", JSON.stringify(element).replace(/'/g, "&#39;"));
      productcarddiv.addEventListener("click", (event) => this.showProductDetail(event));
      productcardcontainerdiv.appendChild(productcarddiv);

      const productimage = document.createElement("img");
      productimage.className = "product-image";
      productimage.setAttribute("src", element.image_url);
      productimage.setAttribute("alt", element.name);
      productcarddiv.appendChild(productimage);

      const productname = document.createElement("h3");
      productname.className = "product-name";
      productname.innerHTML = element.name;
      productcarddiv.appendChild(productname);

      const productprice = document.createElement("p");
      productprice.className = "product-price";
      productprice.innerHTML = element.price;
      productcarddiv.appendChild(productprice);

      const productoverlay = document.createElement("div");
      productoverlay.className = "product-overlay";
      productcarddiv.appendChild(productoverlay);
    });
    const productdetails = document.createElement("div");
    productdetails.id = "product-details";
    productdiv.appendChild(productdetails);

    this.updateTextContainer()
    this.textContainer.appendChild(productdiv);
  }

  getProductUI() {
    const productdiv = document.createElement("div");
    const productcardcontainerdiv = document.createElement("div");
    productcardcontainerdiv.className = "shopping-container";
    productdiv.appendChild(productcardcontainerdiv);

    this.ProductSearchResults.forEach((element) => {
      const productcarddiv = document.createElement("div");
      productcarddiv.className = "shopping-card";
      // productcarddiv.setAttribute("data-info", "product-details");
      // productcarddiv.setAttribute("data-details", JSON.stringify(element).replace(/'/g, "&#39;"));
      // productcarddiv.addEventListener("click", (event) => this.showProductDetail(event));
      productcardcontainerdiv.appendChild(productcarddiv);
      const productcarddivA = document.createElement("a");
      productcarddivA.setAttribute("href", element.link);
      productcarddivA.setAttribute("target", "_blank");
      productcarddiv.appendChild(productcarddivA);


      const productimage = document.createElement("img");
      productimage.className = "shopping-image";
      productimage.setAttribute("src", element.imageUrl);
      productimage.setAttribute("alt", element.title);
      productcarddivA.appendChild(productimage);

      const productname = document.createElement("h3");
      productname.className = "shopping-name";
      productname.innerHTML = element.title;
      productcarddivA.appendChild(productname);

      const productprice = document.createElement("p");
      productprice.className = "shopping-price";
      productprice.innerHTML = element.price;
      productcarddivA.appendChild(productprice);

      const productsource = document.createElement("p");
      productsource.className = "shopping-source";
      productsource.innerHTML = element.source;
      productcarddivA.appendChild(productsource);

      const productoverlay = document.createElement("div");
      productoverlay.className = "shopping-overlay";
      productcarddivA.appendChild(productoverlay);
    });
    // const productdetails = document.createElement("div");
    // productdetails.id = "product-details";
    // productdiv.appendChild(productdetails);

    this.updateTextContainer()
    this.textContainer.appendChild(productdiv);
  }

  showProductDetail(event) {
    let element = event.target;
    var divdata = JSON.parse(element.parentElement.getAttribute("data-details"));
    var divele = element.parentElement.parentElement.parentElement.querySelector("#product-details");

    const productdetailscard = document.createElement("div");
    productdetailscard.className = "product-details-card";
    const productdetailsimage = document.createElement("div");
    productdetailsimage.className = "product-details-image";
    productdetailscard.appendChild(productdetailsimage);

    const carouseldiv = document.createElement("div");
    carouseldiv.className = "carousel";
    productdetailsimage.appendChild(carouseldiv);

    divdata.image_urls.forEach((image_url) => {
      const carouselitemdiv = document.createElement("div");
      carouselitemdiv.className = "carouselitem";
      const carouselitemimg = document.createElement("img");
      carouselitemimg.setAttribute("src", image_url);
      carouselitemimg.setAttribute("alt", divdata.name);
      carouselitemdiv.appendChild(carouselitemimg);
      carouseldiv.appendChild(carouselitemdiv);
    });

    const productdetailsdiv = document.createElement("div");
    productdetailsdiv.className = "product-details";
    productdetailscard.appendChild(productdetailsdiv);

    const productdetailstitlediv = document.createElement("h1");
    productdetailstitlediv.className = "product-details-title";
    productdetailstitlediv.innerHTML = divdata.name;
    productdetailsdiv.appendChild(productdetailstitlediv);

    const productdetailspricediv = document.createElement("div");
    productdetailspricediv.className = "product-details-price";
    productdetailspricediv.innerHTML = divdata.price;
    productdetailsdiv.appendChild(productdetailspricediv);

    const productdetailsbuybtn = document.createElement("button");
    productdetailsbuybtn.className = "product-details-add-btn";
    productdetailsdiv.appendChild(productdetailsbuybtn);

    const productdetailsbuybtnA = document.createElement("a");
    productdetailsbuybtnA.setAttribute("href", divdata.link_url);
    productdetailsbuybtnA.setAttribute("target", "_blank");
    productdetailsbuybtn.appendChild(productdetailsbuybtnA);

    const productdetailsbuybtnimg = document.createElement("img");
    productdetailsbuybtnimg.setAttribute("src", "./images/buy.svg");
    productdetailsbuybtnA.appendChild(productdetailsbuybtnimg);

    const productdetailsdescription = document.createElement("p");
    productdetailsdescription.className = "product-details-description";
    productdetailsdescription.innerHTML = divdata.desc.replaceAll("\n", "<br>");
    productdetailsdiv.appendChild(productdetailsdescription);
    divele.innerHTML = "";
    divele.appendChild(productdetailscard);
    // scrollToDiv(element.getAttribute('data-info'));
  }
  formatDateToString(date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    date = new Date(date);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];

    return `${dayName}, ${day} ${monthName}`;
  }
}
export { Chat as default };
