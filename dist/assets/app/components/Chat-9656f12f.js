var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import "../../scss/variables/_colors.module.scss-f9d2d4d4.js";
import { connect } from "https://cdn.jsdelivr.net/npm/nats.ws@latest/esm/nats.js";
const uuid = "omega_" + crypto.randomUUID();
class Chat {
  constructor(callbacks) {
    __publicField(this, "callsubmit", async (text, img, container) => {
      this.container = container;
      var input_text = text;
      if (this.sourcelang != this.targetlang) {
        var response = await this.googletranslate(input_text, this.targetlang, this.sourcelang);
        input_text = response.data.translations[0].translatedText;
        if (response.data.translations[0].detectedSourceLanguage)
          this.sourcelang = response.data.translations[0].detectedSourceLanguage;
      }
      if (this.awaiting && this.workflowID != "") {
        this.submituserreply(input_text, this.workflowID, img);
      } else {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = async () => {
          if (xhr.readyState == 4) {
            console.log(xhr.response);
            let text2 = JSON.parse(xhr.response);
            console.log(text2.stream_id);
            let nc = await connect({
              servers: ["wss://ai.iamplus.services/tasks:8443"],
              user: "acc",
              pass: "user@123"
            });
            const stream_name = text2.stream_id;
            console.log(stream_name);
            const js = nc.jetstream();
            const c = await js.consumers.get(stream_name, stream_name);
            let iter = await c.consume();
            nc.onclose = function(e) {
              console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
              setTimeout(async function() {
                console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
                nc = await connect({
                  servers: ["wss://ai.iamplus.services/tasks:8443"],
                  user: "acc",
                  pass: "user@123"
                });
              }, 1e3);
            };
            nc.onerror = function(err) {
              console.error("Socket encountered error: ", err.message, "Closing socket");
              ws.close();
            };
            for await (const m of iter) {
              var mdata = m.json();
              console.log(mdata);
              var mtext = mdata.data;
              if (mdata.streaming && mdata.streaming == true) {
                var AIAnswer = await this.toTitleCase2(mtext);
                if (this.sourcelang != "en") {
                  var transresponse = await this.googletranslate(
                    await this.toTitleCase2(mtext),
                    this.sourcelang,
                    this.targetlang
                  );
                  AIAnswer = transresponse.data.translations[0].translatedText;
                }
                this.container.innerHTML += AIAnswer;
                if (mdata.awaiting) {
                  this.workflowID = mdata.session_id;
                  this.awaiting = true;
                }
                if (mdata.stream_status && mdata.stream_status == "ended")
                  this.callbacks.enableInput();
              } else {
                if (mdata.message_type == "ui" || mdata.message_type == "conversation_question") {
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
                    console.log("domain RAG_CHAT:" + this.RAG_CHAT);
                  } else if (this.domain == "FlightSearch") {
                    this.FlightSearch = JSON.parse(mdata.ui_params.FlightSearch);
                    this.FlightSearchResults = JSON.parse(mdata.ui_params.FlightSearchResults);
                  }
                }
                if (mdata.status == "Agent ended") {
                  this.workflowID = "";
                  this.awaiting = false;
                  this.callbacks.enableInput();
                  return;
                } else if (mdata.status == "Generative LLM Output") {
                  var AIAnswer = await this.toTitleCase2(mtext);
                  if (this.sourcelang != "en") {
                    var transresponse = await this.googletranslate(
                      await this.toTitleCase2(mtext),
                      this.sourcelang,
                      this.targetlang
                    );
                    AIAnswer = transresponse.data.translations[0].translatedText;
                  }
                  await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
                } else {
                  if (mdata.status == "central finished") {
                    var mtext1 = mtext.slice(0, mtext.indexOf(":"));
                    var mtext2 = mtext.slice(mtext.indexOf(":") + 1, -1);
                    var AIAnswer = await this.toTitleCase(mtext1) + "<br/>" + await this.toTitleCase2(mtext2);
                    if (this.sourcelang != "en") {
                      var transresponse = await this.googletranslate(
                        await this.toTitleCase2(mtext2),
                        this.sourcelang,
                        this.targetlang
                      );
                      mtext2 = transresponse.data.translations[0].translatedText;
                      AIAnswer = await this.toTitleCase(mtext1) + "<br/>" + mtext2;
                    }
                    await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
                    if (this.domain == "MovieSearch") {
                      var displaytext = '<div><div class="moviescard-container">';
                      this.MovieSearchResults.forEach((element) => {
                        displaytext += `<div class="movies-card" data-info="movies-details"  data-details='` + JSON.stringify(element).replace(/'/g, "&#39;") + `' onclick="showMovieDetail(this);return false;">`;
                        displaytext += '<img src="' + element.MoviePoster + '" alt="' + element.MovieTitle.replace(/'/g, "&#39;") + '" class="movies-image">';
                        displaytext += '<p class="movies-title">' + element.MovieTitle + "</p>";
                        displaytext += "</div>";
                      });
                      displaytext += '</div><div id="movie-details"></div></div>';
                      this.container.innerHTML += displaytext;
                      this.domain = "", this.MovieSearchResults = "", this.MovieSearch = "";
                    } else if (this.domain == "TaxiSearch") {
                      let str = '<div class="rides-list-wrapper">';
                      let data = this.TaxiSearchResults;
                      console.log("data:" + data);
                      for (let taxii = 0; taxii < data.services.length; taxii++) {
                        let service = data.services[taxii];
                        if (service) {
                          str = str + '<div class="rides-list-item"><div class="rides-list-item-header"><figure class="rides-list-item-header-logo"><img src="./images/logo/' + service.provider + '-logo.svg" alt="' + service.provider + '"/></figure>';
                          if (service.name.includes("TAXI_HAILING"))
                            str = str + '<div class="rides-list-item-header-info"><p>Taxi Hailing</p>';
                          else
                            str = str + '<div class="rides-list-item-header-info"><p>' + service.name + "</p>";
                          str = str + "<p>" + service.description + "</p>";
                          str = str + "<p>" + service.seats + " seats</p>";
                          if (service.deeplink)
                            str = str + '<a href="' + service.deeplink + '" target="_blank">Link</a>';
                          str = str + "</div></div>";
                          str = str + '<div class="rides-list-item-content"><div class="rides-list-item-content-prices">';
                          if (service.price) {
                            if (service.price.length > 1)
                              str = str + "<span>$</span><span>" + service.price[0] + "-" + service.price[1] + "</span></div>" + (taxii == 0 ? '<span class="rides-list-item-content-sticker">cheapest</span>' : "");
                            else
                              str = str + "<span>$</span><span>" + service.price + "</span></div>" + (taxii == 0 ? '<span class="rides-list-item-content-sticker">cheapest</span>' : "");
                          } else {
                            str = str + "<span></span><span></span></div>";
                          }
                          str = str + "</div></div>";
                        }
                      }
                      str = str + "</div>";
                      this.container.innerHTML += str;
                      this.TaxiSearchResults = "";
                      this.TaxiSearch = "";
                      this.domain = "";
                    } else if (this.domain == "FlightSearch") {
                      let flightsresultsstr = '<div class="FlightContainer Flight-Container" name="flightResult">';
                      if (this.FlightSearch.departure_end_date.length > 0 && this.FlightSearch.return_end_date.length > 0) {
                        flightsresultsstr += '<div class="flight-toggle-button-container">';
                        flightsresultsstr += '<button id="Outbound" class="flight-toggle-button active" onclick="toggleflights(this);return false;">Outbound</button>';
                        flightsresultsstr += '<button id="Return" class="flight-toggle-button" onclick="toggleflights(this);return false;">Return</button>';
                        flightsresultsstr += "</div>";
                      }
                      let FlightSearchResultsArr = this.FlightSearchResults.Outbound;
                      for (let flightsi = 0; flightsi < 2; flightsi++) {
                        if (flightsi == 1)
                          FlightSearchResultsArr = this.FlightSearchResults.Return;
                        if (FlightSearchResultsArr.length > 0) {
                          if (flightsi == 0)
                            flightsresultsstr += '<div class="flightResult" id="flightResultOutbound">';
                          if (flightsi == 1)
                            flightsresultsstr += '<div class="flightResult" style="display:None" id="flightResultReturn">';
                          let flightcheapest = 0;
                          FlightSearchResultsArr.forEach((FlightSearchResult) => {
                            flightsresultsstr += '<div class="flightCard">';
                            flightsresultsstr += '<div class="rowFlightCard "><div class="logoFight"><div>';
                            flightsresultsstr += '<img src="' + FlightSearchResult.travel.airlines_logo + '" alt="" style="height: 40px;mix-blend-mode: multiply;">';
                            flightsresultsstr += "</div></div>";
                            flightsresultsstr += '<div class="flghtCost">';
                            flightsresultsstr += '<span class="currency">USD</span>';
                            flightsresultsstr += '<p class="big">' + FlightSearchResult.price.split("$")[1] + "</p>";
                            flightsresultsstr += "</div></div>";
                            flightsresultsstr += '<div class="rowFlightCard ">';
                            flightsresultsstr += '<div class="start">';
                            flightsresultsstr += "<span>" + FlightSearchResult.airport1_code + "</span>";
                            flightsresultsstr += '<p class="big">' + FlightSearchResult.travel.start_time.split("\n")[0] + (FlightSearchResult.travel.start_time.split("\n")[1] ? '<span class="small">' + FlightSearchResult.travel.start_time.split("\n")[1] + "</span>" : "") + "</p>";
                            flightsresultsstr += "</div>";
                            flightsresultsstr += '<div class="duration">';
                            flightsresultsstr += '<p class="timeHourMin">' + FlightSearchResult.travel.duration.split("h")[0] + '<span style="color: rgba(0, 0, 0, 0.40);">h</span> ' + FlightSearchResult.travel.duration.substring(
                              FlightSearchResult.travel.duration.indexOf(" "),
                              FlightSearchResult.travel.duration.indexOf("m")
                            );
                            flightsresultsstr += '<span style="color: rgba(0, 0, 0, 0.40);">m</span></p>';
                            flightsresultsstr += '<div class="dDirection">';
                            flightsresultsstr += '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.053 15.5789L12 24L10 24L12.526 15.5789L7.166 15.5789L5.5 18.7368L4 18.7368L5 14L4 9.26316L5.5 9.26316L7.167 12.4211L12.527 12.4211L10 4L12 4L17.053 12.4211L22.5 12.4211C22.8978 12.4211 23.2794 12.5874 23.5607 12.8835C23.842 13.1796 24 13.5812 24 14C24 14.4188 23.842 14.8204 23.5607 15.1165C23.2794 15.4126 22.8978 15.5789 22.5 15.5789L17.053 15.5789Z" fill="black" fill-opacity="0.4"/></svg>';
                            if (FlightSearchResult.travel.stops == 0) {
                              flightsresultsstr += '<svg xmlns="http://www.w3.org/2000/svg" width="152" height="28" viewBox="0 0 152 28" fill="none">';
                              flightsresultsstr += '<line x1="0.6" y1="13.4" x2="151.4" y2="13.4" stroke="black" stroke-opacity="0.4" stroke-width="1.2"';
                              flightsresultsstr += 'stroke-linecap="round" stroke-dasharray="0.1 4" />';
                              flightsresultsstr += "</svg>";
                            } else {
                              flightsresultsstr += '<svg width="136" height="28" viewBox="0 0 136 28" fill="none" xmlns="http://www.w3.org/2000/svg">';
                              flightsresultsstr += '<line x1="0.6" y1="13.4" x2="58.4" y2="13.4" stroke="black" stroke-opacity="0.4" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="0.1 4"/>';
                              flightsresultsstr += '<g clip-path="url(#clip0_10855_133720)">';
                              flightsresultsstr += '<circle cx="68" cy="14" r="3.00002" stroke="black" stroke-opacity="0.4" stroke-width="1.50001"/>';
                              flightsresultsstr += "</g>";
                              flightsresultsstr += '<line x1="77.1" y1="13.4" x2="134.9" y2="13.4" stroke="black" stroke-opacity="0.4" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="0.1 4"/>';
                              flightsresultsstr += "<defs>";
                              flightsresultsstr += '<clipPath id="clip0_10855_133720">';
                              flightsresultsstr += '<rect width="18" height="28" fill="white" transform="translate(58.5)"/>';
                              flightsresultsstr += "</clipPath>";
                              flightsresultsstr += "</defs>";
                              flightsresultsstr += "</svg>";
                            }
                            flightsresultsstr += '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">';
                            flightsresultsstr += '<circle cx="9.50002" cy="10.0001" r="3.75002" fill="black" fill-opacity="0.4" />';
                            flightsresultsstr += "</svg>";
                            flightsresultsstr += "</div>";
                            if (FlightSearchResult.travel.stops == 0) {
                              flightsresultsstr += '<p class="direction">Direct</p>';
                            } else if (FlightSearchResult.travel.stops == 1) {
                              flightsresultsstr += '<p class="direction">' + FlightSearchResult.travel.stops + " connection</p>";
                            } else {
                              flightsresultsstr += '<p class="direction">' + FlightSearchResult.travel.stops + " connections</p>";
                            }
                            flightsresultsstr += "</div>";
                            flightsresultsstr += '<div class="destination">';
                            flightsresultsstr += "<span>" + FlightSearchResult.airport2_code + "</span>";
                            flightsresultsstr += '<p class="big">' + FlightSearchResult.travel.end_time.split("\n")[0] + (FlightSearchResult.travel.end_time.split("\n")[1] ? '<span class="small">' + FlightSearchResult.travel.end_time.split("\n")[1] + "</span>" : "") + "</p>";
                            flightsresultsstr += "</div>";
                            flightsresultsstr += "</div>";
                            if (flightcheapest == 0)
                              flightsresultsstr += '<div class="recommand">CHEAPEST</div>';
                            flightsresultsstr += '<div class="site">' + FlightSearchResult.website + "</div>";
                            flightsresultsstr += "</div>";
                            flightcheapest++;
                          });
                          flightsresultsstr += "</div>";
                        }
                      }
                      flightsresultsstr += "</div>";
                      this.container.innerHTML += flightsresultsstr;
                      this.FlightSearch = "", this.domain = "", this.FlightSearchResults = "";
                    }
                  } else {
                    if (mdata.awaiting) {
                      console.log("awaiting:" + mdata.message_type);
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
                      await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
                      if (mdata.message_type != "conversation_question")
                        ;
                      console.log("domain:" + this.domain);
                      if (this.domain == "RAG_CHAT") {
                        console.log("here RAG_CHAT:" + this.RAG_CHAT);
                        var displaytext = '<div><div class="productcard-container">';
                        this.RAG_CHAT.forEach((element) => {
                          console.log("element:" + element);
                          displaytext += `<div class="product-card" data-info="product-details"  data-details='` + JSON.stringify(element).replace(/'/g, "&#39;") + `' onclick="showProductDetail(this);return false;">`;
                          displaytext += '<img src="' + element.image_url + '" alt="' + element.name + '" class="product-image">';
                          displaytext += '<h3 class="product-name">' + element.name + "</h3>";
                          displaytext += '<p class="product-price">' + element.price + "</p>";
                          displaytext += '<div class="product-overlay"></div></div>';
                        });
                        displaytext += '</div><div id="product-details"></div></div>';
                        console.log("here displaytext:" + displaytext);
                        this.container.innerHTML += displaytext;
                        this.domain = "", this.RAG_CHAT = "";
                      }
                      this.callbacks.enableInput();
                    } else {
                      if (mtext != "") {
                        var mtext1 = mtext.slice(0, mtext.indexOf(":"));
                        var mtext2 = mtext.slice(mtext.indexOf(":") + 1, -1);
                        var AIAnswer = await this.toTitleCase(mtext1) + "<br/>" + await this.toTitleCase2(mtext2);
                        await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
                      }
                    }
                  }
                }
              }
              m.ack();
            }
            nc.drain();
          }
        };
        xhr.addEventListener("error", async function(e) {
          console.log("error: " + e);
          var AIAnswer = "An error occurred while attempting to connect.";
          await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
          this.callbacks.enableInput();
        });
        if (this.sessionID && this.sessionID != "") {
          xhr.open("POST", "https://ai.iamplus.services/workflow/conversation", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(
            JSON.stringify({
              session_id: this.sessionID,
              uuid: uuid + "@iamplus.com"
            })
          );
        } else {
          xhr.open("POST", "https://ai.iamplus.services/workflow/tasks", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(
            JSON.stringify({
              query: input_text,
              uuid: uuid + "@iamplus.com"
            })
          );
        }
      }
    });
    __publicField(this, "translate", (text, lang) => new Promise(async (resolve, reject) => {
      var data = JSON.stringify([{ text }]);
      console.log("text:" + text);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function() {
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
      xhr.addEventListener("error", function(e) {
        console.log("error: " + e);
        reject(e);
      });
      xhr.send(data);
    }));
    __publicField(this, "googletranslate", (text, lang, sourcelang) => new Promise(async (resolve, reject) => {
      var xhr = new XMLHttpRequest();
      var url = "https://translation.googleapis.com/language/translate/v2";
      var apiKey = "AIzaSyC1I58b1AR5z5V0b32ROnw55iFUjVso5dY";
      xhr.open("POST", `${url}?key=${apiKey}`, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
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
        source: sourcelang
      });
      xhr.send(data);
    }));
    this.callbacks = callbacks;
    this.autodetect = null;
    this.targetlang = "en";
    this.sourcelang = "en";
    this.location = "US";
    this.sessionID = "";
    this.workflowID = "";
    this.awaiting = false;
    this.domain = "";
    this.FlightSearch = "";
    this.FlightSearchResults = "";
    this.TaxiSearch = "";
    this.TaxiSearchResults = "";
    this.container = null;
    this.RAG_CHAT = "";
    this.MovieSearch = "";
    this.MovieSearchResults = "";
  }
  toTitleCase(str) {
    str = str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    str = str.replaceAll("\n", "<br>");
    return str;
  }
  toTitleCase2(str) {
    str = str.replaceAll("\n", "<br>");
    return str;
  }
  truncate(str) {
    var n = 200;
    return str && str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
  }
  submituserreply(text, suworkflowid, filesurls) {
    var data = "";
    if (filesurls && filesurls.length > 0) {
      data = JSON.stringify({
        message_type: "user_reply",
        user: "User",
        message: {
          type: "text",
          json: {},
          text
        },
        user_data: {
          type: "image",
          url: filesurls[0]
        }
      });
    } else {
      data = JSON.stringify({
        message_type: "user_reply",
        user: "User",
        message: {
          type: "text",
          json: {},
          text
        }
      });
    }
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    xhr.open("POST", "https://ai.iamplus.services/workflow/message/" + suworkflowid);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  }
}
export {
  Chat as default
};
