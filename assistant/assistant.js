import { getUser, redirectToLogin } from "../app/User.js";
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
  divgoogle,
  links,
  assistantlist,
  webtogglebutton,
  systemassistantlist,
  sectionsystemassistant,
  txtuserprompt;
let user;
const URL = "https://ai.iamplus.services/chatbot/iamai-main/index.html?lang=ad&session_id=";

window.onload = async function () {
  // Use this instead
  // user = getUser()
  // if(!user) redirectToLogin()

  if (sessionStorage.getItem("googleToken")) {
    const responsePayload = decodeJwtResponse(sessionStorage.getItem("googleToken"));
    user = new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
    await user.setuseraddress();
    divgoogle.style.display = "none";
    // sectionassistant.style.display = "block";
    // sectionassistantstatus.style.display = "block";
    getassistant();
    getsystemassistant();
  } else {
    divgoogle.style.display = "block";
    sectionsystemassistant.style.display = "none";
    sectionassistant.style.display = "none";
    sectionassistantstatus.style.display = "none";
    sectionlinks.style.display = "none";
    // User is not logged in. Show the login button
  }
};

window.addEventListener("DOMContentLoaded", load);
async function load() {
  divgoogle = document.getElementById("divgoogle");
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

  sectionsystemassistant.style.display = "none";
  sectionassistant.style.display = "none";
  sectionassistantstatus.style.display = "none";
  sectionlinks.style.display = "none";

  btnsubmit.addEventListener("click", async function (e) {
    saveassistant();
  });

  chkretrieval.addEventListener("change", function () {
    if (this.checked) {
      sectionlinks.style.display = "block";
    } else {
      sectionlinks.style.display = "none";
    }
  });
}

class User {
  constructor(uuid, name, picture, email) {
    this.uuid = uuid;
    this.name = name;
    this.picture = picture;
    this.email = email;
    this.timezone = getUserTimezone();
    this.area_name = "";
    this.country_name = "";
    this.pincode = "";
    this.iso_2d_country_code = "";
    this.administrative_area_level_1 = "";
    this.administrative_area_level_2 = "";
  }
  async setuseraddress() {
    let address = await getaddressdetails();
    this.area_name = address.area_name;
    this.country_name = address.country_name;
    this.pincode = address.pincode;
    this.iso_2d_country_code = address.iso_2d_country_code;
    this.administrative_area_level_1 = address.administrative_area_level_1;
    this.administrative_area_level_2 = address.administrative_area_level_2;
  }
}

window.handleCredentialResponse = async (response) => {
  console.log(response);
  const responsePayload = decodeJwtResponse(response.credential);
  user = new User(responsePayload.sub, responsePayload.name, responsePayload.picture, responsePayload.email);
  await user.setuseraddress();
  divgoogle.style.display = "none";
  // sectionassistant.style.display = "block";
  // sectionassistantstatus.style.display = "block";
  sessionStorage.setItem("googleToken", response.credential);
  getassistant();
  getsystemassistant();
};

// Sign out the user
function signout() {
  google.accounts.id.disableAutoSelect();
  divgoogle.style.display = "flex";
  sectionassistant.style.display = "none";
  sectionassistantstatus.style.display = "none";
  sectionsystemassistant.style.display = "none";
}

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

const uplaodfiles = (files) =>
  new Promise(function (resolve, reject) {
    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      formData.append("files", file, file.name);
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ai.iamplus.services/files/upload", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        // alert('Files uploaded successfully');
        console.log(this.responseText);
        let data = JSON.parse(this.responseText);
        resolve(data.urls);
      } else {
        // alert('An error occurred!');
        reject("An error occurred!");
      }
    };

    xhr.send(formData);
  });

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

    if (filesToUpload.files.length > 0) filesurls = await uplaodfiles(filesToUpload.files);

    // console.log()
    // WARNING: For POST requests, body is set to null by browsers.
    var data = "";
    if (txtsearchfields.value.length > 0) {
      data = JSON.stringify({
        Title: txtname.value,
        Prompt: txtprompt.value,
        Retrieval: chkretrieval.checked,
        URL: urls,
        Files: filesurls,
        UUID: user.uuid,
        WebSearch: webtogglebutton.checked,
        store_search_fields: txtsearchfields.value,
        rich_results: richresultstoggle.checked,
        user_prompt: txtuserprompt.value,
        generate_stream: chkstream.checked,
        agent_enabled: chkagent.checked,
      });
    } else {
      data = JSON.stringify({
        Title: txtname.value,
        Prompt: txtprompt.value,
        Retrieval: chkretrieval.checked,
        URL: urls,
        Files: filesurls,
        UUID: user.uuid,
        WebSearch: webtogglebutton.checked,
        rich_results: richresultstoggle.checked,
        user_prompt: txtuserprompt.value,
        generate_stream: chkstream.checked,
        agent_enabled: chkagent.checked,
      });
    }

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        // location.reload();
        resetData();
        getassistant();
        sectionassistant.style.display = "none";
        sectionassistantstatus.style.display = "block";
        sectionsystemassistant.style.display = "block";
        btnsubmit.style.display = "block";
      }
    });

    xhr.open("POST", "https://ai.iamplus.services/api/v1/db/data/v1/UserAssistant/Assistant");
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("xc-token", "dylFE2UGqVNqHZR0OtruRDJh2UKNxVbitJwQvp1x");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  } else {
    btnsubmit.style.display = "block";
  }
}

