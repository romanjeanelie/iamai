import { connect, AckPolicy, JSONCodec } from "https://cdn.jsdelivr.net/npm/nats.ws@latest/esm/nats.js";
import { backgroundColorGreyPage } from "./../scss/variables/_colors.module.scss";
import typeByWord from "./utils/typeByWord.js";
import TypingText from "./TypingText.js";
import { gsap } from "gsap";
import Config from "./getConfig.js";

const HOST = import.meta.env.VITE_API_HOST || "https://api.asterizk.ai";
var NATS_URL = "";
var NATS_USER = "";
var NATS_PASS = "";

const inputBackEl = document.querySelector(".input__back");
const inputText = inputBackEl.querySelector(".input-text");
const submitBtn = inputBackEl.querySelector(".submit");
const inputContainer = document.querySelector("div.input__container.grey");
const container = document.querySelector("discussion__container")
const discussionWrapper = document.querySelector(".discussion__wrapper");
const prevDiscussionContainer = document.querySelector(".prev-discussion__container");
const discussionContainer = document.querySelector(".discussion__container");
const mainEl = document.querySelector("main");
var AIContainer;
var typingText;


var workflowID = "";
var sessionID = "";
var deploy_ID = "";
let steamseq = [];
var currentAnswerContainer = "";

const
    PA_RESPONSE_ENDED = "response_ended",
    STREAMING = "streaming",
    AGENT_PROGRESSING = "agent_progressing",
    AGENT_ANSWERED = "agent_answered",
    AGENT_ENDED = "agent_ended";

window.addEventListener("load", async () => {
    inputBackEl.style.pointerEvents = "auto";
    inputBackEl.style.opacity = 1;
    disableInput();

    submitBtn.addEventListener('click', function (event) {
        onSubmit(event); // Pass the event object to the onSubmit function
    });
    inputText.addEventListener("focus", () => {
        submitBtn.disabled = !inputText.value.trim().length > 0;
    });

    inputText.addEventListener("input", (event) => {
        submitBtn.disabled = !inputText.value.trim().length > 0;
    });
    inputText.addEventListener("keydown", (event) => {
        if (inputText.value.trim().length > 0 && event.key === "Enter" && !event.shiftKey) {
            onSubmit(event);
        }
    });

    document.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop === 0) onScrollTop();
    });

    checkIfPrevDiscussionContainerVisible();

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var q = urlParams.get("q");
    sessionID = urlParams.get("session_id");
    deploy_ID = urlParams.get("deploy_id");
    if (sessionID && sessionID != "") {
        const config = new Config();
        config.getWebsiteConfig().then(data => {
            if (data) {
                NATS_URL = data.NATS_URL;
                NATS_USER = data.NATS_USER;
                NATS_PASS = data.NATS_PASS;
                getAiAnswer("");
            } else {
                console.log('No data available');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }
});

async function callsubmit(text) {
    var input_text = text;

    if (workflowID != "") {
        submituserreply(input_text, workflowID, "");
    } else {
        workflowID = sessionID;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = async () => {
            if (xhr.readyState == 4) {
                let text = JSON.parse(xhr.response);
                let stream_name = text.stream_id;
                getstreamdata(stream_name);
            }
        };

        xhr.addEventListener("error", async function (e) {
            console.log("error: " + e);
            var AIAnswer = "An error occurred while attempting to connect.";
            addAIText(AIAnswer);
            enableInput();
        });
        if (sessionID && sessionID != "") {
            xhr.open("POST", HOST + "/workflows/conversation", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("client_id", "f29641679120cc3ff810b758");

            if (sessionID.startsWith("wf-external-conversation")) {
                xhr.send(
                    JSON.stringify({
                        session_id: sessionID,
                        uuid: "omega_" + crypto.randomUUID() + "@costar.life",
                    })
                );
            } else {
                xhr.send(
                    JSON.stringify({
                        session_id: sessionID,
                        uuid: deploy_ID,
                    })
                );
            }
        } else {
            xhr.open("POST", HOST + "/workflows/tasks", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(
                JSON.stringify({
                    query: input_text,
                    uuid: "omega_" + crypto.randomUUID() + "@costar.life",
                })
            );
        }
    }
}

async function getstreamdata(stream_name) {
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
        if (steamseq.includes(m.seq) && m.redelivered) {
            m.ack();
        } else {
            steamseq.push(m.seq);
            var mtext = mdata.response_json;
            //generate data
            if (mdata.status && mdata.status == STREAMING) {
                var mtext = mdata.response_json.text;
                if (mtext.trim().length > 0) {
                    var AIAnswer = await toTitleCase2(mtext);
                    addAIText(AIAnswer);
                }
            } else if (mdata.status.toLowerCase() == PA_RESPONSE_ENDED) {
                enableInput();
            } else if (mdata.status && mdata.status == AGENT_PROGRESSING) {
                if (mdata.awaiting) {
                    var mtext = mdata.response_json.text;
                    if (mtext.trim().length > 0) {
                        var AIAnswer = await toTitleCase2(mtext);
                        addAIText(AIAnswer);
                        enableInput();
                    }
                } else {
                    var mtext = mdata.response_json.text;
                    if (mtext.trim().length > 0) {
                        var AIAnswer = await toTitleCase2(mtext);
                        addAIText(AIAnswer);
                    }
                }
            } else if (mdata.status && mdata.status == AGENT_ENDED) {
                sessionID = "";
                deploy_ID = "";
                let textContainer = AIContainer.querySelector(".text__container");
                if (!textContainer) {
                    textContainer = document.createElement("div");
                    textContainer.className = "text__container";
                    AIContainer.appendChild(textContainer);
                }
                var AIAnswer = 'Please click <a href="./index.html">here</a>, to visit our homepage.';
                let answerSpan = document.createElement("span");
                answerSpan.className = "AIanswer";
                answerSpan.innerHTML = AIAnswer;
                textContainer.appendChild(answerSpan);
            }
            m.ack();
        }
    }
    nc.drain();
};

function submituserreply(text, suworkflowid, img) {
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
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            // console.log(this.responseText);
            // console.time("RequestStart");
        }
    });

    xhr.open("POST", HOST + "/workflows/message/" + suworkflowid);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("client_id", "f29641679120cc3ff810b758");
    xhr.send(data);
}

