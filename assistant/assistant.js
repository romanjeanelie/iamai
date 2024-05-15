import { getUser, redirectToLogin } from "../app/User";
import uploadFiles from "../app/utils/uploadFiles";

var btnsubmit,
  txtname,
  txtprompt,
  txtsearchfields,
  chkstream,
  chkagent,
  chkretrieval,
  richresultstoggle,
  sectionlinks,
  sectionassistant,
  sectionassistantstatus,
  filesToUpload,
  links,
  assistantlist,
  webtogglebutton,
  systemassistantlist,
  sectionsystemassistant,
  txtuserprompt,
  btnaddassistant,
  btncloseassistant,
  btnaddInputField;
let loggedinuser;
const URL = import.meta.env.VITE_API_URL || "https://app.asterizk.ai/index.html?lang=ad&session_id=";
const HOST = import.meta.env.VITE_API_HOST || "https://api.asterizk.ai";
const DB_HOST = import.meta.env.VITE_API_DB_HOST || "https://nocodb.asterizk.ai";
const DB_TOKEN = import.meta.env.VITE_API_DB_TOKEN || "juIbsot-ERPsSlO3TdkYHRJPznr1gqrLBIpMjWZU";
const DB_TABLE_ASSISTANT_ID = import.meta.env.VITE_API_DB_TABLE_ASSISTANT_ID || "m5aeqzjetzwiw9q";
const DB_TABLE_SYSTEMASSISTANT_ID = import.meta.env.VITE_API_DB_TABLE_SYSTEMASSISTANT_ID || "mjf87ylyjqkbhjv";
const ELASTIC_URL = import.meta.env.VITE_API_ELASTIC_URL || "https://api.asterizk.ai/elastic/text/bulk_index_urls";
const ELASTIC_TOKEN = import.meta.env.VITE_API_ELASTIC_TOKEN || "iIPyByKL-3X48AzXvme9onV9p94GwrmWTqV7P5jQ";

window.onload = async function () {
  // Use this instead
  loggedinuser = await getUser();
  if (!loggedinuser) window.location.href = "../index.html";
  else {
    getassistant();
    getsystemassistant();
  }
};

window.addEventListener("DOMContentLoaded", load);
async function load() {
  btnsubmit = document.getElementById("btnsubmit");
  txtname = document.getElementById("txtname");
  txtprompt = document.getElementById("txtprompt");
  txtuserprompt = document.getElementById("txtuserprompt");
  chkretrieval = document.getElementById("retrieval-toggle");
  webtogglebutton = document.getElementById("web-search-toggle");
  sectionlinks = document.getElementById("sectionlinks");
  sectionassistant = document.getElementById("sectionassistant");
  sectionassistantstatus = document.getElementById("sectionassistantstatus");
  filesToUpload = document.getElementById("filesToUpload");
  links = document.getElementsByName("inputField[]");
  assistantlist = document.getElementById("assistantlist");
  systemassistantlist = document.getElementById("systemassistantlist");
  sectionsystemassistant = document.getElementById("sectionsystemassistant");
  txtsearchfields = document.getElementById("txtsearchfields");
  richresultstoggle = document.getElementById("rich-results-toggle");
  chkstream = document.getElementById("stream-toggle");
  chkagent = document.getElementById("agent-toggle");
  btnaddassistant = document.getElementById("btnaddassistant");
  btncloseassistant = document.getElementById("btncloseassistant");
  btnaddInputField = document.getElementById("btnaddInputField");

  sectionsystemassistant.style.display = "none";
  sectionassistant.style.display = "none";
  sectionassistantstatus.style.display = "none";
  sectionlinks.style.display = "none";
  btnaddInputField.addEventListener("click", async function (e) {
    addInputField();
  });
  btncloseassistant.addEventListener("click", async function (e) {
    closeassistant();
  });
  btnaddassistant.addEventListener("click", async function (e) {
    addassistant();
  });
  btnsubmit.addEventListener("click", async function (e) {
    saveassistant();
  });
  filesToUpload.addEventListener("change", function () {
    displayFileName();
  });
  chkretrieval.addEventListener("change", function () {
    if (this.checked) {
      sectionlinks.style.display = "block";
    } else {
      sectionlinks.style.display = "none";
    }
  });
}

// class User {
//   constructor(uuid, name, picture, email) {
//     this.uuid = uuid;
//     this.name = name;
//     this.picture = picture;
//     this.email = email;
//     this.timezone = getUserTimezone();
//     this.area_name = "";
//     this.country_name = "";
//     this.pincode = "";
//     this.iso_2d_country_code = "";
//     this.administrative_area_level_1 = "";
//     this.administrative_area_level_2 = "";
//   }
//   async setuseraddress() {
//     let address = await getaddressdetails();
//     this.area_name = address.area_name;
//     this.country_name = address.country_name;
//     this.pincode = address.pincode;
//     this.iso_2d_country_code = address.iso_2d_country_code;
//     this.administrative_area_level_1 = address.administrative_area_level_1;
//     this.administrative_area_level_2 = address.administrative_area_level_2;
//   }
// }

function addInputField() {
  // Create a new input element
  var newInput = document.createElement("input");
  newInput.type = "text";
  newInput.name = "inputField[]";
  newInput.placeholder = "Enter link";

  // Append this new input to the input-form div
  document.getElementById("input-form").appendChild(newInput);
}

function addassistant() {
  sectionsystemassistant.style.display = "none";
  sectionassistantstatus.style.display = "none";
  sectionassistant.style.display = "block";
}

function closeassistant() {
  sectionassistant.style.display = "none";
  sectionassistantstatus.style.display = "block";
  sectionsystemassistant.style.display = "block";
}