async function duplicate(itemid) {
  let assistant = await getsystemassistant_itemid(itemid);

  console.log("system assistant:" + assistant);
  // WARNING: For POST requests, body is set to null by browsers.
  var data = JSON.stringify({
    Title: assistant.Title,
    Prompt: assistant.Prompt,
    Retrieval: assistant.Retrieval,
    URL: assistant.URL,
    Files: assistant.Files,
    UUID: user.uuid,
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
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      // location.reload();
      getassistant();
      sectionassistant.style.display = "none";
      sectionassistantstatus.style.display = "block";
      sectionsystemassistant.style.display = "block";
    }
  });

  xhr.open("POST", "https://ai.iamplus.services/api/v1/db/data/v1/UserAssistant/Assistant");
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("xc-token", "dylFE2UGqVNqHZR0OtruRDJh2UKNxVbitJwQvp1x");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
}

function getassistant() {
  // WARNING: For GET requests, body is set to null by browsers.

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  var str = "";
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      prompts = data.list;
      prompts.forEach(function (item) {
        console.log(item);
        str = str + '<div class="assistant-card">';
        str = str + "<header><h2>" + item.Title + "</h2>";
        str = str + '<div class="headerbuttons">';

        if (item.Status == "Created")
          if ((item.Files && item.Files.length > 0) || (item.URL && item.URL.length > 0))
            str =
              str +
              '<button class="button" onclick="startindexing(\'' +
              item.Id +
              '\')"><img src="./images/index.svg"></button>';
          else
            str =
              str +
              '<button class="button" onclick="deploy(\'' +
              item.Id +
              '\')"><img src="./images/activate.svg"></button>';
        else if (item.Status == "Indexing")
          str =
            str +
            '<button class="button" onclick="updateindexstatus(\'' +
            item.Id +
            "','" +
            item.AgentSessionID +
            '\')"><img src="./images/indexing.svg"></button>';
        else if (item.Status == "Ready To Deploy")
          str =
            str +
            '<button class="button" onclick="deploy(\'' +
            item.Id +
            '\')"><img src="./images/activate.svg"></button>';
        else if (item.Status == "Deployed")
          str = str + '<button class="button"><img src="./images/active.svg"></button>';

        str =
          str +
          '&nbsp;&nbsp;&nbsp;<button class="button" onclick="toggleCollapse(this)"><img src="./images/down.svg"></button>';
        str = str + "</div></header><section>";
        str =
          str +
          '<p><span class="ptitle">Prompt:</span><br><span class="pbody">' +
          truncate(item.Prompt) +
          "</span></p>";
        str =
          str + '<p><span class="ptitle">Retrieval:</span><br><span class="pbody">' + item.Retrieval + "</span></p>";
        str =
          str + '<p><span class="ptitle">Web Search:</span><br><span class="pbody">' + item.WebSearch + "</span></p>";
        str =
          str +
          '<p><span class="ptitle">Rich Results:</span><br><span class="pbody">' +
          item.rich_results +
          "</span></p>";
        str =
          str +
          '<p><span class="ptitle">ChatbotURL:</span><br><span class="pbody"><a href="' +
          item.ChatbotURL +
          '" target="_blank" class="url-list">' +
          item.ChatbotURL +
          "</a></span></p>";
        str = str + '<p><span class="ptitle">Urls:</span><br><span class="pbody">';
        if (item.URL && item.URL.length > 0) {
          var urlarr = item.URL.split(";");
          urlarr.forEach(function (url) {
            str = str + '<a href="' + url + '" target="_blank" class="url-list">' + url + "</a><br>";
          });
        }
        str = str + "</span></p>";
        str = str + '<p><span class="ptitle">Files:</span><br><span class="pbody">';
        if (item.Files && item.Files.length > 0) {
          var Filesarr = item.Files;
          console.log("Filesarr.length:" + Filesarr.length);
          Filesarr = Filesarr.replaceAll("{", "");
          Filesarr = Filesarr.replaceAll("}", "");
          Filesarr = Filesarr.replaceAll('"', "");
          console.log("Filesarr:" + Filesarr);
          Filesarr = Filesarr.split(",");
          console.log("Filesarr:" + Filesarr);
          Filesarr.forEach(function (file) {
            str = str + '<a href="' + file + '" target="_blank" class="url-list">' + file + "</a><br>";
          });
        }
        str =
          str +
          '</span></p><p><span class="ptitle">Search Fields:</span><br><span class="pbody">' +
          item.store_search_fields +
          "</span></p>";
        str = str + "</span></p></section><footer>";
        if (item.Status == "Deployed")
          str =
            str +
            '<button class="button"  onclick="deactivate(\'' +
            item.Id +
            '\')"><img src="./images/deactivate.svg"></button>';

        str =
          str +
          '<button class="button" onclick="deleteassistant(\'' +
          item.Id +
          '\')"><img src="./images/delete.svg"></button>';
        str = str + "</footer></div>";
      });
      console.log(str);
      // if (str.length > 0) {
      assistantlist.innerHTML = str;
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
    "https://ai.iamplus.services/api/v1/db/data/v1/UserAssistant/Assistant?limit=25&shuffle=0&offset=0&where=(UUID%2Ceq%2C" +
      user.uuid +
      ")"
  );
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("xc-token", "dylFE2UGqVNqHZR0OtruRDJh2UKNxVbitJwQvp1x");

  xhr.send();
}

