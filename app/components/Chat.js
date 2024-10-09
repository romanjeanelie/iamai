import { connect } from "https://cdn.jsdelivr.net/npm/nats.ws@latest/esm/nats.js";
import Config from "../getConfig.js";
import getMarked from "../utils/getMarked.js";
import { API_STATUSES } from "./constants.js";
import DiscussionMedia from "./DiscussionMedia.js";
import { getTaskUI } from "./TaskManager/utils/getTaskUI.js";
// const uuid = "omega_" + crypto.randomUUID();
// import { getUser } from "../User.js";
// const IS_DEV_MODE = import.meta.env.MODE === "development";
const IS_DEV_MODE = false;
const HOST = import.meta.env.VITE_API_HOST || "https://api.asterizk.ai";
const GOOGLE_TRANSLATE_URL = import.meta.env.VITE_API_GOOGLE_TRANSLATE;

// const md = getRemarkable();
const md = getMarked();
let ui_paramsmap = new Map();
let sources_paramsmap = new Map();
let images_paramsmap = new Map();
let steamseq = [];
const ANSWER = "answer",
  FOLLOWUP = "question",
  SOURCES = "sources",
  IMAGES = "images",
  STATUS = "status",
  CONTROL = "control",
  UI = "ui",
  PA_NEW_CONVERSATION_STARTED = "new_conversation_started",
  PA_RESPONSE_STARTED = "response_started",
  PA_RESPONSE_ENDED = "response_ended",
  STREAM_STARTED = "stream_started",
  STREAMING = "streaming",
  STREAM_ENDED = "stream_ended",
  AGENT_STARTED = "agent_started",
  AGENT_ENDED = "agent_ended",
  PA_STARTED = "pa_started",
  PA_ENDED = "pa_ended",
  UNDEFINED = "undefined",
  PA_DEPLOYMENT_STARTED = "pa_deploy_started",
  IMAGE_GEN_STARTED = "image_generation_in_progress",
  MOVIESEARCH = "MovieSearch",
  RAGCHAT = "RAG_CHAT",
  AGENT_PROGRESSING = "agent_progressing",
  AGENT_ANSWERED = "agent_answered",
  IMAGE_GENERATION_IN_PROGRESS = "image_generation_in_progress",
  RESPONSE_FOLLOW_UP = "response_follow_up",
  RESPONSE_GREETING = "response_greeting",
  AGENT_INTERMEDIATE_ANSWER = "agent_intermediate_answer";
let micro_thread_id = "";

let nc;
let js;