async function saveassistant() {
  if (txtname.value.length > 0 && txtprompt.value.length > 0) {
    btnsubmit.style.display = "none";
    var urls = "";
    var filesurls = "";
    // links
    links.forEach(function (input) {
      urls = urls + input.value + ";";
    });
    if (urls.length > 0) urls = urls.slice(0, -1);

    if (filesToUpload.files.length > 0) filesurls = await uploadFiles(filesToUpload.files);

    // console.log()
    // WARNING: For POST requests, body is set to null by browsers.
    var data = "";
    if (txtsearchfields.value.length > 0) {
      data = JSON.stringify({
        Title: txtname.value,
        Prompt: txtprompt.value,
        Retrieval: chkretrieval.checked.toString(),
        URL: urls,
        Files: filesurls,
        UUID: loggedinuser.uuid,
        WebSearch: webtogglebutton.checked.toString(),
        store_search_fields: txtsearchfields.value,
        rich_results: richresultstoggle.checked.toString(),
        user_prompt: txtuserprompt.value,
        generate_stream: chkstream.checked.toString(),
        agent_enabled: chkagent.checked.toString(),
        Status: "Created",
      });
    } else {
      data = JSON.stringify({
        Title: txtname.value,
        Prompt: txtprompt.value,
        Retrieval: chkretrieval.checked.toString(),
        URL: urls,
        Files: filesurls,
        UUID: loggedinuser.uuid,
        WebSearch: webtogglebutton.checked.toString(),
        rich_results: richresultstoggle.checked.toString(),
        user_prompt: txtuserprompt.value,
        generate_stream: chkstream.checked.toString(),
        agent_enabled: chkagent.checked.toString(),
        Status: "Created",
      });
    }

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // console.log(this.responseText);
        // location.reload();
        resetData();
        getassistant();
        sectionassistant.style.display = "none";
        sectionassistantstatus.style.display = "block";
        sectionsystemassistant.style.display = "block";
        btnsubmit.style.display = "block";
      }
    });

    xhr.open("POST", DB_HOST + "/api/v2/tables/" + DB_TABLE_ASSISTANT_ID + "/records");
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("xc-token", DB_TOKEN);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  } else {
    btnsubmit.style.display = "block";
  }
}

async function duplicate(itemid) {
  let assistant = await getsystemassistant_itemid(itemid);

  // console.log("system assistant:" + assistant);
  // WARNING: For POST requests, body is set to null by browsers.
  var data = JSON.stringify({
    Title: assistant.Title,
    Prompt: assistant.Prompt,
    Retrieval: assistant.Retrieval,
    URL: assistant.URL,
    Files: assistant.Files,
    UUID: loggedinuser.uuid,
    Status: "Ready To Deploy",
    DataStoreName: assistant.DataStoreName,
    WebSearch: assistant.WebSearch,
    store_search_fields: assistant.store_search_fields,
    rich_results: assistant.rich_results,
    entity_search_in_results: assistant.entity_search_in_results,
    agent_enabled: assistant.agent_enabled,
    user_prompt: assistant.user_prompt,
    generate_stream: assistant.generate_stream,
    system_assistantID: assistant.system_assistantID,
  });

  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      // console.log(this.responseText);
      // location.reload();
      getassistant();
      sectionassistant.style.display = "none";
      sectionassistantstatus.style.display = "block";
      sectionsystemassistant.style.display = "block";
    }
  });

  xhr.open("POST", DB_HOST + "/api/v2/tables/" + DB_TABLE_ASSISTANT_ID + "/records");
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("xc-token", DB_TOKEN);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
}