function disableInput() {
    inputText.disabled = true;
    const childNodes = inputContainer.getElementsByTagName("*");
    for (var node of childNodes) {
        node.disabled = true;
    }
}

function enableInput() {
    inputText.disabled = false;
    const childNodes = inputContainer.getElementsByTagName("*");
    for (var node of childNodes) {
        node.disabled = false;
    }
    inputText.focus();
}

function addAIText(text) {
    let textContainer = AIContainer.querySelector(".text__container");

    if (!textContainer) {
        textContainer = document.createElement("div");
        textContainer.className = "text__container";
        AIContainer.appendChild(textContainer);
    }


    if (AIContainer !== currentAnswerContainer) {
        currentAnswerContainer = AIContainer;
    }

    typingText?.fadeOut();
    return typeByWord(textContainer, text);
}

// Submit
function onSubmit(event) {
    event.preventDefault();
    addUserElement(inputText.value);
    inputText.value = "";
}

async function addUserElement(text) {
    //reduced the duration to save time
    await gsap.to(discussionContainer, { duration: 0.0005, y: -40, opacity: 0, ease: "power2.inOut" });
    moveChildrenToPrevContainer();

    const userContainer = document.createElement("div");
    userContainer.classList.add("discussion__user");
    var userContainerspan = document.createElement("span");
    userContainerspan.classList.add("discussion__userspan");
    userContainerspan.innerHTML = text.replace(/\n/g, "<br>");
    userContainer.appendChild(userContainerspan);

    discussionContainer.appendChild(userContainer);
    //moves this to save time

    getAiAnswer(text);

    gsap.fromTo(
        discussionContainer,
        { y: 20, opacity: 0 },
        { duration: 0.5, delay: 0.2, y: 0, opacity: 1, ease: "power2.inOut" }
    );
    disableInput();
}

function getAiAnswer(text) {
    AIContainer = document.createElement("div");
    AIContainer.classList.add("discussion__ai");
    discussionContainer.appendChild(AIContainer);

    typingText = new TypingText({
        text: "",
        container: AIContainer,
        backgroundColor: backgroundColorGreyPage,
        marginLeft: 16,
    });

    typingText.fadeIn();
    typingText.displayTextSkeleton();
    callsubmit(text);
}

function moveChildrenToPrevContainer() {
    prevDiscussionContainer.classList.add("hidden");
    const children = Array.from(discussionContainer.childNodes);

    children.forEach((child) => {
        prevDiscussionContainer.appendChild(child);
    });
    scrollToBottom();

    // Wait for scroll finish
    setTimeout(() => {
        prevDiscussionContainer.classList.remove("hidden");
    }, 1000);
}

function scrollToBottom(isSmooth = true) {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: isSmooth ? "smooth" : "auto",
    });
}

function toTitleCase2(str) {
    str = str.replaceAll("\n", "<br>");
    return str;
}

async function onScrollTop() {
    console.log("ON SCROLL TOP");
    // only if there is more history to be added, we change the scrollTop value so the user stays at the same spot
    if (container.hasChildNodes()) {
        mainEl.scrollTop = document.documentElement.scrollTop = container.offsetHeight;
    }
}

function checkIfPrevDiscussionContainerVisible() {
    let options = {
        rootMargin: "-96px",
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                prevDiscussionContainer.classList.add("visible");
            } else {
                prevDiscussionContainer.classList.remove("visible");
            }
        });
    };

    let observer = new IntersectionObserver(observerCallback, options);
    observer.observe(prevDiscussionContainer);
}