function getsystemassistant() {
  // WARNING: For GET requests, body is set to null by browsers.

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  var str = "";
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      prompts = data.list;
      prompts.forEach(function (item) {
        console.log(item);
        str = str + '<div class="assistant-card">';
        str = str + "<header><h2>" + item.Title + "</h2>";
        str = str + '<div class="headerbuttons">';
        str =
          str +
          '<button class="button" onclick="duplicate(\'' +
          item.Id +
          '\')"><img src="./images/duplicate.svg"></button>';

        str =
          str +
          '&nbsp;&nbsp;&nbsp;<button class="button" onclick="toggleCollapse(this)"><img src="./images/down.svg"></button>';
        str = str + "</div></header><section>";
        str =
          str +
          '<p><span class="ptitle">Prompt:</span><br><span class="pbody">' +
          truncate(item.Prompt) +
          "</span></p>";
        str =
          str + '<p><span class="ptitle">Retrieval:</span><br><span class="pbody">' + item.Retrieval + "</span></p>";
        str =
          str + '<p><span class="ptitle">Web Search:</span><br><span class="pbody">' + item.WebSearch + "</span></p>";
        str =
          str +
          '<p><span class="ptitle">Rich Results:</span><br><span class="pbody">' +
          item.rich_results +
          "</span></p>";
        str = str + '<p><span class="ptitle">Urls:</span><br><span class="pbody">';
        if (item.URL && item.URL.length > 0) {
          var urlarr = item.URL.split(";");
          urlarr.forEach(function (url) {
            str = str + '<a href="' + url + '" target="_blank" class="url-list">' + url + "</a><br>";
          });
        }
        str = str + "</span></p>";
        str = str + '<p><span class="ptitle">Files:</span><br><span class="pbody">';
        if (item.Files && item.Files.length > 0) {
          var Filesarr = item.Files;
          Filesarr = Filesarr.replaceAll("{", "");
          Filesarr = Filesarr.replaceAll("}", "");
          Filesarr = Filesarr.replaceAll('"', "");
          console.log("Filesarr:" + Filesarr);
          Filesarr = Filesarr.split(",");
          console.log("Filesarr:" + Filesarr);
          Filesarr.forEach(function (file) {
            str = str + '<a href="' + file + '" target="_blank" class="url-list">' + file + "</a><br>";
          });
        }
        str = str + "</span></p>";
        str =
          str +
          '<p><span class="ptitle">Search Fields:</span><br><span class="pbody">' +
          item.store_search_fields +
          "</span></p>";
        str = str + "</section><footer>";
        str = str + "</footer></div>";
      });
      console.log(str);
      // if (str.length > 0) {
      systemassistantlist.innerHTML = str;
      // sectionresults.style.visibility = "visible";
      // sectionassistant.style.display = "none";
      sectionsystemassistant.style.display = "block";
      //     } else {
      //         sectionassistant.style.display = "block";
      //     }
    }
  });

  xhr.open(
    "GET",
    "https://ai.iamplus.services/api/v1/db/data/v1/UserAssistant/SystemAssistant?limit=250&shuffle=0&offset=0"
  );
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("xc-token", "dylFE2UGqVNqHZR0OtruRDJh2UKNxVbitJwQvp1x");

  xhr.send();
}