function getassistant() {
  // WARNING: For GET requests, body is set to null by browsers.

  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  var str = "";
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      // console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      let prompts = data.list;
      assistantlist.innerHTML = "";
      // console.log(prompts.length);
      prompts.forEach(function (item) {
        const assistantcarddiv = document.createElement("div");
        assistantcarddiv.className = "assistant-card";
        const assistantcarddivheader = document.createElement("header");

        const assistantcarddivheaderh2 = document.createElement("h2");
        assistantcarddivheaderh2.innerHTML = item.Title;
        assistantcarddivheader.appendChild(assistantcarddivheaderh2);
        const assistantcarddivheaderdiv = document.createElement("div");
        assistantcarddivheaderdiv.className = "headerbuttons";

        // str = str + '<div class="assistant-card">';
        // str = str + "<header><h2>" + item.Title + "</h2>";
        // str = str + '<div class="headerbuttons">';

        if (item.Status == "Created")
          if ((item.Files && item.Files.length > 0) || (item.URL && item.URL.length > 0)) {
            const assistantcarddivheaderdivbutton = document.createElement("button");
            const assistantcarddivheaderdivbuttonimg = document.createElement("img");
            assistantcarddivheaderdivbuttonimg.setAttribute("src", "../images/index.svg");
            assistantcarddivheaderdivbutton.appendChild(assistantcarddivheaderdivbuttonimg);
            assistantcarddivheaderdivbutton.addEventListener("click", (event) => startindexing(item.Id));
            // .addEventListener("click", (event) =>
            // this.getmovieshowtimes(event, -1, MovieTitle)
            assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivbutton);
            // str =
            //   str +
            //   '<button class="button" onclick="startindexing(\'' +
            //   item.Id +
            //   '\')"><img src="../images/index.svg"></button>';
          } else {
            const assistantcarddivheaderdivbutton = document.createElement("button");
            const assistantcarddivheaderdivbuttonimg = document.createElement("img");
            assistantcarddivheaderdivbuttonimg.setAttribute("src", "../images/activate.svg");
            assistantcarddivheaderdivbutton.appendChild(assistantcarddivheaderdivbuttonimg);
            assistantcarddivheaderdivbutton.addEventListener("click", (event) => deploy(item.Id));
            assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivbutton);
            // str =
            //   str +
            //   '<button class="button" onclick="deploy(\'' +
            //   item.Id +
            //   '\')"><img src="../images/activate.svg"></button>';
          }
        else if (item.Status == "Indexing") {
          const assistantcarddivheaderdivbutton = document.createElement("button");
          const assistantcarddivheaderdivbuttonimg = document.createElement("img");
          assistantcarddivheaderdivbuttonimg.setAttribute("src", "../images/indexing.svg");
          assistantcarddivheaderdivbutton.appendChild(assistantcarddivheaderdivbuttonimg);
          assistantcarddivheaderdivbutton.addEventListener("click", (event) =>
            updateindexstatus(item.Id, item.AgentSessionID)
          );
          assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivbutton);
          // str =
          //   str +
          //   '<button class="button" onclick="updateindexstatus(\'' +
          //   item.Id +
          //   "','" +
          //   item.AgentSessionID +
          //   '\')"><img src="../images/indexing.svg"></button>';
        } else if (item.Status == "Ready To Deploy") {
          const assistantcarddivheaderdivbutton = document.createElement("button");
          const assistantcarddivheaderdivbuttonimg = document.createElement("img");
          assistantcarddivheaderdivbuttonimg.setAttribute("src", "../images/activate.svg");
          assistantcarddivheaderdivbutton.appendChild(assistantcarddivheaderdivbuttonimg);
          assistantcarddivheaderdivbutton.addEventListener("click", (event) => deploy(item.Id));
          assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivbutton);
          // str =
          //   str +
          //   '<button class="button" onclick="deploy(\'' +
          //   item.Id +
          //   '\')"><img src="../images/activate.svg"></button>';
        } else if (item.Status == "Deployed") {
          const assistantcarddivheaderdivbutton = document.createElement("button");
          const assistantcarddivheaderdivbuttonimg = document.createElement("img");
          assistantcarddivheaderdivbuttonimg.setAttribute("src", "../images/active.svg");
          assistantcarddivheaderdivbutton.appendChild(assistantcarddivheaderdivbuttonimg);
          assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivbutton);
          // str = str + '<button class="button"><img src="../images/active.svg"></button>';
        }

        // str =
        // str +
        // '&nbsp;&nbsp;&nbsp;<button class="button" onclick="toggleCollapse(this)"><img src="../images/down.svg"></button>';
        // str = str + "</div></header>";
        const assistantcarddivheaderdivspace = document.createTextNode("\u00A0\u00A0\u00A0");
        assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivspace);
        const assistantcarddivheaderdivtogglebutton = document.createElement("button");
        const assistantcarddivheaderdivtogglebuttonimg = document.createElement("img");
        assistantcarddivheaderdivtogglebuttonimg.setAttribute("src", "../images/down.svg");
        assistantcarddivheaderdivtogglebutton.appendChild(assistantcarddivheaderdivtogglebuttonimg);
        assistantcarddivheaderdivtogglebutton.addEventListener("click", (event) => toggleCollapse(event));
        assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivtogglebutton);
        assistantcarddivheader.appendChild(assistantcarddivheaderdiv);
        assistantcarddiv.appendChild(assistantcarddivheader);

        const assistantcarddivsection = document.createElement("section");
        // str = str + "<section>";
        const assistantcarddivsectionp = document.createElement("p");
        const assistantcarddivsectionpspan = document.createElement("span");
        assistantcarddivsectionpspan.className = "ptitle";
        assistantcarddivsectionpspan.innerText = "Prompt:";
        assistantcarddivsectionp.appendChild(assistantcarddivsectionpspan);
        const assistantcarddivsectionpbr = document.createElement("br");
        assistantcarddivsectionp.appendChild(assistantcarddivsectionpbr);
        const assistantcarddivsectionpspan2 = document.createElement("span");
        assistantcarddivsectionpspan2.className = "pbody";
        assistantcarddivsectionpspan2.innerText = truncate(item.Prompt);
        assistantcarddivsectionp.appendChild(assistantcarddivsectionpspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionp);
        // str =
        //   str +
        //   '<p><span class="ptitle">Prompt:</span><br><span class="pbody">' +
        //   truncate(item.Prompt) +
        //   "</span></p>";

        const assistantcarddivsectionpRetrieval = document.createElement("p");
        const assistantcarddivsectionpRetrievalspan = document.createElement("span");
        assistantcarddivsectionpRetrievalspan.className = "ptitle";
        assistantcarddivsectionpRetrievalspan.innerText = "Retrieval:";
        assistantcarddivsectionpRetrieval.appendChild(assistantcarddivsectionpRetrievalspan);
        const assistantcarddivsectionpRetrievalbr = document.createElement("br");
        assistantcarddivsectionpRetrieval.appendChild(assistantcarddivsectionpRetrievalbr);
        const assistantcarddivsectionpRetrievalspan2 = document.createElement("span");
        assistantcarddivsectionpRetrievalspan2.className = "pbody";
        assistantcarddivsectionpRetrievalspan2.innerText = item.Retrieval;
        assistantcarddivsectionpRetrieval.appendChild(assistantcarddivsectionpRetrievalspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpRetrieval);
        // str =
        // str + '<p><span class="ptitle">Retrieval:</span><br><span class="pbody">' + item.Retrieval + "</span></p>";
        const assistantcarddivsectionpSearch = document.createElement("p");
        const assistantcarddivsectionpSearchspan = document.createElement("span");
        assistantcarddivsectionpSearchspan.className = "ptitle";
        assistantcarddivsectionpSearchspan.innerText = "Web Search:";
        assistantcarddivsectionpSearch.appendChild(assistantcarddivsectionpSearchspan);
        const assistantcarddivsectionpSearchbr = document.createElement("br");
        assistantcarddivsectionpSearch.appendChild(assistantcarddivsectionpSearchbr);
        const assistantcarddivsectionpSearchspan2 = document.createElement("span");
        assistantcarddivsectionpSearchspan2.className = "pbody";
        assistantcarddivsectionpSearchspan2.innerText = item.WebSearch;
        assistantcarddivsectionpSearch.appendChild(assistantcarddivsectionpSearchspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpSearch);
        // str =
        // str + '<p><span class="ptitle">Web Search:</span><br><span class="pbody">' + item.WebSearch + "</span></p>";

        const assistantcarddivsectionpRich = document.createElement("p");
        const assistantcarddivsectionpRichspan = document.createElement("span");
        assistantcarddivsectionpRichspan.className = "ptitle";
        assistantcarddivsectionpRichspan.innerText = "Rich Results:";
        assistantcarddivsectionpRich.appendChild(assistantcarddivsectionpRichspan);
        const assistantcarddivsectionpRichbr = document.createElement("br");
        assistantcarddivsectionpRich.appendChild(assistantcarddivsectionpRichbr);
        const assistantcarddivsectionpRichspan2 = document.createElement("span");
        assistantcarddivsectionpRichspan2.className = "pbody";
        assistantcarddivsectionpRichspan2.innerText = item.rich_results;
        assistantcarddivsectionpRich.appendChild(assistantcarddivsectionpRichspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpRich);
        // str =
        // str +
        // '<p><span class="ptitle">Rich Results:</span><br><span class="pbody">' +
        // item.rich_results +
        // "</span></p>";
        const assistantcarddivsectionpChatbotURL = document.createElement("p");
        const assistantcarddivsectionpChatbotURLspan = document.createElement("span");
        assistantcarddivsectionpChatbotURLspan.className = "ptitle";
        assistantcarddivsectionpChatbotURLspan.innerText = "ChatbotURL:";
        assistantcarddivsectionpChatbotURL.appendChild(assistantcarddivsectionpChatbotURLspan);
        const assistantcarddivsectionpChatbotURLbr = document.createElement("br");
        assistantcarddivsectionpChatbotURL.appendChild(assistantcarddivsectionpChatbotURLbr);
        const assistantcarddivsectionpChatbotURLspan2 = document.createElement("span");
        assistantcarddivsectionpChatbotURLspan2.className = "pbody";
        const assistantcarddivsectionpChatbotURLspan2A = document.createElement("a");
        assistantcarddivsectionpChatbotURLspan2A.setAttribute("href", item.ChatbotURL);
        assistantcarddivsectionpChatbotURLspan2A.setAttribute("target", "_blank");
        assistantcarddivsectionpChatbotURLspan2A.className = "url-list";
        assistantcarddivsectionpChatbotURLspan2A.innerHTML = item.ChatbotURL;
        assistantcarddivsectionpChatbotURLspan2.appendChild(assistantcarddivsectionpChatbotURLspan2A);
        assistantcarddivsectionpChatbotURL.appendChild(assistantcarddivsectionpChatbotURLspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpChatbotURL);
        // str =
        // str +
        // '<p><span class="ptitle">ChatbotURL:</span><br><span class="pbody"><a href="' +
        // item.ChatbotURL +
        // '" target="_blank" class="url-list">' +
        // item.ChatbotURL +
        // "</a></span></p>";

        const assistantcarddivsectionpURLS = document.createElement("p");
        const assistantcarddivsectionpURLSspan = document.createElement("span");
        assistantcarddivsectionpURLSspan.className = "ptitle";
        assistantcarddivsectionpURLSspan.innerText = "Urls:";
        assistantcarddivsectionpURLS.appendChild(assistantcarddivsectionpURLSspan);
        const assistantcarddivsectionpURLSbr = document.createElement("br");
        assistantcarddivsectionpURLS.appendChild(assistantcarddivsectionpURLSbr);
        const assistantcarddivsectionpURLSspan2 = document.createElement("span");
        assistantcarddivsectionpURLSspan2.className = "pbody";
        if (item.URL && item.URL.length > 0) {
          var urlarr = item.URL.split(";");
          urlarr.forEach(function (url) {
            const assistantcarddivsectionpURLSspan2A = document.createElement("a");
            assistantcarddivsectionpURLSspan2A.setAttribute("href", url);
            assistantcarddivsectionpURLSspan2A.setAttribute("target", "_blank");
            assistantcarddivsectionpURLSspan2A.className = "url-list";
            assistantcarddivsectionpURLSspan2A.innerHTML = url;
            assistantcarddivsectionpURLSspan2.appendChild(assistantcarddivsectionpURLSspan2A);
            assistantcarddivsectionpURLSspan2.appendChild(assistantcarddivsectionpURLSbr);
          });
        }
        assistantcarddivsectionpURLS.appendChild(assistantcarddivsectionpURLSspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpURLS);
        // str = str + '<p><span class="ptitle">Urls:</span><br><span class="pbody">';
        // if (item.URL && item.URL.length > 0) {
        //   var urlarr = item.URL.split(";");
        //   urlarr.forEach(function (url) {
        //     str = str + '<a href="' + url + '" target="_blank" class="url-list">' + url + "</a><br>";
        //   });
        // }
        // str = str + "</span></p>";

        const assistantcarddivsectionpFiles = document.createElement("p");
        const assistantcarddivsectionpFilesspan = document.createElement("span");
        assistantcarddivsectionpFilesspan.className = "ptitle";
        assistantcarddivsectionpFilesspan.innerText = "Files:";
        assistantcarddivsectionpFiles.appendChild(assistantcarddivsectionpFilesspan);
        const assistantcarddivsectionpFilesbr = document.createElement("br");
        assistantcarddivsectionpFiles.appendChild(assistantcarddivsectionpFilesbr);
        const assistantcarddivsectionpFilesspan2 = document.createElement("span");
        assistantcarddivsectionpFilesspan2.className = "pbody";
        if (item.Files && item.Files.length > 0) {
          var Filesarr = item.Files;
          // console.log("Filesarr.length:" + Filesarr.length);
          Filesarr = Filesarr.replaceAll("{", "");
          Filesarr = Filesarr.replaceAll("}", "");
          Filesarr = Filesarr.replaceAll('"', "");
          // console.log("Filesarr:" + Filesarr);
          Filesarr = Filesarr.split(",");
          // console.log("Filesarr:" + Filesarr);
          Filesarr.forEach(function (file) {
            const assistantcarddivsectionpFilesspan2A = document.createElement("a");
            assistantcarddivsectionpFilesspan2A.setAttribute("href", file);
            assistantcarddivsectionpFilesspan2A.setAttribute("target", "_blank");
            assistantcarddivsectionpFilesspan2A.className = "url-list";
            assistantcarddivsectionpFilesspan2A.innerHTML = file;
            assistantcarddivsectionpFilesspan2.appendChild(assistantcarddivsectionpFilesspan2A);
            assistantcarddivsectionpFilesspan2.appendChild(assistantcarddivsectionpFilesbr);
          });
        }
        assistantcarddivsectionpFiles.appendChild(assistantcarddivsectionpFilesspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpFiles);

        // str = str + '<p><span class="ptitle">Files:</span><br><span class="pbody">';
        // if (item.Files && item.Files.length > 0) {
        //   var Filesarr = item.Files;
        //   console.log("Filesarr.length:" + Filesarr.length);
        //   Filesarr = Filesarr.replaceAll("{", "");
        //   Filesarr = Filesarr.replaceAll("}", "");
        //   Filesarr = Filesarr.replaceAll('"', "");
        //   console.log("Filesarr:" + Filesarr);
        //   Filesarr = Filesarr.split(",");
        //   console.log("Filesarr:" + Filesarr);
        //   Filesarr.forEach(function (file) {
        //     str = str + '<a href="' + file + '" target="_blank" class="url-list">' + file + "</a><br>";
        //   });
        // }

        const assistantcarddivsectionpSearchFields = document.createElement("p");
        const assistantcarddivsectionpSearchFieldsspan = document.createElement("span");
        assistantcarddivsectionpSearchFieldsspan.className = "ptitle";
        assistantcarddivsectionpSearchFieldsspan.innerText = "Search Fields:";
        assistantcarddivsectionpSearchFields.appendChild(assistantcarddivsectionpSearchFieldsspan);
        const assistantcarddivsectionpSearchFieldsbr = document.createElement("br");
        assistantcarddivsectionpSearchFields.appendChild(assistantcarddivsectionpSearchFieldsbr);
        const assistantcarddivsectionpSearchFieldsspan2 = document.createElement("span");
        assistantcarddivsectionpSearchFieldsspan2.className = "pbody";
        assistantcarddivsectionpSearchFieldsspan2.innerText = item.store_search_fields;
        assistantcarddivsectionpSearchFields.appendChild(assistantcarddivsectionpSearchFieldsspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpSearchFields);
        assistantcarddiv.appendChild(assistantcarddivsection);
        // str =
        //   str +
        //   '</span></p>"<p><span class="ptitle">Search Fields:</span><br><span class="pbody">' +
        //   item.store_search_fields +
        //   "</span></p>";
        // str = str + "</span></p></section>"

        const assistantcarddivfooter = document.createElement("footer");

        // str = str + "<footer>";
        if (item.Status == "Deployed") {
          const assistantcarddivfooterbutton = document.createElement("button");
          const assistantcarddivfooterbuttonimg = document.createElement("img");
          assistantcarddivfooterbuttonimg.setAttribute("src", "../images/deactivate.svg");
          assistantcarddivfooterbutton.appendChild(assistantcarddivfooterbuttonimg);
          assistantcarddivfooterbutton.addEventListener("click", (event) => deactivate(item.Id));
          assistantcarddivfooter.appendChild(assistantcarddivfooterbutton);
          // str =
          //   str +
          //   '<button class="button"  onclick="deactivate(\'' +
          //   item.Id +
          //   '\')"><img src="../images/deactivate.svg"></button>';
        }
        const assistantcarddivfooterbuttondel = document.createElement("button");
        const assistantcarddivfooterbuttondelimg = document.createElement("img");
        assistantcarddivfooterbuttondelimg.setAttribute("src", "../images/delete.svg");
        assistantcarddivfooterbuttondel.appendChild(assistantcarddivfooterbuttondelimg);
        assistantcarddivfooterbuttondel.addEventListener("click", (event) => deleteassistant(item.Id));
        assistantcarddivfooter.appendChild(assistantcarddivfooterbuttondel);
        // str =
        //   str +
        //   '<button class="button" onclick="deleteassistant(\'' +
        //   item.Id +
        //   '\')"><img src="../images/delete.svg"></button>';
        // str = str + "</footer></div>";
        assistantcarddiv.appendChild(assistantcarddivfooter);
        assistantlist.appendChild(assistantcarddiv);
      });
      // console.log(str);
      // if (str.length > 0) {
      // assistantlist.innerHTML = str;
      // sectionresults.style.visibility = "visible";
      // sectionassistant.style.display = "none";
      sectionassistantstatus.style.display = "block";
      //     } else {
      //         sectionassistant.style.display = "block";
      //     }
    }
  });

  xhr.open(
    "GET",
    DB_HOST +
    "/api/v2/tables/" +
    DB_TABLE_ASSISTANT_ID +
    "/records?limit=25&shuffle=0&offset=0&where=(UUID%2Ceq%2C" +
    loggedinuser.uuid +
    ")"
  );
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("xc-token", DB_TOKEN);

  xhr.send();
}

