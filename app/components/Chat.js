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
    console.log(text, img, container);
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
          console.log("submituserreply");
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

  getMovies(MovieSearchResults) {
    const moviesdiv = document.createElement("div");
    const moviescardcontainerdiv = document.createElement("div");
    moviescardcontainerdiv.className = "moviescard-container";

    MovieSearchResults.forEach((element) => {
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

    return moviesdiv;
    // this.updateTextContainer();
    // this.textContainer.appendChild(moviesdiv);
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
        message_type: "user_message",
        user: "User",
        message: {
          type: "text",
          json: {},
          text: texttosend,
        },
      });
      this.user.user.getIdToken(true).then(async (idToken) => {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            console.log(this.responseText);
          }
        });

        xhr.open("POST", HOST + "/workflows/message/" + this.workflowID);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);

        xhr.send(data);
        this.agentawaiting = false;
      });
    } else {
      var texttosend =
        "book movie ticket for " +
        JSON.stringify({
          movie_name: MovieTitle,
          theatre_name: Theatre,
          movie_date: Date,
          movie_time: Time,
        });
      this.callsubmit(texttosend, "", this.container);
    }
  }

  getTaxiUI(TaxiSearchResults) {
    const taxidiv = document.createElement("div");
    taxidiv.className = "rides-list-wrapper";

    let data = TaxiSearchResults;
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

        // this.updateTextContainer();
        // this.textContainer.appendChild(taxidiv);
      }
    }
    return taxidiv;
  }

  getFlightUI(FlightSearch, FlightSearchResults) {
    const FlightContainerdiv = document.createElement("div");
    FlightContainerdiv.className = "FlightContainer Flight-Container";
    FlightContainerdiv.setAttribute("name", "flightResult");

    if (FlightSearch.departure_end_date.length > 0 && FlightSearch.return_end_date.length > 0) {
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
    let FlightSearchResultsArr = FlightSearchResults.Outbound;
    for (let flightsi = 0; flightsi < 2; flightsi++) {
      if (flightsi == 1) FlightSearchResultsArr = FlightSearchResults.Return;
      if (FlightSearchResultsArr && FlightSearchResultsArr.length > 0) {
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
          flightlogoimg.setAttribute("style", "height: 40px;mix-blend-mode: multiply;width:auto");
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
            '<svg class="flightimg" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.053 15.5789L12 24L10 24L12.526 15.5789L7.166 15.5789L5.5 18.7368L4 18.7368L5 14L4 9.26316L5.5 9.26316L7.167 12.4211L12.527 12.4211L10 4L12 4L17.053 12.4211L22.5 12.4211C22.8978 12.4211 23.2794 12.5874 23.5607 12.8835C23.842 13.1796 24 13.5812 24 14C24 14.4188 23.842 14.8204 23.5607 15.1165C23.2794 15.4126 22.8978 15.5789 22.5 15.5789L17.053 15.5789Z" fill="#00254E" fill-opacity="0.6"/></svg>';
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
          flightsresultsstr += '<circle cx="9.50002" cy="10.0001" r="3.75002" fill="#00254E" fill-opacity="0.6" />';
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
    // this.updateTextContainer();
    // this.textContainer.append(FlightContainerdiv);
    return FlightContainerdiv;
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

    this.updateTextContainer();
    this.textContainer.appendChild(productdiv);
  }

  getProductUI(ProductSearchResults) {
    const productdiv = document.createElement("div");
    const productcardcontainerdiv = document.createElement("div");
    productcardcontainerdiv.className = "shopping-container";
    productdiv.appendChild(productcardcontainerdiv);

    ProductSearchResults.forEach((element) => {
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

      const productimagediv = document.createElement("div");
      productimagediv.className = "shopping-image-dev";
      productcarddivA.appendChild(productimagediv);

      const productimage = document.createElement("img");
      productimage.className = "shopping-image";
      productimage.setAttribute("src", element.imageUrl);
      productimage.setAttribute("alt", element.title);
      productimagediv.appendChild(productimage);

      const productname = document.createElement("h3");
      productname.className = "shopping-name";
      var ptitle = this.truncate(element.title, 30);
      productname.innerHTML = ptitle;
      productcarddivA.appendChild(productname);

      const productsource = document.createElement("p");
      productsource.className = "shopping-source";
      productsource.innerHTML = element.source;
      productcarddivA.appendChild(productsource);

      const productprice = document.createElement("p");
      productprice.className = "shopping-price";
      if (element.price.includes(".00"))
        productprice.innerHTML = element.price.substring(0, element.price.indexOf(".00"));
      else productprice.innerHTML = element.price;
      productcarddivA.appendChild(productprice);

      const productoverlay = document.createElement("div");
      productoverlay.className = "shopping-overlay";
      productcarddivA.appendChild(productoverlay);
    });
    // const productdetails = document.createElement("div");
    // productdetails.id = "product-details";
    // productdiv.appendChild(productdetails);

    // this.updateTextContainer();
    // this.textContainer.appendChild(productdiv);
    return productdiv;
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

  getCodeUI(Code, Language) {
    const codediv = document.createElement("div");
    codediv.className = "code-container";
    const codedivfilter = document.createElement("div");
    codedivfilter.className = "code-filter";
    codediv.appendChild(codedivfilter);

    const codedatadiv = document.createElement("div");
    codedatadiv.className = "codecard-data code active";
    codedatadiv.innerHTML = md.parse(Code);

    codediv.appendChild(codedatadiv);
    if (Language.toLowerCase() == "html") {
      const codedivfiltercode = document.createElement("div");
      codedivfiltercode.className = "codecard-filtercode code active";
      codedivfiltercode.innerHTML = "Code";
      codedivfiltercode.addEventListener("click", (event) => this.codefilter(event, "code"));
      codedivfilter.appendChild(codedivfiltercode);
      const codedivfilterpreview = document.createElement("div");
      codedivfilterpreview.className = "codecard-filtercode preview";
      codedivfilterpreview.innerHTML = "Preview";
      codedivfilterpreview.addEventListener("click", (event) => this.codefilter(event, "preview"));
      codedivfilter.appendChild(codedivfilterpreview);

      const codedivpreview = document.createElement("div");
      codedivpreview.className = "codecard-data preview";
      const iframe = document.createElement("iframe");
      iframe.className = "codecard-data previewframe";
      iframe.srcdoc = Code.replace("```html", "").replace("```", "");
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
      codedivpreview.appendChild(iframe);

      codediv.appendChild(codedivpreview);
    }
    return codediv;
  }

  getHotelsUI(HotelSearch, HotelSearchResults) {
    const hotelsdiv = document.createElement("div");
    hotelsdiv.setAttribute("data-details", JSON.stringify(HotelSearchResults));
    const hotelsdivfilter = document.createElement("div");
    hotelsdivfilter.className = "hotelscard-filter";
    const hotelsdivfilterall = document.createElement("div");
    hotelsdivfilterall.className = "hotelscard-filterall hotelactive";
    hotelsdivfilterall.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3952_11361)"><rect x="1" y="1" width="8" height="8" rx="1" stroke="#00254E" stroke-width="2" stroke-linejoin="round"/><rect x="1" y="15" width="8" height="8" rx="1" stroke="#00254E" stroke-width="2" stroke-linejoin="round"/><rect x="15" y="1" width="8" height="8" rx="1" stroke="#00254E" stroke-width="2" stroke-linejoin="round"/><rect x="15" y="15" width="8" height="8" rx="1" stroke="#00254E" stroke-width="2" stroke-linejoin="round"/></g><defs><clipPath id="clip0_3952_11361"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>';
    hotelsdivfilterall.innerHTML += "All";
    const hotelsdivfilterallborder = document.createElement("div");
    hotelsdivfilterallborder.id = "border";
    hotelsdivfilterallborder.className = "hotelfilteractive";
    hotelsdivfilterall.appendChild(hotelsdivfilterallborder);
    hotelsdivfilterall.addEventListener("click", (event) => this.hotelfilter(event, "all"));
    hotelsdivfilter.appendChild(hotelsdivfilterall);
    const hotelsdivfilterairbnb = document.createElement("div");
    hotelsdivfilterairbnb.className = "hotelscard-filterairbnb";
    hotelsdivfilterairbnb.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3952_11362)"><path d="M15.3409 1.89305C14.6375 0.718783 13.3691 0 12.0002 0C10.6313 0 9.36292 0.71875 8.65949 1.89305L0.820688 14.9577C0.284133 15.851 0.000483877 16.8732 0 17.9152V18.252C0.000126002 19.7028 0.548781 21.0998 1.53605 22.163C2.52322 23.2262 3.87592 23.8767 5.32287 23.9842C6.7696 24.0916 8.20358 23.648 9.33711 22.7424L12.0003 20.6094L14.6636 22.7424C15.797 23.648 17.231 24.0916 18.6778 23.9842C20.1247 23.8767 21.4774 23.2262 22.4646 22.163C23.4519 21.0999 24.0005 19.7028 24.0007 18.252V17.9152C24.0002 16.8732 23.7165 15.851 23.18 14.9577L15.3409 1.89305ZM13.208 16.6687L12.0002 17.6365L10.7925 16.6687C10.3323 16.3013 10.0644 15.7442 10.0647 15.1552V15.0971C10.0647 14.4056 10.4337 13.7667 11.0325 13.4209C11.6313 13.0752 12.3692 13.0752 12.968 13.4209C13.5668 13.7667 13.9357 14.4056 13.9357 15.0971V15.1552C13.9361 15.7442 13.6682 16.3013 13.208 16.6687ZM21.6778 18.252C21.6791 19.1169 21.3528 19.9503 20.7646 20.5843C20.1764 21.2185 19.3698 21.6063 18.5073 21.6699C17.6446 21.7334 16.7899 21.4679 16.1151 20.9268L13.8584 19.123L14.6597 18.4804C15.6728 17.6746 16.2616 16.4497 16.2584 15.1552V15.0971C16.2584 13.5758 15.4468 12.1701 14.1293 11.4093C12.8119 10.6487 11.1887 10.6487 9.87122 11.4093C8.55378 12.17 7.74216 13.5756 7.74216 15.0971V15.1552C7.74228 16.4489 8.33049 17.6723 9.34086 18.4804L10.1422 19.123L7.88532 20.927L7.88545 20.9268C7.21067 21.4679 6.35595 21.7334 5.49329 21.6699C4.63076 21.6063 3.82417 21.2185 3.23594 20.5843C2.64774 19.9503 2.32148 19.117 2.32273 18.252V17.9152C2.32286 17.2948 2.49146 16.686 2.81051 16.154L10.6493 3.09704C10.9316 2.61681 11.4471 2.32197 12.0042 2.32197C12.5613 2.32197 13.0766 2.61683 13.359 3.09704L21.1901 16.154C21.5091 16.686 21.6777 17.2947 21.6779 17.9152L21.6778 18.252Z" fill="#00254E"/></g><defs><clipPath id="clip0_3952_11362"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>';
    hotelsdivfilterairbnb.innerHTML += "Airbnb";
    const hotelsdivfilterairbnbborder = document.createElement("div");
    hotelsdivfilterairbnbborder.id = "border";
    hotelsdivfilterairbnb.appendChild(hotelsdivfilterairbnbborder);
    hotelsdivfilterairbnb.addEventListener("click", (event) => this.hotelfilter(event, "airbnb"));
    hotelsdivfilter.appendChild(hotelsdivfilterairbnb);
    const hotelsdivfilterhotels = document.createElement("div");
    hotelsdivfilterhotels.className = "hotelscard-filterhotels";
    hotelsdivfilterhotels.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3952_11368)"><line x1="0.958357" y1="1.45836" x2="0.958358" y2="22.5422" stroke="#00254E" stroke-width="1.91671" stroke-linecap="round"/><path d="M23 16.6016L23 22.3515" stroke="#00254E" stroke-width="1.91671" stroke-linecap="round"/><line x1="1.14844" y1="16.7916" x2="21.6912" y2="16.7916" stroke="#00254E" stroke-width="1.91671"/><path d="M12.6484 8.55078H19.8042C21.5685 8.55078 22.9987 9.98099 22.9987 11.7452V16.601H12.6484V8.55078Z" stroke="#00254E" stroke-width="1.91671"/><circle cx="6.90321" cy="10.8505" r="2.49173" stroke="#00254E" stroke-width="1.91671"/></g><defs><clipPath id="clip0_3952_11368"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>';
    hotelsdivfilterhotels.innerHTML += "Hotels";
    const hotelsdivfilterhotelsborder = document.createElement("div");
    hotelsdivfilterhotelsborder.id = "border";
    hotelsdivfilterhotels.appendChild(hotelsdivfilterhotelsborder);
    hotelsdivfilterhotels.addEventListener("click", (event) => this.hotelfilter(event, "accor"));
    hotelsdivfilter.appendChild(hotelsdivfilterhotels);
    hotelsdiv.appendChild(hotelsdivfilter);

    let hotelcardcontainerdiv = this.getHotelsFilterUI(HotelSearchResults, "all");

    hotelsdiv.appendChild(hotelcardcontainerdiv);

    return hotelsdiv;
  }

  getHotelsFilterUI(HotelSearchResults, Filter) {
    const hotelcardcontainerdiv = document.createElement("div");
    hotelcardcontainerdiv.className = "hotelscard-container";
    try {
      HotelSearchResults.all.forEach((element) => {
        if (element.website == Filter || Filter == "all") {
          const hotelcarddiv = document.createElement("div");
          hotelcarddiv.className = "hotels-card";
          const hotelcardimagediv = document.createElement("div");
          hotelcardimagediv.className = "hotels-image-div";
          const hotelcardimageslidesdiv = document.createElement("div");
          hotelcardimageslidesdiv.className = "hotels-image-slides";
          hotelcardimagediv.appendChild(hotelcardimageslidesdiv);
          const hoteldots = document.createElement("div");
          hoteldots.className = "hotels-dots";

          for (let index = 0; index < element.pictures.length; index++) {
            const hotelcardimageslidediv = document.createElement("div");
            if (index === 0) hotelcardimageslidediv.className = "hotels-image-slide active";
            else hotelcardimageslidediv.className = "hotels-image-slide";

            hotelcardimageslidesdiv.appendChild(hotelcardimageslidediv);
            const hotelsimg = document.createElement("img");

            hotelsimg.className = "hotels-image";
            hotelsimg.setAttribute("alt", element.title.replace(/'/g, "&#39;"));
            hotelsimg.setAttribute("src", element.pictures[index]);
            hotelcardimageslidediv.appendChild(hotelsimg);

            const dot = document.createElement("span");
            if (index === 0) dot.className = "hotels-dot active";
            else dot.classList.add("hotels-dot");
            hoteldots.appendChild(dot);
            if (index === 3) break;
          }
          if (element.website == "airbnb") {
            const hotelsimgairbnb = document.createElement("img");
            hotelsimgairbnb.className = "hotels-image-airbnb";
            hotelsimgairbnb.setAttribute("src", "./icons/airbnb.svg");
            hotelcardimagediv.appendChild(hotelsimgairbnb);
          }

          const hotelimagesprev = document.createElement("button");
          hotelimagesprev.className = "hotels-prev";
          hotelimagesprev.innerHTML =
            '<svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="20" r="20" fill="#00254E" fill-opacity="0.24"/><path fill-rule="evenodd" clip-rule="evenodd" d="M25.0742 12.0002L20.5 20.0002L25.0742 28.0002H27L22.4258 20.0002L27 12.0002H25.0742Z" fill="white"/></svg>';
          hotelimagesprev.addEventListener("click", (event) => this.hotelmoveSlide(event, false));
          hotelcardimagediv.appendChild(hotelimagesprev);

          const hotelimagesnext = document.createElement("button");
          hotelimagesnext.className = "hotels-next";
          hotelimagesnext.innerHTML =
            '<svg width="48" height="40" viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="20" r="20" fill="#00254E" fill-opacity="0.24"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23.9264 12L28.5023 20L23.9264 28H22L26.5759 20L22 12H23.9264Z" fill="white"/></svg>';

          hotelimagesnext.addEventListener("click", (event) => this.hotelmoveSlide(event, true));
          hotelcardimagediv.appendChild(hotelimagesnext);

          hotelcardimagediv.appendChild(hoteldots);
          hotelcarddiv.appendChild(hotelcardimagediv);

          const hoteltitlep = document.createElement("div");
          hoteltitlep.className = "hotels-title";
          hoteltitlep.innerHTML = element.title;
          hotelcarddiv.appendChild(hoteltitlep);

          const hotelratingp = document.createElement("div");
          hotelratingp.className = "hotels-rating";
          hotelratingp.innerHTML =
            '<svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.9846 10.7967C10.967 10.7449 10.9347 10.6989 10.8912 10.6636C10.8478 10.6284 10.7949 10.6053 10.7385 10.5971L7.31189 10.1205L5.77952 7.16317C5.75406 7.11417 5.71476 7.07294 5.66605 7.04411C5.61733 7.01528 5.56114 7 5.50382 7C5.44649 7 5.3903 7.01528 5.34158 7.04411C5.29287 7.07294 5.25357 7.11417 5.22811 7.16317L3.69575 10.1205L0.270384 10.5901C0.21192 10.5969 0.156735 10.6196 0.111382 10.6554C0.0660294 10.6912 0.0324144 10.7388 0.0145294 10.7923C-0.00335554 10.8458 -0.00475898 10.9031 0.0104858 10.9574C0.0257305 11.0116 0.0569829 11.0606 0.100531 11.0984L2.5794 13.4077L1.99476 16.6561C1.98488 16.7102 1.99109 16.7658 2.01269 16.8167C2.03428 16.8675 2.07039 16.9116 2.11691 16.9439C2.16344 16.9761 2.21852 16.9953 2.2759 16.9992C2.33328 17.0032 2.39067 16.9917 2.44154 16.9661L5.50382 15.4293L8.56732 16.9649C8.61819 16.9905 8.67558 17.002 8.73296 16.9981C8.79034 16.9942 8.84543 16.975 8.89195 16.9427C8.93848 16.9104 8.97459 16.8663 8.99618 16.8155C9.01777 16.7646 9.02398 16.709 9.0141 16.6549L8.42824 13.4077L10.9071 11.0984C10.9483 11.0601 10.9774 11.0115 10.9912 10.9581C11.0049 10.9048 11.0026 10.8489 10.9846 10.7967Z" fill="#FFB421"/></svg>';
          hotelratingp.innerHTML += element.rating;
          hotelcarddiv.appendChild(hotelratingp);

          const hotelpricep = document.createElement("div");
          hotelpricep.className = "hotels-price";
          hotelpricep.innerHTML = element.price;
          const hotelview = document.createElement("button");
          hotelview.className = "hotels-view";
          hotelview.innerHTML =
            '<svg width="95" height="40" viewBox="0 0 95 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="95" height="40" rx="12" fill="#00254E" fill-opacity="0.6"/><path d="M32.0879 24L29.1582 15.5449H30.8047L32.9492 22.3887H32.9785L35.1289 15.5449H36.7754L33.8398 24H32.0879ZM40.0777 24V15.5449H41.5895V24H40.0777ZM45.4777 24V15.5449H50.9504V16.8164H46.9895V19.0957H50.7336V20.3203H46.9895V22.7285H50.9504V24H45.4777ZM56.4383 24L54.1707 15.5449H55.741L57.2117 21.9258H57.241L58.9344 15.5449H60.3055L61.9988 21.9258H62.0281L63.4988 15.5449H65.0691L62.8016 24H61.3426L59.6375 17.9355H59.6023L57.8973 24H56.4383Z" fill="white"/></svg>';
          hotelview.setAttribute("onclick", "window.open('" + element.booking_url + "', '_blank');");
          hotelpricep.appendChild(hotelview);
          hotelcarddiv.appendChild(hotelpricep);
          hotelcardcontainerdiv.appendChild(hotelcarddiv);
        }
      });
    } catch (e) {
      console.log("hotels UI:", e);
    } finally {
      return hotelcardcontainerdiv;
    }
  }

  hotelmoveSlide(event, next) {
    // console.log("event.target", event.target)
    let currentSlide =
      event.target.parentElement.parentElement.parentElement.querySelector(".hotels-image-slide.active");
    let currentDot = event.target.parentElement.parentElement.parentElement.querySelector(".hotels-dot.active");
    currentSlide.classList.remove("active");
    currentDot.classList.remove("active");

    if (next) {
      // Move to the next slide, or loop back to the first if at the end
      let nextSlide = currentSlide.nextElementSibling || currentSlide.parentNode.firstElementChild;
      nextSlide.classList.add("active");
      let nextDot = currentDot.nextElementSibling || currentDot.parentNode.firstElementChild;
      nextDot.classList.add("active");
    } else {
      // Move to the previous slide, or loop back to the last if at the beginning
      let prevSlide = currentSlide.previousElementSibling || currentSlide.parentNode.lastElementChild;
      prevSlide.classList.add("active");
      let prevDot = currentDot.previousElementSibling || currentDot.parentNode.lastElementChild;
      prevDot.classList.add("active");
    }
  }

  codefilter(event, Filter) {
    let targetElement = event.target;

    while (targetElement && targetElement.tagName !== "DIV") {
      targetElement = targetElement.parentElement;
    }

    if (targetElement) {
      let allitems = targetElement.parentElement.querySelectorAll(".codecard-filtercode");
      allitems.forEach((tab) => tab.classList.remove("active"));
      targetElement.classList.add("active");

      let codeactive = targetElement.parentElement.parentElement.querySelector(".codecard-data.active");
      let codenotactive = targetElement.parentElement.parentElement.querySelector(`.codecard-data.${Filter}`);
      if (codeactive) codeactive.classList.remove("active");
      if (codenotactive) codenotactive.classList.add("active");
    }
  }

  hotelfilter(event, Filter) {
    let targetElement = event.target;

    while (targetElement.tagName !== "DIV") {
      targetElement = targetElement.parentElement;
    }
    let clicked = targetElement.querySelector("#border");
    let HotelSearchResults = JSON.parse(targetElement.parentElement.parentElement.getAttribute("data-details"));
    let hotelcardcontainerdiv = targetElement.parentElement.parentElement.querySelector(".hotelscard-container");
    let allitems = targetElement.parentElement.querySelector(".hotelfilteractive");
    allitems.parentElement.classList.remove("hotelactive");
    allitems.classList.remove("hotelfilteractive");
    clicked.parentElement.classList.add("hotelactive");
    clicked.classList.add("hotelfilteractive");
    hotelcardcontainerdiv.remove();
    targetElement.parentElement.parentElement.appendChild(this.getHotelsFilterUI(HotelSearchResults, Filter));
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