function updateassistant(itemid, Status, ChatbotURL, AgentSessionID, Streamid, DataStoreName, deploy_id) {
  var data = JSON.stringify({
    Status: Status,
    ChatbotURL: ChatbotURL,
    AgentSessionID: AgentSessionID,
    Streamid: Streamid,
    DataStoreName: DataStoreName,
    deploy_id: deploy_id,
  });

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      getassistant();
    }
  });

  xhr.open("PATCH", "https://ai.iamplus.services/api/v1/db/data/v1/UserAssistant/Assistant/" + itemid);
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("xc-token", "dylFE2UGqVNqHZR0OtruRDJh2UKNxVbitJwQvp1x");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
}

function deleteassistant(itemid) {
  let text = "Please confirm to delete the prompt!";
  if (confirm(text) == true) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        getassistant();
        // location.reload();
      }
    });
    xhr.open("DELETE", "https://ai.iamplus.services/api/v1/db/data/v1/UserAssistant/Assistant/" + itemid);
    xhr.setRequestHeader("accept", "*/*");
    xhr.setRequestHeader("xc-token", "dylFE2UGqVNqHZR0OtruRDJh2UKNxVbitJwQvp1x");
    xhr.send();
  }
}

function truncate(str) {
  var n = 500;
  return str && str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
}

async function startindexing(itemid) {
  let assistant = await getassistant_itemid(itemid);
  console.log(assistant);
  var aurls = [],
    links = [];
  console.log("assistant.URL.length:" + assistant.URL.length);
  console.log("assistant.URL.includes():" + assistant.URL.includes(";"));

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
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      updateassistant(itemid, "Indexing", "", data.session_id, "", DataStoreName);
    }
  });

  xhr.open("POST", "https://ai.iamplus.services/elastic/api/text/bulk_index_urls");
  xhr.setRequestHeader("xc-token", "iIPyByKL-3X48AzXvme9onV9p94GwrmWTqV7P5jQ");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
}

async function updateindexstatus(itemid, session_id) {
  // WARNING: For GET requests, body is set to null by browsers.
  let assistant = await getassistant_itemid(itemid);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      if (data.workflow_status == "WORKFLOW_EXECUTION_STATUS_COMPLETED") {
        updateassistant(itemid, "Ready To Deploy", "", session_id, "", assistant.DataStoreName);
      }
    }
  });

  xhr.open("GET", "https://ai.iamplus.services/elastic/api/text/bulk_index_urls?session_id=" + session_id);
  xhr.send();
}