function getsystemassistant() {
  // WARNING: For GET requests, body is set to null by browsers.

  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  var str = "";
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      // console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      let prompts = data.list;
      systemassistantlist.innerHTML = "";
      prompts.forEach(function (item) {
        // console.log(item);

        const assistantcarddiv = document.createElement("div");
        assistantcarddiv.className = "assistant-card";
        const assistantcarddivheader = document.createElement("header");

        const assistantcarddivheaderh2 = document.createElement("h2");
        assistantcarddivheaderh2.innerHTML = item.Title;
        assistantcarddivheader.appendChild(assistantcarddivheaderh2);
        const assistantcarddivheaderdiv = document.createElement("div");
        assistantcarddivheaderdiv.className = "headerbuttons";
        // str = str + '<div class="assistant-card">';
        // str = str + "<header><h2>" + item.Title + "</h2>";
        // str = str + '<div class="headerbuttons">';

        const assistantcarddivheaderdivbtn = document.createElement("button");
        const assistantcarddivheaderdivbtnimg = document.createElement("img");
        assistantcarddivheaderdivbtnimg.setAttribute("src", "../images/duplicate.svg");
        assistantcarddivheaderdivbtn.appendChild(assistantcarddivheaderdivbtnimg);
        assistantcarddivheaderdivbtn.addEventListener("click", (event) => duplicate(item.Id));
        assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivbtn);
        // str =
        //   str +
        //   '<button class="button" onclick="duplicate(\'' +
        //   item.Id +
        //   '\')"><img src="../images/duplicate.svg"></button>';
        const assistantcarddivheaderdivspace = document.createTextNode("\u00A0\u00A0\u00A0");
        assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivspace);
        const assistantcarddivheaderdivtogglebutton = document.createElement("button");
        const assistantcarddivheaderdivtogglebuttonimg = document.createElement("img");
        assistantcarddivheaderdivtogglebuttonimg.setAttribute("src", "../images/down.svg");
        assistantcarddivheaderdivtogglebutton.appendChild(assistantcarddivheaderdivtogglebuttonimg);
        assistantcarddivheaderdivtogglebutton.addEventListener("click", (event) => toggleCollapse(event));
        assistantcarddivheaderdiv.appendChild(assistantcarddivheaderdivtogglebutton);
        assistantcarddivheader.appendChild(assistantcarddivheaderdiv);
        assistantcarddiv.appendChild(assistantcarddivheader);
        // str =
        //   str +
        //   '&nbsp;&nbsp;&nbsp;<button class="button" onclick="toggleCollapse(this)"><img src="../images/down.svg"></button>';
        // str = str + "</div></header><section>";
        const assistantcarddivsection = document.createElement("section");
        // str = str + "<section>";
        const assistantcarddivsectionp = document.createElement("p");
        const assistantcarddivsectionpspan = document.createElement("span");
        assistantcarddivsectionpspan.className = "ptitle";
        assistantcarddivsectionpspan.innerText = "Prompt:";
        assistantcarddivsectionp.appendChild(assistantcarddivsectionpspan);
        const assistantcarddivsectionpbr = document.createElement("br");
        assistantcarddivsectionp.appendChild(assistantcarddivsectionpbr);
        const assistantcarddivsectionpspan2 = document.createElement("span");
        assistantcarddivsectionpspan2.className = "pbody";
        assistantcarddivsectionpspan2.innerText = truncate(item.Prompt);
        assistantcarddivsectionp.appendChild(assistantcarddivsectionpspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionp);
        // str =
        //   str +
        //   '<p><span class="ptitle">Prompt:</span><br><span class="pbody">' +
        //   truncate(item.Prompt) +
        //   "</span></p>";
        const assistantcarddivsectionpRetrieval = document.createElement("p");
        const assistantcarddivsectionpRetrievalspan = document.createElement("span");
        assistantcarddivsectionpRetrievalspan.className = "ptitle";
        assistantcarddivsectionpRetrievalspan.innerText = "Retrieval:";
        assistantcarddivsectionpRetrieval.appendChild(assistantcarddivsectionpRetrievalspan);
        const assistantcarddivsectionpRetrievalbr = document.createElement("br");
        assistantcarddivsectionpRetrieval.appendChild(assistantcarddivsectionpRetrievalbr);
        const assistantcarddivsectionpRetrievalspan2 = document.createElement("span");
        assistantcarddivsectionpRetrievalspan2.className = "pbody";
        assistantcarddivsectionpRetrievalspan2.innerText = item.Retrieval;
        assistantcarddivsectionpRetrieval.appendChild(assistantcarddivsectionpRetrievalspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpRetrieval);
        // str =
        //   str + '<p><span class="ptitle">Retrieval:</span><br><span class="pbody">' + item.Retrieval + "</span></p>";

        const assistantcarddivsectionpSearch = document.createElement("p");
        const assistantcarddivsectionpSearchspan = document.createElement("span");
        assistantcarddivsectionpSearchspan.className = "ptitle";
        assistantcarddivsectionpSearchspan.innerText = "Web Search:";
        assistantcarddivsectionpSearch.appendChild(assistantcarddivsectionpSearchspan);
        const assistantcarddivsectionpSearchbr = document.createElement("br");
        assistantcarddivsectionpSearch.appendChild(assistantcarddivsectionpSearchbr);
        const assistantcarddivsectionpSearchspan2 = document.createElement("span");
        assistantcarddivsectionpSearchspan2.className = "pbody";
        assistantcarddivsectionpSearchspan2.innerText = item.WebSearch;
        assistantcarddivsectionpSearch.appendChild(assistantcarddivsectionpSearchspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpSearch);
        // str =
        //   str + '<p><span class="ptitle">Web Search:</span><br><span class="pbody">' + item.WebSearch + "</span></p>";

        const assistantcarddivsectionpRich = document.createElement("p");
        const assistantcarddivsectionpRichspan = document.createElement("span");
        assistantcarddivsectionpRichspan.className = "ptitle";
        assistantcarddivsectionpRichspan.innerText = "Rich Results:";
        assistantcarddivsectionpRich.appendChild(assistantcarddivsectionpRichspan);
        const assistantcarddivsectionpRichbr = document.createElement("br");
        assistantcarddivsectionpRich.appendChild(assistantcarddivsectionpRichbr);
        const assistantcarddivsectionpRichspan2 = document.createElement("span");
        assistantcarddivsectionpRichspan2.className = "pbody";
        assistantcarddivsectionpRichspan2.innerText = item.rich_results;
        assistantcarddivsectionpRich.appendChild(assistantcarddivsectionpRichspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpRich);
        // str =
        //   str +
        //   '<p><span class="ptitle">Rich Results:</span><br><span class="pbody">' +
        //   item.rich_results +
        //   "</span></p>";

        const assistantcarddivsectionpURLS = document.createElement("p");
        const assistantcarddivsectionpURLSspan = document.createElement("span");
        assistantcarddivsectionpURLSspan.className = "ptitle";
        assistantcarddivsectionpURLSspan.innerText = "Urls:";
        assistantcarddivsectionpURLS.appendChild(assistantcarddivsectionpURLSspan);
        const assistantcarddivsectionpURLSbr = document.createElement("br");
        assistantcarddivsectionpURLS.appendChild(assistantcarddivsectionpURLSbr);
        const assistantcarddivsectionpURLSspan2 = document.createElement("span");
        assistantcarddivsectionpURLSspan2.className = "pbody";
        if (item.URL && item.URL.length > 0) {
          var urlarr = item.URL.split(";");
          urlarr.forEach(function (url) {
            const assistantcarddivsectionpURLSspan2A = document.createElement("a");
            assistantcarddivsectionpURLSspan2A.setAttribute("href", url);
            assistantcarddivsectionpURLSspan2A.setAttribute("target", "_blank");
            assistantcarddivsectionpURLSspan2A.className = "url-list";
            assistantcarddivsectionpURLSspan2A.innerHTML = url;
            assistantcarddivsectionpURLSspan2.appendChild(assistantcarddivsectionpURLSspan2A);
            assistantcarddivsectionpURLSspan2.appendChild(assistantcarddivsectionpURLSbr);
          });
        }
        assistantcarddivsectionpURLS.appendChild(assistantcarddivsectionpURLSspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpURLS);
        // str = str + '<p><span class="ptitle">Urls:</span><br><span class="pbody">';
        // if (item.URL && item.URL.length > 0) {
        //   var urlarr = item.URL.split(";");
        //   urlarr.forEach(function (url) {
        //     str = str + '<a href="' + url + '" target="_blank" class="url-list">' + url + "</a><br>";
        //   });
        // }
        // str = str + "</span></p>";

        const assistantcarddivsectionpFiles = document.createElement("p");
        const assistantcarddivsectionpFilesspan = document.createElement("span");
        assistantcarddivsectionpFilesspan.className = "ptitle";
        assistantcarddivsectionpFilesspan.innerText = "Files:";
        assistantcarddivsectionpFiles.appendChild(assistantcarddivsectionpFilesspan);
        const assistantcarddivsectionpFilesbr = document.createElement("br");
        assistantcarddivsectionpFiles.appendChild(assistantcarddivsectionpFilesbr);
        const assistantcarddivsectionpFilesspan2 = document.createElement("span");
        assistantcarddivsectionpFilesspan2.className = "pbody";
        if (item.Files && item.Files.length > 0) {
          var Filesarr = item.Files;
          // console.log("Filesarr.length:" + Filesarr.length);
          Filesarr = Filesarr.replaceAll("{", "");
          Filesarr = Filesarr.replaceAll("}", "");
          Filesarr = Filesarr.replaceAll('"', "");
          // console.log("Filesarr:" + Filesarr);
          Filesarr = Filesarr.split(",");
          // console.log("Filesarr:" + Filesarr);
          Filesarr.forEach(function (file) {
            const assistantcarddivsectionpFilesspan2A = document.createElement("a");
            assistantcarddivsectionpFilesspan2A.setAttribute("href", file);
            assistantcarddivsectionpFilesspan2A.setAttribute("target", "_blank");
            assistantcarddivsectionpFilesspan2A.className = "url-list";
            assistantcarddivsectionpFilesspan2A.innerHTML = file;
            assistantcarddivsectionpFilesspan2.appendChild(assistantcarddivsectionpFilesspan2A);
            assistantcarddivsectionpFilesspan2.appendChild(assistantcarddivsectionpFilesbr);
          });
        }
        assistantcarddivsectionpFiles.appendChild(assistantcarddivsectionpFilesspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpFiles);
        // str = str + '<p><span class="ptitle">Files:</span><br><span class="pbody">';
        // if (item.Files && item.Files.length > 0) {
        //   var Filesarr = item.Files;
        //   Filesarr = Filesarr.replaceAll("{", "");
        //   Filesarr = Filesarr.replaceAll("}", "");
        //   Filesarr = Filesarr.replaceAll('"', "");
        //   console.log("Filesarr:" + Filesarr);
        //   Filesarr = Filesarr.split(",");
        //   console.log("Filesarr:" + Filesarr);
        //   Filesarr.forEach(function (file) {
        //     str = str + '<a href="' + file + '" target="_blank" class="url-list">' + file + "</a><br>";
        //   });
        // }
        // str = str + "</span></p>";

        const assistantcarddivsectionpSearchFields = document.createElement("p");
        const assistantcarddivsectionpSearchFieldsspan = document.createElement("span");
        assistantcarddivsectionpSearchFieldsspan.className = "ptitle";
        assistantcarddivsectionpSearchFieldsspan.innerText = "Search Fields:";
        assistantcarddivsectionpSearchFields.appendChild(assistantcarddivsectionpSearchFieldsspan);
        const assistantcarddivsectionpSearchFieldsbr = document.createElement("br");
        assistantcarddivsectionpSearchFields.appendChild(assistantcarddivsectionpSearchFieldsbr);
        const assistantcarddivsectionpSearchFieldsspan2 = document.createElement("span");
        assistantcarddivsectionpSearchFieldsspan2.className = "pbody";
        assistantcarddivsectionpSearchFieldsspan2.innerText = item.store_search_fields;
        assistantcarddivsectionpSearchFields.appendChild(assistantcarddivsectionpSearchFieldsspan2);
        assistantcarddivsection.appendChild(assistantcarddivsectionpSearchFields);
        assistantcarddiv.appendChild(assistantcarddivsection);
        // str =
        //   str +
        //   '<p><span class="ptitle">Search Fields:</span><br><span class="pbody">' +
        //   item.store_search_fields +
        //   "</span></p>";

        // str = str + "</section><footer>";
        // str = str + "</footer></div>";
        const assistantcarddivfooter = document.createElement("footer");
        assistantcarddiv.appendChild(assistantcarddivfooter);
        systemassistantlist.appendChild(assistantcarddiv);
      });
      // console.log(str);
      // systemassistantlist.innerHTML = str;
      sectionsystemassistant.style.display = "block";
    }
  });

  xhr.open("GET", DB_HOST + "/api/v2/tables/" + DB_TABLE_SYSTEMASSISTANT_ID + "/records?limit=250&shuffle=0&offset=0");
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("xc-token", DB_TOKEN);

  xhr.send();
}

