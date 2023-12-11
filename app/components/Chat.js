import Discussion from "./Discussion.js";
import { connect, StringCodec } from "https://cdn.jsdelivr.net/npm/nats.ws@latest/esm/nats.js";
// const uuid = "omega_" + crypto.randomUUID();
function decodeJwtResponse(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

class User {
  constructor(uuid, name, picture, email) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.email = email;
  }
}
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
    this.agentawaiting = false;
    this.domain = "";
    this.FlightSearch = "";
    this.FlightSearchResults = "";
    this.TaxiSearch = "";
    this.TaxiSearchResults = "";
    this.container = null;
    this.RAG_CHAT = "";
    this.MovieSearch = "";
    this.MovieSearchResults = "";
    this.user = this.getUser();
    this.deploy_ID = "";
  }
  getUser() {
    if (localStorage.getItem("googleToken")) {
      const responsePayload = decodeJwtResponse(localStorage.getItem("googleToken"));
      return new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
    } else {
      return null;
    }
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
      xhr.onreadystatechange = async () => {
        if (xhr.readyState == 4) {
          console.log(xhr.response);
          let text = JSON.parse(xhr.response);
          console.log(text.stream_id);
          let nc = await connect({
            servers: ["wss://ai.iamplus.services/tasks:8443"],
            user: "acc",
            pass: "user@123",
          });

          const stream_name = text.stream_id;
          console.log(stream_name);
          const js = nc.jetstream();
          const c = await js.consumers.get(stream_name, stream_name);
          let iter = await c.consume();
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

            //get UI and RAG params
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
              if (mdata.stream_status && mdata.stream_status == "ended") {
                this.callbacks.emitter.emit("endStream");
                this.callbacks.enableInput();
                await this.callbacks.addAIText({ text: "\n\n", container: this.container });
              }
            } else if (mdata.status == "Agent ended") {
              this.workflowID = "";
              this.awaiting = false;
              this.callbacks.enableInput();
              return;
            } else if (mdata.awaiting) {
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
              await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
              this.callbacks.emitter.emit("endStream");

              if (this.domain == "RAG_CHAT") {
                console.log("here RAG_CHAT:" + this.RAG_CHAT);
                // var displaytext = '<div><div class="productcard-container">';

                // this.RAG_CHAT.forEach((element) => {
                //   console.log("element:" + element);
                //   displaytext +=
                //     '<div class="product-card" data-info="product-details"  data-details=\'' +
                //     JSON.stringify(element).replace(/'/g, "&#39;") +
                //     '\' onclick="showProductDetail(this);return false;">';
                //   displaytext +=
                //     '<img src="' + element.image_url + '" alt="' + element.name + '" class="product-image">';
                //   displaytext += '<h3 class="product-name">' + element.name + "</h3>";
                //   displaytext += '<p class="product-price">' + element.price + "</p>";
                //   displaytext += '<div class="product-overlay"></div></div>';
                // });
                // displaytext += '</div><div id="product-details"></div></div>';
                // console.log("here displaytext:" + displaytext);
                // this.container.innerHTML += displaytext;

                this.getGucciUI();
                (this.domain = ""), (this.RAG_CHAT = "");
              } else if (this.domain == "MovieSearch") {
                this.getMovies();
                (this.domain = ""), (this.MovieSearchResults = ""), (this.MovieSearch = "");
              }
              this.callbacks.enableInput();
            } else if (mdata.status == "central finished") {
              // var mtext1 = mtext.slice(0, mtext.indexOf(":"));
              // var mtext2 = mtext.slice(mtext.indexOf(":") + 1, -1);
              // var AIAnswer = (await this.toTitleCase(mtext1)) + "<br/>" + (await this.toTitleCase2(mtext2));
              // if (this.sourcelang != "en") {
              //   var transresponse = await this.googletranslate(
              //     await this.toTitleCase2(mtext2),
              //     this.sourcelang,
              //     this.targetlang
              //   );
              //   mtext2 = transresponse.data.translations[0].translatedText;
              //   AIAnswer = (await this.toTitleCase(mtext1)) + "<br/>" + mtext2;
              // }
              // await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
              if (this.domain == "MovieSearch") {
                this.getMovies();
                (this.domain = ""), (this.MovieSearchResults = ""), (this.MovieSearch = "");
              } else if (this.domain == "TaxiSearch") {
                this.getTaxiUI();
                (this.TaxiSearchResults = ""), (this.TaxiSearch = ""), (this.domain = "");
              } else if (this.domain == "FlightSearch") {
                this.getFlightUI();
                (this.FlightSearch = ""), (this.domain = ""), (this.FlightSearchResults = "");
              }
            } else if (mdata.message_type == "status") {
              if (mtext != "") {
                var AIAnswer = await this.toTitleCase2(mtext);
                if (this.sourcelang != "en") {
                  var transresponse = await this.googletranslate(AIAnswer, this.sourcelang, this.targetlang);
                  AIAnswer = transresponse.data.translations[0].translatedText;
                }
                AIAnswer += "\n\n";
                await this.callbacks.addAIText({ text: AIAnswer, container: this.container });
              }
            }
            m.ack();
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
            // uuid: uuid + "@iamplus.com",
            uuid: this.deploy_ID,
          })
        );
      } else {
        xhr.open("POST", "https://ai.iamplus.services/workflow/tasks", true);
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
        message_type: "user_reply",
        user: "User",
        message: {
          type: "text",
          json: {},
          text: text,
        },
        user_data: {
          type: "image",
          url: filesurls[0],
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
      }
    });

    xhr.open("POST", "https://ai.iamplus.services/workflow/message/" + suworkflowid);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
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
    this.container.appendChild(moviesdiv);
  }

  showMovieDetail(event) {
    let element = event.target;
    let moviedetail = element.parentElement.parentElement.parentElement.querySelector("#movie-details");
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
      moviedetail.innerHTML = "";
      moviedetail.appendChild(moviedetailscarddiv);
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
        moviesdatetime.Time.forEach((moviestime) => {
          const moviedetailsshowtimebutton = document.createElement("button");
          moviedetailsshowtimebutton.className = "movie-details-showtime";
          moviedetailsshowtimebutton.innerHTML = moviestime.slice(0, -3);
          moviedetailsshowtimebutton.addEventListener("click", (event) =>
            this.submitmovieselection(MovieTitle, theatre.Name, moviesdatetime.Date, moviestime.slice(0, -3))
          );
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

  async submitmovieselection(MovieTitle, Theatre, Date, Time) {
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

      xhr.open("POST", "https://ai.iamplus.services/workflow/message/" + this.workflowID);
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
        this.container.appendChild(taxidiv);
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
          flightlogoimg.setAttribute("src", FlightSearchResult.travel.airlines_logo);
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
    this.container.appendChild(FlightContainerdiv);
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
    this.container.appendChild(productdiv);
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
