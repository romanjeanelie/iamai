var btnsubmit = document.getElementById("btnsubmit");
var textph = document.getElementById("textph");
var ddus = document.getElementById("ddus");
var ddlang = document.getElementById("ddlang");
var ddsol = document.getElementById("ddsol");
var textopening = document.getElementById("textopening");
var textprompt = document.getElementById("textprompt");
var divprompt = document.getElementById("divprompt");

var prompts;
const DB_HOST = import.meta.env.VITE_API_DB_HOST || "https://nocodb.asterizk.ai";
const DB_TOKEN = import.meta.env.VITE_API_DB_TOKEN || "juIbsot-ERPsSlO3TdkYHRJPznr1gqrLBIpMjWZU";
let uuid = "";

let phonenumber = "+6598588573";
let languageCode = "en-US";
let lang = "en";
let systemPrompt =
  "[INST] <<SYS>> You are a sophisticated AI, proficient in managing security scenarios through human-like dialogue. Your core duty is to swiftly report security compromises to the appropriate personnel. When initiating, identify yourself as Tiger Hong's AI representative. Given the present circumstances, an unauthorized intrusion has occurred at the SingTel Building, triggering the alarm at Side Gate A. Your objective is to communicate with John, the manager of the SingTel Building, and inform him of this breach while seeking further instructions.\n\nMaintain the conversation's focus strictly on the security situation, providing succinct answers. If John diverts with off-topic inquiries, gently redirect to the main issue. Upon receiving John's direction, confirm and outline the steps you'll take. Should his instruction deviate from your pre-approved actions, politely inform him of the constraints and list the available actions:\n\nDeploy internal patrol for onsite incident assessment.\nDocument and officially report the breach.\nNotify the police.\n\nRemember, only these three actions are within your capability. Politely reiterate these if prompted about others.\n\nPlease note this is a real incident.\n\nContextual Details:\n\nDate: 9th August 2023 11:00 am, Wednesday.\nLocation of Breach: SingTel Building, Side Gate A.\nPoint of Contact: John.\n\nYour responses should be brief, not exceeding 30 words, and maintain a human touch. <</SYS>> Let’s start the conversation. [/INST]";
let userPrompt =
  "<<SYS>> Your replies should remain succinct, with a maximum of 30 words, and should have a human touch.  If the customer brings up unrelated subjects, kindly steer the conversation back to the trainers. <</SYS>>";
let usermessage = "";
let opening = "";

window.addEventListener("load", load);
async function load() {
  divprompt.style.display = "none";

  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  var str = "";
  var tabelrow = document.getElementById("ddus");
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      // console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      prompts = data.list;
      prompts.forEach(function (item) {
        // console.log(item);
        str = str + '<option value="' + item.Id + '">' + item.Title + "</option>";
      });
      str = str + '<option value="others">Others</option>';
      tabelrow.innerHTML = str;
    }
  });

  xhr.open("GET", DB_HOST + "/api/v2/tables/mx1lmop3ix0cz9w/records?limit=250&shuffle=0&offset=0");
  xhr.setRequestHeader("accept", "application/json");
  xhr.setRequestHeader("xc-token", DB_TOKEN);

  xhr.send();
}

ddus.addEventListener("change", function () {
  if (ddus.value == "others") {
    divprompt.style.display = "block";
  } else {
    divprompt.style.display = "none";
  }
});

btnsubmit.addEventListener("click", async function (e) {
  btnsubmit.style.display = "none";
  lang = ddlang.value;
  phonenumber = textph.value;
  opening = textopening.value;

  if (phonenumber == "") {
    alert("please enter a phone number");
    btnsubmit.style.display = "block";
    return;
  }

  if (ddus.value != "others") {
    for (var i = 0; i < prompts.length; i++) {
      if (prompts[i].Id == ddus.value) {
        systemPrompt = prompts[i].systemprompt;
        userPrompt = prompts[i].userPrompt;
        usermessage = prompts[i].user_message;
        break;
      }
    }
  } else {
    if (textprompt.value == "") {
      alert("please enter a prompt");
      btnsubmit.style.display = "block";
      return;
    } else {
      systemPrompt = textprompt.value;
    }
  }
  if (lang == "ta") {
    languageCode = "ta-IN";
  } else if (lang == "hi") {
    languageCode = "hi-IN";
  } else if (lang == "bn") {
    languageCode = "bn-IN";
  } else if (lang == "te") {
    languageCode = "te-IN";
  } else if (lang == "kn") {
    languageCode = "kn-IN";
  }

  if (ddsol.value == "vonage") {
    if (opening == "") {
      alert("please enter an opening text");
      btnsubmit.style.display = "block";
      return;
    } else {
      vonage(opening, systemPrompt, phonenumber, languageCode);
    }
  } else {
    pilivo(lang, languageCode, systemPrompt, userPrompt, phonenumber, usermessage);
  }
});

function pilivo(lang, languageCode, systemPrompt, userPrompt, phonenumber, usermessage) {
  uuid = crypto.randomUUID();

  // WARNING: For POST requests, body is set to null by browsers.
  var data = JSON.stringify({
    system_prompt: systemPrompt,
    userprompt: userPrompt,
    phone: phonenumber,
    languageCode: languageCode,
    // "phrases": "Shiju,John Wick 4,The Flash,Barbie",
    lang: lang,
    user_message: usermessage,
    allow_user_interruptions: true,
  });

  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      // console.log(this.responseText);
      btnsubmit.style.display = "block";
      window.open("https://api.asterizk.ai/callservice/outbound/calls/" + uuid);
    }
  });
  xhr.open("PUT", "https://api.asterizk.ai/callservice/outbound/calls/" + uuid);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(data);
}

function vonage(opening, prompt, phone, languageCode) {
  // WARNING: For POST requests, body is set to null by browsers.
  const UUID = crypto.randomUUID();
  var data = JSON.stringify({
    intro_text: opening,
    system_prompt: prompt,
    phone: phone,
    language_code: languageCode,
    web_hook_url: "",
    nats_session_id: UUID,
  });

  var xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      // console.log(this.responseText);
      btnsubmit.style.display = "block";
      window.open("/call/call_res.html?UUID=" + UUID, "_blank");
    }
  });

  xhr.open("POST", "https://outbound.telephoney.iamplus.ngrok.app/call");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(data);
}