function updateassistant(itemid, Status, ChatbotURL, AgentSessionID, Streamid, DataStoreName, deploy_id) {
  var data = JSON.stringify({
    Id: itemid,
    Status: Status,
    ChatbotURL: ChatbotURL,
    AgentSessionID: AgentSessionID,
    Streamid: Streamid,
    DataStoreName: DataStoreName,
    deploy_id: deploy_id,
  });

  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      // console.log(this.responseText);
      getassistant();
    }
  });

  xhr.open("PATCH", DB_HOST + "/api/v2/tables/" + DB_TABLE_ASSISTANT_ID + "/records");
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("xc-token", DB_TOKEN);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
}

function deleteassistant(itemid) {
  let text = "Please confirm to delete the prompt!";
  if (confirm(text) == true) {
    var data = JSON.stringify({
      Id: itemid,
    });

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // console.log(this.responseText);
        getassistant();
        // location.reload();
      }
    });
    xhr.open("DELETE", DB_HOST + "/api/v2/tables/" + DB_TABLE_ASSISTANT_ID + "/records");
    xhr.setRequestHeader("accept", "*/*");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("xc-token", DB_TOKEN);
    xhr.send(data);
  }
}

function truncate(str) {
  var n = 500;
  return str && str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
}

async function startindexing(itemid) {
  let assistant = await getassistant_itemid(itemid);
  // console.log(assistant);
  var aurls = [],
    links = [];
  // console.log("assistant.URL.length:" + assistant.URL.length);
  // console.log("assistant.URL.includes():" + assistant.URL.includes(";"));

  if (assistant.URL && assistant.URL.length > 0)
    if (assistant.URL.includes(";")) aurls = assistant.URL.split(";");
    else aurls[0] = assistant.URL;

  if (assistant.Files && assistant.Files.length > 0)
    if (assistant.Files.includes(",")) links = JSON.parse(assistant.Files).split(",");
    else links[0] = assistant.Files;

  let mergedArray = aurls.concat(links);
  // WARNING: For POST requests, body is set to null by browsers.
  var DataStoreName = "index_" + crypto.randomUUID();
  var data = JSON.stringify({
    index_name: DataStoreName,
    web_urls: mergedArray,
  });

  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      // console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      updateassistant(itemid, "Indexing", "", data.session_id, "", DataStoreName);
    }
  });

  xhr.open("POST", ELASTIC_URL);
  xhr.setRequestHeader("xc-token", ELASTIC_TOKEN);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
}

