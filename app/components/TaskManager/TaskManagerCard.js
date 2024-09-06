import gsap from "gsap";
import Flip from "gsap/Flip";
import { flightSearchData, flightSearchResultsData } from "../../../testData";
import { FlightUI } from "../UI/FlightUI";

gsap.registerPlugin(Flip);

export default class TaskManagerCard {
  constructor(task, index, discussion, emitter) {
    this.task = task;
    this.index = index;
    this.discussion = discussion;
    this.emitter = emitter;

    this.tasksGrid = document.querySelector(".task-manager__tasks-grid");
    this.fullscreenContainer = document.querySelector(".task-manager__task-fullscreen");

    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.initUI();
    this.addEventListeners();
  }

  initUI() {
    this.cardContainer = document.createElement("li");
    this.cardContainer.classList.add("task-manager__task-card-container");

    this.card = document.createElement("div");
    this.card.classList.add("task-manager__task-card");
    this.card.setAttribute("task-key", this.task.key);
    this.card.setAttribute("index", this.index);

    this.card.innerHTML = `
      <div class="card-state">
        <div class="task-manager__task-card-content">
          <h3 class="task-manager__task-card-title">
            ${this.task.name}
          </h3>

          <div class="task-manager__task-status">
            <p class="task-manager__task-status-label">
              ${this.task.status.label || this.task.status.type}
            </p>
          </div>
        </div>
        <div class="task-manager__task-illustration">
          <div class="task-manager__task-illustration-cover">
          </div>
          <div class="task-manager__task-illustration-behind">
          </div>
        </div>
      </div>

      <div class="fullscreen-state">
        <div class="discussion__userspan">
          ${this.task.name}          
        </div>
      </div>
    `;

    this.cardContainer.appendChild(this.card);
    this.tasksGrid.appendChild(this.cardContainer);
  }

  getElement() {
    return this.cardContainer;
  }

  animateCardToFullscreen() {
    const cardState = this.card.querySelector(".card-state");
    const fullscreenState = this.card.querySelector(".fullscreen-state");

    const tl = gsap.timeline();

    tl.to(cardState, {
      opacity: 0,
      duration: 0.2,
    });
    tl.add(() => {
      const state = Flip.getState(this.card);
      this.fullscreenContainer.appendChild(this.card);
      fullscreenState.style.display = "flex";
      cardState.style.display = "none";
      Flip.from(state, {
        duration: 0.5,
        absolute: true,
        onComplete: () => {
          // FOR DEMO PURPOSES ONLY (adding the flight ui manually here)
          const flightCards = new FlightUI(flightSearchData, flightSearchResultsData).getElement();
          const AIContainer = document.createElement("div");
          AIContainer.classList.add("discussion__ai");
          AIContainer.appendChild(flightCards);
          fullscreenState.appendChild(AIContainer);
          document.addEventListener("click", this.handleClickOutside);
        },
      });
    });
    tl.to(
      fullscreenState,
      {
        autoAlpha: 1,
        duration: 0.5,
      },
      "<0.5"
    );
  }

  handleClickOutside(event) {
    if (!this.fullscreenContainer.contains(event.target)) {
      this.closeFullscreen();
      document.removeEventListener("click", this.handleClickOutside);
    }
  }

  closeFullscreen() {
    const tasks = this.tasksGrid.querySelectorAll(".task-manager__task-card-container");

    const cardState = this.card.querySelector(".card-state");
    const fullscreenState = this.card.querySelector(".fullscreen-state");

    const tl = gsap.timeline();

    tl.to(fullscreenState, {
      opacity: 0,
    });
    tl.add(() => {
      const state = Flip.getState(this.card);
      tasks[this.index].appendChild(this.card);
      fullscreenState.style.display = "none";
      cardState.style.display = "flex";

      Flip.from(state, {
        duration: 0.5,
        delay: 0.5,
        onComplete: () => {
          gsap.to(cardState, {
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.1,
          });
        },
      });
    });
  }

  addEventListeners() {
    this.card.addEventListener("click", () => {
      this.animateCardToFullscreen();
    });
  }
}