class Chat {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.discussionContainer = this.callbacks.discussionContainer;
    this.autodetect = true;
    this.targetlang = "en";
    this.sourcelang = "";
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
    this.video_stream_name = "";
    this.video_subject_name = "";
    this.phi_stream_started = false;
    // this.NATS_URL = "";
    // this.NATS_USER = "";
    // this.NATS_PASS = "";
    this.callbacks.disableInput();
    const config = new Config();
    config
      .getWebsiteConfig()
      .then((data) => {
        if (data) {
          this.NATS_URL = data.NATS_URL;
          this.NATS_USER = data.NATS_USER;
          this.NATS_PASS = data.NATS_PASS;
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  callsubmit = async (text, img, container, live_mode = false) => {
    this.container = container;
    var input_text = text;
    var original_text = input_text;
    if (this.autodetect) {
      var response = await this.googletranslate(input_text, this.targetlang, "");
      input_text = response.data.translations[0].translatedText;
      if (response.data.translations[0].detectedSourceLanguage)
        this.sourcelang = response.data.translations[0].detectedSourceLanguage;
    } else if (this.sourcelang != this.targetlang) {
      var response = await this.googletranslate(input_text, this.targetlang, this.sourcelang);
      input_text = response.data.translations[0].translatedText;
    }
    // if (this.awaiting && this.workflowID != "") {
    if (this.workflowID != "") {
      if (img) {
        if (live_mode) {
          this.PushVideoData(
            img.map((imgs) => imgs.src),
            input_text
          );
          // this.SendPHIQns(input_text);
        } else {
          this.submituserreply(
            input_text,
            this.workflowID,
            img.map((imgs) => imgs.src),
            live_mode
          );
        }
      } else this.submituserreply(input_text, this.workflowID, img, live_mode);
    } else {
      this.workflowID = this.sessionID;

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = async () => {
        if (xhr.readyState == 4) {
          //   console.log(xhr.response);
          let text = JSON.parse(xhr.response);
          // console.log(text.stream_id);
          let stream_name = text.stream_id;
          console.timeEnd("logged in");
          console.time("getstreamdata");
          this.getstreamdata(stream_name);
        }
      };

      xhr.addEventListener("error", async function (e) {
        console.log("error: " + e);
        var AIAnswer = "An error occurred while attempting to connect.";
        if (this.sourcelang != "en") {
          var transresponse = await this.googletranslate(AIAnswer, this.sourcelang, this.targetlang);
          AIAnswer = transresponse.data.translations[0].translatedText;
        }
        await this.callbacks.addAIText({ text: AIAnswer, container: this.container, targetlang: this.sourcelang });
        this.callbacks.enableInput();
      });
      if (this.sessionID && this.sessionID != "") {
        this.user.user.getIdToken(true).then(async (idToken) => {
          xhr.open("POST", HOST + "/workflows/conversation", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);
          if (this.sessionID.startsWith("wf-external-conversation")) {
            xhr.send(
              JSON.stringify({
                session_id: this.sessionID,
                uuid: "omega_" + crypto.randomUUID() + "@costar.life",
              })
            );
          } else {
            xhr.send(
              JSON.stringify({
                session_id: this.sessionID,
                uuid: this.deploy_ID,
              })
            );
            console.time("conversation");
          }
        });
      } else {
        this.user.user.getIdToken(true).then(async (idToken) => {
          xhr.open("POST", HOST + "/workflows/tasks", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);
          xhr.send(
            JSON.stringify({
              query: input_text,
              uuid: this.user.uuid,
            })
          );
        });
      }
    }
  };

  getstreamdata = async (stream_name) => {
    nc = await connect({
      servers: [this.NATS_URL],
      user: this.NATS_USER,
      pass: this.NATS_PASS,
    });

    js = nc.jetstream();

    const c = await js.consumers.get(stream_name, stream_name);
    let iter = await c.consume();
    console.timeEnd("getstreamdata");
    nc.onclose = function (e) {
      console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
      setTimeout(async function () {
        console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
        nc = await connect({
          servers: [this.NATS_URL],
          user: this.NATS_USER,
          pass: this.NATS_PASS,
        });
      }, 1000);
    };

    nc.onerror = function (err) {
      console.error("Socket encountered error: ", err.message, "Closing socket");
      ws.close();
    };
    for await (const m of iter) {
      var mdata = m.json();
      // console.log(mdata);
      if (steamseq.includes(m.seq) && m.redelivered) {
        // console.log("prevent duplicate");
        m.ack();
      } else {
        steamseq.push(m.seq);
        this.status = mdata.status;
        this.task_name = mdata.task_name;
        var mtext = mdata.response_json;

        // HERE IS MADE THE RESULT UI FOR A TASK
        if (mdata.status == AGENT_ENDED) {
          this.callbacks.emitter.emit(AGENT_ENDED);

          let result;
          let datas = ui_paramsmap.get(mdata.micro_thread_id);
          if (datas) {
            datas.forEach((data) => {
              const uiElement = getTaskUI(data, this.emitter);
              if (uiElement.isClass) {
                result = uiElement;
              } else {
                result = document.createElement("div");
                result.appendChild(uiElement);
              }
            });
          }

          const task = {
            key: mdata.micro_thread_id,
            status: {
              type: API_STATUSES.ENDED,
              title: "Completed",
              description: mdata.response_json.text,
              label: "View Results",
            },
          };

          this.callbacks.emitter.emit("taskManager:updateStatus", task.key, task.status, result, {
            workflowID: mdata.session_id,
          });
          // this.callbacks.emitter.emit("taskManager:updateStatus", task.key, task.status, divans, { workflowID: 1234 });
          ui_paramsmap.delete(mdata.micro_thread_id);
        } else if (mdata.status == AGENT_ANSWERED) {
          const task = {
            key: mdata.micro_thread_id,
            status: {
              type: API_STATUSES.ENDED,
              title: "AGENT ANSWERED",
              description: mdata.response_json.text,
              label: "In Progress",
            },
          };

          const answerContainer = document.createElement("div");
          answerContainer.innerHTML = md.parse(mdata.response_json.text) || "";

          this.callbacks.emitter.emit("taskManager:updateStatus", task.key, task.status, answerContainer);
        }

        //get UI and RAG params
        if (mdata.type == UI) {
          // console.log("domain:" + this.domain);
          if (ui_paramsmap.get(mdata.micro_thread_id))
            ui_paramsmap.get(mdata.micro_thread_id).push(mdata.response_json);
          else ui_paramsmap.set(mdata.micro_thread_id, [mdata.response_json]);
        } else if (mdata.type == IMAGES) {
          this.image_urls = JSON.parse(mdata.response_json.images);
          if (!this.media) {
            this.media = new DiscussionMedia({ container: this.container, emitter: this.callbacks.emitter });
            this.media.initImages();
          }
          if (mdata.micro_thread_id.length == 0) this.image_urls && this.media.addImages(this.image_urls.slice(0, 8));
          else images_paramsmap.set(mdata.micro_thread_id, mdata.response_json.images);
        } else if (mdata.type == SOURCES) {
          const media = new DiscussionMedia({ container: this.container, emitter: this.callbacks.emitter });
          try {
            this.Sources = JSON.parse(mdata.response_json.sources);
          } catch (e) {
            this.Sources = mdata.response_json.sources;
          }
          if (mdata.micro_thread_id.length == 0) media.addSources(this.Sources);
          else sources_paramsmap.set(mdata.micro_thread_id, mdata.response_json.sources);
        }
        //generate data
        if (mdata.status && mdata.status == STREAM_STARTED) {
          this.callbacks.emitter.emit(STREAM_STARTED);
        } else if (mdata.status && mdata.status == STREAM_ENDED) {
          this.callbacks.emitter.emit("endStream");
          this.callbacks.emitter.emit(STREAM_ENDED);
        } else if (mdata.status && mdata.status == STREAMING) {
          var mtext = mdata.response_json.text;
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
          // this is for external conversation
          // } else if (mdata.status.toLowerCase() == "agent ended" && mdata.message_type == "system") {
          //   this.sessionID = "";
          //   this.deploy_ID = "";
          //   this.callbacks.addURL({
          //     text: "",
          //     label: "Please click here, to start a new session to chat or close the browser.",
          //     container: this.container,
          //     url: "./index.html",
          //   });
          // await this.callbacks.addAIText({ text: "Please click here, to start a new session to chat or close the browser.", type: 'link', container: this.container });
          // textEl.innerHTML = 'Please click <a href="./index.html">here</a>, to start a new session to chat or close the browser.';
        } else if (mdata.awaiting && (!mdata.micro_thread_id || mdata.micro_thread_id == "NA")) {
          var mtext = mdata.response_json.text;
          // console.log("awaiting:" + mdata.message_type);
          // console.log("mtext:" + mtext);
          this.workflowID = mdata.session_id;
          this.awaiting = true;
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
          this.callbacks.emitter.emit("endStream");
          this.callbacks.emitter.emit(STREAM_ENDED);

          if (this.domain == RAGCHAT) {
            // console.log("here RAG_CHAT:" + this.RAG_CHAT);
            this.getGucciUI();
            (this.domain = ""), (this.RAG_CHAT = "");
          } else if (this.domain == MOVIESEARCH) {
            (this.domain = ""), (this.MovieSearchResults = ""), (this.MovieSearch = "");
          }
          this.callbacks.enableInput();
        } else if (mdata.micro_thread_id == "NA") {
          var mtext = mdata.response_json.text;
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
          this.callbacks.emitter.emit("endStream");
          this.callbacks.emitter.emit(STREAM_ENDED);
        } else if (mdata.status && mdata.status == AGENT_ENDED) {
          // micro_thread_id =  mdata.micro_thread_id;
        } else if (mdata.status && mdata.status.toLowerCase() == PA_RESPONSE_STARTED) {
          if (mtext && mtext.image_stream_id) {
            this.video_stream_name = mtext.image_stream_id;
            this.video_subject_name = mtext.image_subject;
            this.VideoCallStarted();
          }
        } else if (mdata.status && mdata.status.toLowerCase() == PA_RESPONSE_ENDED) {
          this.callbacks.enableInput();
          this.callbacks.emitter.emit("paEnd");
          this.callbacks.emitter.emit(PA_RESPONSE_ENDED);
        } else if (mdata.status && mdata.status == AGENT_STARTED) {
          // micro_thread_id =  mdata.micro_thread_id;
          let taskname = mdata.task_name;
          const task = {
            key: mdata.micro_thread_id,
            name: taskname,
            createdAt: mdata.time_stamp,
            status: {
              type: API_STATUSES.PROGRESSING,
              title: "Planning",
              description: "Planning your tasks.",
              label: "In Progress",
            },
          };

          const textAI = mdata.response_json.text;
          // await this.createTask(task, textAI)
          this.callbacks.emitter.emit("taskManager:createTask", task, textAI);
          this.callbacks.emitter.emit("endStream");
        } else if (mdata.status && mdata.status == AGENT_PROGRESSING) {
          if (mdata.awaiting) {
            let taskname = mdata.task_name;
            console.log("TASK IN PROGRESS", mdata);
            const task = {
              key: mdata.micro_thread_id,
              status: {
                type: API_STATUSES.INPUT_REQUIRED,
                label: "Input Required",
                title: taskname,
                description: mdata.response_json.text,
              },
              workflowID: mdata.session_id,
            };
            this.callbacks.emitter.emit("taskManager:updateStatus", task.key, task.status, null, task.workflowID);
          } else {
            if (mdata.type == SOURCES) {
              const task = {
                key: mdata.micro_thread_id,
                status: {
                  type: API_STATUSES.PROGRESSING,
                  title: "SOURCES",
                  description: mdata.response_json.sources,
                  label: "In Progress",
                },
              };
              this.callbacks.emitter.emit("taskManager:updateStatus", task.key, task.status);
            } else if (mdata.type == AGENT_INTERMEDIATE_ANSWER) {
              const task = {
                key: mdata.micro_thread_id,
                status: {
                  type: API_STATUSES.PROGRESSING,
                  title: "AGENT INTERMEDIATE ANSWER",
                  description: mdata.response_json.agent_intermediate_answer,
                  label: "In Progress",
                },
              };
              this.callbacks.emitter.emit("taskManager:updateStatus", task.key, task.status);
            } else {
              if (mdata.response_json.domain != "Code") {
                const task = {
                  key: mdata.micro_thread_id,
                  status: {
                    type: API_STATUSES.PROGRESSING,
                    title: mdata.response_json.text.split(" ")[0],
                    description: mdata.response_json.text,
                    label: "In Progress",
                  },
                };
                this.callbacks.emitter.emit("taskManager:updateStatus", task.key, task.status);
              }
            }
          }
        } else if (mdata.status && mdata.status == RESPONSE_FOLLOW_UP) {
          var mtext = mdata.response_json.text;
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
        } else if (mdata.status && mdata.status == IMAGE_GENERATION_IN_PROGRESS) {
          // set up the images scene with images skeletons
          this.media = new DiscussionMedia({ container: this.container, emitter: this.callbacks.emitter });
          this.media.initImages();
        } else if (mdata.status && mdata.status == RESPONSE_GREETING) {
          var mtext = mdata.response_json.text;
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
        }
        m.ack();
      }
    }
    nc.drain();
  };

  extractSubstringWithEllipsis(text) {
    if (text.length <= 40) {
      return text;
    }
    for (let i = 40; i < text.length; i++) {
      if (text[i] === " " || [",", ".", "!", "?", ";"].includes(text[i])) {
        return text.substring(0, i) + " ...";
      }
    }
    return text.substring(0, 40) + " ...";
  }

  adduserqns(userQns) {
    const divdiscussionuser = document.createElement("div");
    divdiscussionuser.className = "discussion__user";
    divdiscussionuser.innerHTML = userQns;
    return divdiscussionuser;
  }

  adduserans(userAns, container, source = null) {
    const divtextcontainer = document.createElement("div");
    divtextcontainer.className = "text__container";
    const divans = document.createElement("div");
    if (container) {
      divans.appendChild(container);
      divtextcontainer.appendChild(divans);
    }
    const divspan = document.createElement("span");
    const spanAIword = document.createElement("span");
    spanAIword.className = "AIword";
    spanAIword.innerHTML = md.parse(userAns);

    divspan.appendChild(spanAIword);
    divtextcontainer.appendChild(divspan);
    if (source) {
      const media = new DiscussionMedia({ container: divtextcontainer, emitter: this.callbacks.emitter });
      media.addSources(source);
    }
    return divtextcontainer;
  }

  delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  translate = (text, lang) =>
    new Promise(async (resolve, reject) => {
      var data = JSON.stringify([{ text: text }]);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          // console.log(this.responseText);
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

      xhr.open("POST", GOOGLE_TRANSLATE_URL, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          //   console.log("google:" + xhr.responseText);
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

  submituserreply(text, suworkflowid, img, live_mode) {
    var data = "";
    if (img && img.length > 0) {
      data = JSON.stringify({
        message_type: "user_message",
        user: "User",
        message: {
          type: "text",
          json: {},
          text: text,
        },
        user_data: {
          type: "image",
          url: img,
          live_mode: live_mode,
        },
      });
    } else {
      data = JSON.stringify({
        message_type: "user_message",
        user: "User",
        message: {
          type: "text",
          json: {},
          text: text,
        },
      });
    }
    this.user.user.getIdToken(true).then(async (idToken) => {
      var xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          // console.log(this.responseText);
          // console.time("RequestStart");
        }
      });

      xhr.open("POST", HOST + "/workflows/message/" + suworkflowid);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);

      xhr.send(data);
      console.timeEnd("input");
      console.time("conversation");
    });
  }

  updateTextContainer() {
    this.textContainer = this.container.querySelector(".text__container");

    if (!this.textContainer) {
      this.textContainer = document.createElement("div");
      this.textContainer.className = "text__container";
      this.container.appendChild(this.textContainer);
    }
  }

  StartVideoWorkflow() {
    var data = JSON.stringify({
      uuid: this.deploy_ID,
      pa_session_id: this.sessionID,
      // model: "phi3v",
      model: "gpt4v",
    });

    this.user.user.getIdToken(true).then(async (idToken) => {
      var xhr = new XMLHttpRequest();

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          var responsedata = JSON.parse(this.responseText);
        }
      });

      xhr.open("POST", HOST + "/workflows/deploy_video_chat");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);
      xhr.send(data);
    });
  }

  async VideoCallStarted() {
    var video_chat_started = JSON.stringify({
      type: "control",
      status: "video_chat_started",
      pa_session_id: this.sessionID,
    });

    await js.publish(this.video_subject_name, video_chat_started);
  }

  async VideoCallEnded() {
    var video_chat_ended = JSON.stringify({
      type: "control",
      status: "video_chat_ended",
      pa_session_id: this.sessionID,
    });

    await js.publish(this.video_subject_name, video_chat_ended);
    this.video_stream_name = "";
    this.video_subject_name = "";
    this.phi_stream_started = false;
  }

  async PushVideoData(imgs, input_text) {
    // console.log(imgs);
    // console.log(input_text);

    var stream_started = JSON.stringify({
      type: "images",
      status: "stream_started",
      pa_session_id: this.sessionID,
    });

    var stream_ended = JSON.stringify({
      type: "images",
      status: "stream_ended",
      pa_session_id: this.sessionID,
    });

    // console.log("before data pushed");
    await js.publish(this.video_subject_name, stream_started);
    imgs.forEach(async (img) => {
      var imagedata = JSON.stringify({
        type: "images",
        status: "streaming",
        pa_session_id: this.sessionID,
        response_json: {
          byte64: img,
        },
      });
      await js.publish(this.video_subject_name, imagedata);
    });
    //add images data
    await js.publish(this.video_subject_name, stream_ended);
    var question = JSON.stringify({
      type: "question",
      status: "question",
      pa_session_id: this.sessionID,
      response_json: {
        query: input_text,
      },
    });
    await js.publish(this.video_subject_name, question);
    // console.log("data pushed");
  }

  async SendPHIImages(img) {
    var stream_started = JSON.stringify({
      type: "images",
      status: "stream_started",
      pa_session_id: this.sessionID,
    });

    if (!this.phi_stream_started) {
      await js.publish(this.video_subject_name, stream_started);
      this.phi_stream_started = true;
    }

    var imagedata = JSON.stringify({
      type: "images",
      status: "streaming",
      pa_session_id: this.sessionID,
      response_json: {
        byte64: img,
      },
    });
    await js.publish(this.video_subject_name, imagedata);
  }

  async SendPHIQns(input_text) {
    var stream_ended = JSON.stringify({
      type: "images",
      status: "stream_ended",
      pa_session_id: this.sessionID,
    });

    // console.log("before data pushed");
    await js.publish(this.video_subject_name, stream_ended);
    var question = JSON.stringify({
      type: "question",
      status: "question",
      pa_session_id: this.sessionID,
      response_json: {
        query: input_text,
      },
    });
    await js.publish(this.video_subject_name, question);
    // console.log("data pushed");
  }
}
export { Chat as default };