async function updateindexstatus(itemid, session_id) {
  // WARNING: For GET requests, body is set to null by browsers.
  let assistant = await getassistant_itemid(itemid);
  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      // console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      if (data.workflow_status == "WORKFLOW_EXECUTION_STATUS_COMPLETED") {
        updateassistant(itemid, "Ready To Deploy", "", session_id, "", assistant.DataStoreName);
      }
    }
  });

  xhr.open("GET", ELASTIC_URL + "?session_id=" + session_id);
  xhr.send();
}

async function deploy(itemid) {
  let assistant = await getassistant_itemid(itemid);
  // WARNING: For POST requests, body is set to null by browsers.
  // const deploy_id = crypto.randomUUID() + "_" + assistant.UUID;
  const deploy_id = assistant.UUID + "_" + assistant.system_assistantID;

  console.log("assistant.Retrieval:" + assistant.Retrieval);
  if (assistant.Retrieval == "true") {
    console.log("workflow assistant.Retrieval:" + assistant.Retrieval);
    var data = JSON.stringify({
      uuid: deploy_id,
      agent_name: assistant.Title,
      instruction: assistant.Prompt,
      rag: assistant.Retrieval,
      data_store_name: assistant.DataStoreName,
      enable_web_search: assistant.WebSearch,
      deploy_id: deploy_id,
      store_search_fields: assistant.store_search_fields,
      rich_results: assistant.rich_results,
      entity_search_in_results: assistant.entity_search_in_results,
      generate_stream: assistant.generate_stream,
      agent_enabled: assistant.agent_enabled,
      user_prompt: assistant.user_prompt ? assistant.user_prompt : "",
      user_info: {
        name: loggedinuser.name ? loggedinuser.name : "",
        picture: loggedinuser.picture ? loggedinuser.picture : "",
        phone_no: loggedinuser.phone_no ? loggedinuser.phone_no : "",
        email: loggedinuser.email ? loggedinuser.email : "",
        timezone: loggedinuser.timezone ? loggedinuser.timezone : "",
        area_name: loggedinuser.area_name ? loggedinuser.area_name : "",
        country_name: loggedinuser.country_name ? loggedinuser.country_name : "",
        pincode: loggedinuser.pincode ? loggedinuser.pincode : "",
        iso_2d_country_code: loggedinuser.iso_2d_country_code ? loggedinuser.iso_2d_country_code : "",
        administrative_area_level_2: loggedinuser.administrative_area_level_2
          ? loggedinuser.administrative_area_level_2
          : "",
        administrative_area_level_1: loggedinuser.administrative_area_level_1
          ? loggedinuser.administrative_area_level_1
          : "",
      },
    });
    loggedinuser.user.getIdToken(true).then(async (idToken) => {
      var xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          // console.log(this.responseText);
          let data = JSON.parse(this.responseText);
          updateassistant(
            itemid,
            "Deployed",
            URL + data.session_id + "&deploy_id=" + deploy_id,
            data.session_id,
            data.stream_id,
            assistant.data_store_name,
            deploy_id
          );
        }
      });

      xhr.open("POST", HOST + "/workflows/agent");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);

      xhr.send(data);
    });
  } else {
    console.log("personal_assistant assistant.Retrieval:" + assistant.Retrieval);
    // WARNING: For POST requests, body is set to null by browsers.
    var data = JSON.stringify({
      uuid: deploy_id,
      assistant_name: assistant.Title,
      instruction: assistant.Prompt,
      deploy_id: deploy_id,
      generate_stream: assistant.generate_stream,
      agent_enabled: assistant.agent_enabled,
      user_prompt: assistant.user_prompt ? assistant.user_prompt : "",
      user_info: {
        name: loggedinuser.name ? loggedinuser.name : "",
        picture: loggedinuser.picture ? loggedinuser.picture : "",
        phone_no: loggedinuser.phone_no ? loggedinuser.phone_no : "",
        email: loggedinuser.email ? loggedinuser.email : "",
        timezone: loggedinuser.timezone ? loggedinuser.timezone : "",
        area_name: loggedinuser.area_name ? loggedinuser.area_name : "",
        country_name: loggedinuser.country_name ? loggedinuser.country_name : "",
        pincode: loggedinuser.pincode ? loggedinuser.pincode : "",
        iso_2d_country_code: loggedinuser.iso_2d_country_code ? loggedinuser.iso_2d_country_code : "",
        administrative_area_level_2: loggedinuser.administrative_area_level_2
          ? loggedinuser.administrative_area_level_2
          : "",
        administrative_area_level_1: loggedinuser.administrative_area_level_1
          ? loggedinuser.administrative_area_level_1
          : "",
      },
    });
    loggedinuser.user.getIdToken(true).then(async (idToken) => {
      var xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          // console.log(this.responseText);
          let data = JSON.parse(this.responseText);
          updateassistant(
            itemid,
            "Deployed",
            URL + data.session_id + "&deploy_id=" + deploy_id,
            data.session_id,
            data.stream_id,
            assistant.data_store_name,
            deploy_id
          );
        }
      });

      xhr.open("POST", HOST + "/workflows/personal_assistant");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);
      xhr.send(data);
    });
  }
}

