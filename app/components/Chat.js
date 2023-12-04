import Discussion from "./Discussion.js";
import { connect, StringCodec } from "https://cdn.jsdelivr.net/npm/nats.ws@1.17.0/esm/nats.js";

const uuid = "omega_" + crypto.randomUUID();

class Chat {
  constructor(callbacks) {
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
    this.MovieTitle = "";
    this.Theatre = "";
    this.StartDate = "";
    this.EndDate = "";
    this.StartTime = "";
    this.EndTime = "";
    this.Source = "";
    this.Destination = "";
    this.container = null;
    this.RAG_CHAT = "";
    this.FlightSearch = "";
    this.FlightSearchResults = "";
  }
  callsubmit = async (text, img, container) => {
    this.container = container;
    var input_text = text;
    var original_text = input_text;
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
      // xhr.onreadystatechange = async function () {
      xhr.onreadystatechange = async () => {
        if (xhr.readyState == 4) {
          console.log(xhr.response);
          let text = JSON.parse(xhr.response);
          console.log(text.stream_id);
          const sc = new StringCodec();
          let nc = await connect({
            servers: ["wss://ai.iamplus.services/tasks:8443"],
            user: "acc",
            pass: "user@123",
          });

          const stream_name = text.stream_id;
          console.log(stream_name);
          const js = nc.jetstream();
          const c = await js.consumers.get(stream_name, stream_name);
          let iter = await c.fetch({ expires: 200000000 });
          nc.onclose = function (e) {
            console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
            setTimeout(async function () {
              console.log("Socket is closed. Reconnect will be attempted in 1 second.", e.reason);
              nc = await connect({
                servers: ["wss://ai.iamplus.services/tasks:8443"],
                user: "acc",
                pass: "user@123",
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
            var mtext = mdata.data;
            m.ack();
            if (mdata.message_type == "ui" || mdata.message_type == "conversation_question") {
              this.domain = mdata.ui_params.domain;
              console.log("domain:" + this.domain);
              if (this.domain == "MovieSearch") {
                let moviedata = JSON.parse(mdata.ui_params.MovieSearch);
                if (moviedata.movie_name != undefined && moviedata.movie_name != "")
                  this.MovieTitle = moviedata.movie_name
                if (moviedata.theatre_name != undefined && moviedata.theatre_name != "")
                  this.Theatre = moviedata.theatre_name
                if (moviedata.start_date != undefined && moviedata.start_date != "")
                  this.StartDate = moviedata.start_date
                if (moviedata.end_date != undefined && moviedata.end_date != "")
                  this.EndDate = moviedata.end_date
                if (moviedata.start_time != undefined && moviedata.start_time != "")
                  this.StartTime = moviedata.start_time
                if (moviedata.end_time != undefined && moviedata.end_time != "")
                  this.EndTime = moviedata.end_time
              } else if (this.domain == "TaxiSearch") {
                let ridesdata = JSON.parse(mdata.ui_params.TaxiSearch);
                if (ridesdata.source != undefined && ridesdata.source != "")
                  this.Source = ridesdata.source
                if (ridesdata.destination != undefined && ridesdata.destination != "")
                  this.Destination = ridesdata.destination
              } else if (this.domain == "RAG_CHAT") {
                this.RAG_CHAT = JSON.parse(mdata.ui_params.RAG_CHAT);
                console.log("domain RAG_CHAT:" + this.RAG_CHAT)
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
                var transresponse = await this.googletranslate(await this.toTitleCase2(mtext), this.sourcelang, this.targetlang);
                AIAnswer = transresponse.data.translations[0].translatedText;
              }
              await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
            } else {
              if (mdata.status == "central finished") {
                var mtext1 = mtext.slice(0, mtext.indexOf(":"));
                var mtext2 = mtext.slice(mtext.indexOf(":") + 1, -1);
                var AIAnswer = await this.toTitleCase(mtext1) + "<br/>" + await this.toTitleCase2(mtext2);
                if (this.sourcelang != "en") {
                  var transresponse = await this.googletranslate(await this.toTitleCase2(mtext2), this.sourcelang, this.targetlang);
                  mtext2 = transresponse.data.translations[0].translatedText;
                  AIAnswer = await this.toTitleCase(mtext1) + "<br/>" + mtext2;
                }
                await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
                if (this.domain == "MovieSearch") {
                  target.innerHTML += '<div class="movie-list" id="movie-list' + y + '"><div class="card-group"><div class="movie-list-wrapper" id="movie-list-wrapper' + y + '"><ul class="movie-list-content" id="movietile' + y + '"></ul></div><button class="movie-list-button" id="movie-list-button' + y + '" onclick="expands(' + y + ');return false;"><i class="fa fa-angle-down"></i></button></div></div><div class="movie" id ="moviedetails' + y + '"></div>';
                  getMovies(
                    this.MovieTitle,
                    this.Theatre,
                    this.StartDate,
                    this.EndDate,
                    this.StartTime,
                    this.EndTime,
                    y,
                    mdata.session_id
                  );
                  this.MovieTitle = "", this.Theatre = "", this.StartDate = "", this.EndDate = "", this.StartTime = "", this.EndTime = "", this.domain = "";
                  y++;
                } else if (this.domain == "TaxiSearch") {
                  // con.className = "console-underscore stopani hidden";
                  this.container.innerHTML += '<div class="ridesinput-container"><div class="ridesinput-card"><div class="ridesinput-content" id="ridesinput-source' + (x - 1) + '"><span class="ridesinfo">From</span><p id="ridesinputdetails-source' + (x - 1) + '" contenteditable="true">' + Source + '</p></div><div class="autocomplete-results" id="source-autocomplete-results' + (x - 1) + '"></div><div class="ridesinput-icon-right" id="editBtn-source' + (x - 1) + '"><img src="./images/pencil.svg"/></div></div><div class="ridesinput-card"><div class="ridesinput-content" id="ridesinput-dest' + (x - 1) + '"><span class="ridesinfo">To</span><p id="ridesinputdetails-dest' + (x - 1) + '" contenteditable="true">' + Destination + '</p></div> <div class="autocomplete-results" id="dest-autocomplete-results' + (x - 1) + '"></div><div class="ridesinput-icon-right" id="editBtn-dest' + (x - 1) + '"><img src="./images/pencil.svg"/></div></div></div><div class="rides-list" id="rides-list' + (x - 1) + '"></div><div class="console-underscore hidden" id="taxiconsole' + (x - 1) + '">&nbsp;</div>';
                  var myDivsource = document.getElementById("ridesinput-source" + (x - 1));
                  var myDivsdest = document.getElementById("ridesinput-dest" + (x - 1));
                  var mypsource = myDivsource.querySelector("p");
                  var mypdest = myDivsdest.querySelector("p");
                  var myDivsourceac = document.getElementById("source-autocomplete-results" + (x - 1));
                  var myDivsdestac = document.getElementById("dest-autocomplete-results" + (x - 1));
                  var ridelist = document.getElementById("rides-list" + (x - 1));
                  let taxicons = "taxiconsole" + (x - 1);
                  let taxicon = document.getElementById(taxicons);
                  mypsource.addEventListener("click", function () {
                    mypsource.focus();
                    var range = document.createRange();
                    var selection = window.getSelection();
                    range.selectNodeContents(mypsource);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    mypsource.addEventListener("keyup", async function (e) {
                      autocomplete(myDivsource, myDivsourceac, ridelist, taxicon, false);
                    });
                  });
                  mypdest.addEventListener("click", function () {
                    mypdest.focus();
                    var range = document.createRange();
                    var selection = window.getSelection();
                    range.selectNodeContents(mypdest);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    mypdest.addEventListener("keyup", async function (e) {
                      autocomplete(myDivsdest, myDivsdestac, ridelist, taxicon, false);
                    });
                  });
                  autocomplete(myDivsource, myDivsourceac, ridelist, taxicon, true);
                  autocomplete(myDivsdest, myDivsdestac, ridelist, taxicon, true);
                  this.Source = "", this.Destination = "", this.domain = "";
                } else if (this.domain == "FlightSearch") {
                  let flightsresultsstr = '<div class="FlightContainer Flight-Container" name="flightResult">';
                  if (FlightSearch.departure_end_date.length > 0 && FlightSearch.return_end_date.length > 0) {
                    flightsresultsstr += '<div class="flight-toggle-button-container">';
                    flightsresultsstr += '<button id="Outbound" class="flight-toggle-button active" onclick="toggleflights(this);return false;">Outbound</button>';
                    flightsresultsstr += '<button id="Return" class="flight-toggle-button" onclick="toggleflights(this);return false;">Return</button>';
                    flightsresultsstr += "</div>";
                  }
                  let FlightSearchResultsArr = FlightSearchResults.Outbound;
                  for (let flightsi = 0; flightsi < 2; flightsi++) {
                    if (flightsi == 1)
                      FlightSearchResultsArr = FlightSearchResults.Return;
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
                  target.innerHTML += flightsresultsstr;
                  this.FlightSearch = "", this.domain = "", this.FlightSearchResults = "";
                }
              } else {
                if (mdata.awaiting) {
                  console.log("awaiting:" + mdata.message_type);
                  this.workflowID = mdata.session_id;
                  this.awaiting = true;
                  var AIAnswer = await this.toTitleCase2(mtext);
                  if (this.sourcelang != "en") {
                    var transresponse = await this.googletranslate(await this.toTitleCase2(mtext), this.sourcelang, this.targetlang);
                    AIAnswer = transresponse.data.translations[0].translatedText;
                  }
                  await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
                  if (mdata.message_type != "conversation_question")
                    ;
                  console.log("domain:" + this.domain);

                  if (this.domain == "RAG_CHAT") {
                    console.log("here RAG_CHAT:" + this.RAG_CHAT)
                    var displaytext = '<div><div class="productcard-container">';

                    this.RAG_CHAT.forEach(element => {
                      console.log("element:" + element);
                      displaytext += '<div class="product-card" data-info="product-details"  data-details=\'' + JSON.stringify(element).replace(/'/g, '&#39;') + '\' onclick="showproductdetail(this);return false;">';
                      displaytext += '<img src="' + element.image_url + '" alt="' + element.name + '" class="product-image">';
                      displaytext += '<h3 class="product-name">' + element.name + '</h3>';
                      // displaytext += '<p class="product-description">' + truncate(element.desc) + '</p>';
                      displaytext += '<p class="product-price">' + element.price + '</p>';
                      // displaytext += '<a href="' + element.link_url + '" class="product-link" target="_blank">Buy</a>';
                      displaytext += '<div class="product-overlay"></div></div>';
                    });
                    displaytext += '</div><div id="product-details"></div></div>';
                    console.log("here displaytext:" + displaytext)
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
          nc.drain();
        }
      };

      xhr.addEventListener("error", async function (e) {
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
            uuid: uuid + "@iamplus.com",
          })
        );
      } else {
        xhr.open("POST", "https://ai.iamplus.services/workflow/tasks", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(
          JSON.stringify({
            query: input_text,
            uuid: uuid + "@iamplus.com",
          })
        );
      }
    }
  };
  translate = (text, lang) =>
    new Promise(async (resolve, reject) => {
      var data = JSON.stringify([{ text: text }]);
      console.log("text:" + text);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          var response = JSON.parse(this.responseText);
          // console.log(response[0].translations[0].text);
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
            // console.log(jsonResponse.data.translations[0].translatedText);
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
  submituserreply(text, suworkflowid, filesurls) {
    var data = "";
    if (filesurls && filesurls.length > 0) {
      data = JSON.stringify({
        "message_type": "user_reply",
        "user": "User",
        "message": {
          "type": "text",
          "json": {},
          "text": text
        },
        "user_data": {
          "type": "image",
          "url": filesurls[0]
        }
      });
    } else {
      data = JSON.stringify({
        "message_type": "user_reply",
        "user": "User",
        "message": {
          "type": "text",
          "json": {},
          "text": text
        }
      });
    }

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("PUT", "https://ai.iamplus.services/workflow/message/" + suworkflowid);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  }
}
export { Chat as default };