async function deploy(itemid) {
  let assistant = await getassistant_itemid(itemid);
  // WARNING: For POST requests, body is set to null by browsers.
  const deploy_id = crypto.randomUUID() + "_" + assistant.UUID;
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
        name: user.name ? user.name : "",
        picture: user.picture ? user.picture : "",
        phone_no: user.phone_no ? user.phone_no : "",
        email: user.email ? user.email : "",
        timezone: user.timezone ? user.timezone : "",
        area_name: user.area_name ? user.area_name : "",
        country_name: user.country_name ? user.country_name : "",
        pincode: user.pincode ? user.pincode : "",
        iso_2d_country_code: user.iso_2d_country_code ? user.iso_2d_country_code : "",
        administrative_area_level_2: user.administrative_area_level_2 ? user.administrative_area_level_2 : "",
        administrative_area_level_1: user.administrative_area_level_1 ? user.administrative_area_level_1 : "",
      },
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
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

    xhr.open("POST", "https://ai.iamplus.services/workflow/agent");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
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
        name: user.name ? user.name : "",
        picture: user.picture ? user.picture : "",
        phone_no: user.phone_no ? user.phone_no : "",
        email: user.email ? user.email : "",
        timezone: user.timezone ? user.timezone : "",
        area_name: user.area_name ? user.area_name : "",
        country_name: user.country_name ? user.country_name : "",
        pincode: user.pincode ? user.pincode : "",
        iso_2d_country_code: user.iso_2d_country_code ? user.iso_2d_country_code : "",
        administrative_area_level_2: user.administrative_area_level_2 ? user.administrative_area_level_2 : "",
        administrative_area_level_1: user.administrative_area_level_1 ? user.administrative_area_level_1 : "",
      },
    });
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
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

    xhr.open("POST", "https://ai.iamplus.services/workflow/personal_assistant");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  }
}

async function deactivate(itemid) {
  let assistant = await getassistant_itemid(itemid);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      updateassistant(itemid, "Ready To Deploy", "", assistant.AgentSessionID, "", assistant.data_store_name);
    }
  });
  xhr.open("DELETE", "https://ai.iamplus.services/workflow/workflow?session_id=" + assistant.AgentSessionID);
  xhr.send();
}

const getassistant_itemid = (itemid) =>
  new Promise(function (resolve, reject) {
    // WARNING: For GET requests, body is set to null by browsers.

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        let data = JSON.parse(this.responseText);
        resolve(data);
      }
    });

    xhr.open("GET", "https://ai.iamplus.services/api/v1/db/data/v1/UserAssistant/Assistant/" + itemid);
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("xc-token", "dylFE2UGqVNqHZR0OtruRDJh2UKNxVbitJwQvp1x");

    xhr.send();
  });

const getsystemassistant_itemid = (itemid) =>
  new Promise(function (resolve, reject) {
    // WARNING: For GET requests, body is set to null by browsers.

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        let data = JSON.parse(this.responseText);
        resolve(data);
      }
    });

    xhr.open("GET", "https://ai.iamplus.services/api/v1/db/data/v1/UserAssistant/SystemAssistant/" + itemid);
    xhr.setRequestHeader("accept", "application/json");
    xhr.setRequestHeader("xc-token", "dylFE2UGqVNqHZR0OtruRDJh2UKNxVbitJwQvp1x");

    xhr.send();
  });

function toggleCollapse(button) {
  console.log(button.querySelector("img"));
  // var content = document.querySelector('.assistant-card');
  var content = button.parentElement.parentElement.parentElement;
  if (content.classList.contains("expanded")) {
    content.classList.remove("expanded");
    button.querySelector("img").src = "./images/down.svg";
    //   button.textContent = 'v'; // Change to down caret when collapsed
  } else {
    content.classList.add("expanded");
    button.querySelector("img").src = "./images/up.svg";
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
}

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getaddressdetails() {
  return new Promise(async (resolve, reject) => {
    let location = await getUserLocation();
    location = JSON.parse(location);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        resolve(JSON.parse(this.responseText));
      }
    });
    let url =
      "https://ai.iamplus.services/location/getaddress?latitude=" + location.lat + "&longitude=" + location.long;
    console.log("URL:" + url);
    xhr.open("GET", url);
    xhr.send();
  });
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
      resolve(getipadress());
      // reject(new Error("Geolocation is not supported by your browser"));
    } else {
      // navigator.geolocation.getCurrentPosition(success, getipadress);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log("got geo location:" + JSON.stringify({ lat: pos.coords.latitude, long: pos.coords.longitude }));
          resolve(JSON.stringify({ lat: pos.coords.latitude, long: pos.coords.longitude }));
        },
        (error) => {
          console.log("Geolocation permission denied:" + error.message);
          resolve(getipadress());
        }
      );
    }
  });
}

const getipadress = () => {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.ipdata.co/?api-key=edadfa1ba2f38b1066342735ae303338478afada8e5eeb770929fafd");
    request.setRequestHeader("Accept", "application/json");
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        var data = JSON.parse(this.responseText);
        console.log(`ip lat: ${data.latitude} long: ${data.longitude}`);
        resolve(JSON.stringify({ lat: data.latitude, long: data.longitude }));
      }
    };
    request.send();
  });
};