async function deactivate(itemid) {
  let assistant = await getassistant_itemid(itemid);
  loggedinuser.user.getIdToken(true).then(async (idToken) => {
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // console.log(this.responseText);
        updateassistant(itemid, "Ready To Deploy", "", assistant.AgentSessionID, "", assistant.data_store_name);
      }
    });
    xhr.open("DELETE", HOST + "/workflows/workflow?session_id=" + assistant.AgentSessionID);
    xhr.setRequestHeader("GOOGLE_IDTOKEN", idToken);
    xhr.send();
  });
}

const getassistant_itemid = (itemid) =>
  new Promise(function (resolve, reject) {
    // WARNING: For GET requests, body is set to null by browsers.

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // console.log(this.responseText);
        let data = JSON.parse(this.responseText);
        resolve(data);
      }
    });

    xhr.open("GET", DB_HOST + "/api/v2/tables/" + DB_TABLE_ASSISTANT_ID + "/records/" + itemid);
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("xc-token", DB_TOKEN);

    xhr.send();
  });

const getsystemassistant_itemid = (itemid) =>
  new Promise(function (resolve, reject) {
    // WARNING: For GET requests, body is set to null by browsers.

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // console.log(this.responseText);
        let data = JSON.parse(this.responseText);
        resolve(data);
      }
    });

    xhr.open("GET", DB_HOST + "/api/v2/tables/" + DB_TABLE_SYSTEMASSISTANT_ID + "/records/" + itemid);
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("xc-token", DB_TOKEN);

    xhr.send();
  });

function toggleCollapse(event) {
  let button = event.target;
  console.log(button);
  // console.log(button.querySelector("img"));
  // var content = document.querySelector('.assistant-card');
  var content = button.parentElement.parentElement.parentElement.parentElement;
  if (content.classList.contains("expanded")) {
    content.classList.remove("expanded");
    button.src = "../images/down.svg";
    //   button.textContent = 'v'; // Change to down caret when collapsed
  } else {
    content.classList.add("expanded");
    button.src = "../images/up.svg";
    //   button.textContent = '^'; // Change to up caret when expanded
  }
}

function displayFileName() {
  var fileInput = document.getElementById("filesToUpload");
  var fileNameDisplay = document.getElementById("fileName");

  if (fileInput.files.length === 0) {
    fileNameDisplay.textContent = "";
    fileNameDisplay.style.display = "none";
  } else {
    fileNameDisplay.textContent = "";
    for (let i = 0; i < fileInput.files.length; i++) {
      fileNameDisplay.textContent += fileInput.files[i].name + (i < fileInput.files.length - 1 ? ", " : "");
    }
    fileNameDisplay.style.display = "block";
  }
}

function resetData() {
  txtname.value = "";
  txtprompt.value = "";
  txtuserprompt.value = "";
  chkretrieval.checked = false;
  webtogglebutton.checked = false;
  document.getElementById("input-form").innerHTML = "";
  // Create a new input element
  var newInput = document.createElement("input");
  newInput.type = "text";
  newInput.name = "inputField[]";
  newInput.placeholder = "Enter link";
  document.getElementById("input-form").appendChild(newInput);
  filesToUpload.value = "";
  document.getElementById("fileName").textContent = "";
  sectionlinks.style.display = "none";
  richresultstoggle.checked = false;
  chkagent.checked = false;
  chkstream.checked = false;
  txtsearchfields.value = "";
}

// export { toggleCollapse, closeassistant, addassistant, deactivate, deploy, updateindexstatus, startindexing, deleteassistant, duplicate, addInputField };
