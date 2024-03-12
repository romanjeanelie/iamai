import gsap from "gsap";
import Flip from "gsap/Flip";

const STATES = {
  CLOSED: "closed",
  MINIMIZED: "minimized",
  FULLSCREEN: "fullscreen",
}

const STATUSES = {
  IN_PROGRESS: "inProgress",
  INPUT_REQUIRED: "inputRequired",
  COMPLETED: "completed",
};

const STATUS_COLORS = {
  [STATUSES.IN_PROGRESS]: "rgba(0, 0, 0, 0.72)",
  [STATUSES.INPUT_REQUIRED]: "rgba(224, 149, 2, 1)",
  [STATUSES.COMPLETED]: "rgba(0, 128, 83, 1)",
};

const defaultValues = {
  [STATUSES.IN_PROGRESS]: {
    label: "In Progress",
    title: "searching",
    description: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  },
  [STATUSES.INPUT_REQUIRED]: {
    label: "Input required",
    title: "question",
    description: "Flight for 18th Mar are all fully booked. Is there any other dates you would like to try for?",
  },
  [STATUSES.COMPLETED]: {
    label: "View results",
    title: "",
    description: "",
  },
};

gsap.registerPlugin(Flip);

// TO DO 
// [X] make the button appear when a task is created 
// [X] update the button with the state
// [X] show number of tasks on the button
// [X] Do the basic layout for the minimized state
// [X] make the accordion for the task list
// [X] update the active tasks in the accordion
// [X] intro animation for taskManager
// [X] Do the basic layout for the fullscreen state
// [X] handle transition between minimized and fullscreen state
// [X] handle transition between fullscreen and minimized state
// [X] finish integration of fullscreen state
// [X] retourne the chevron when panel is opened
// [X] make the accordion dynamic
// [X] change the color  of the status-pill in the accordion in function of the status
// [X] when adding a new panel to the accordion, update the click event listener
// [X] handle the accordion panel in function of the type of the status (input required, in progress, completed)
// [X] for the input required change the status after input has been entered
// [] when new task or updated task, scroll to the task
// [] handle the notification pastille when input required or completed
// [] do the animation of the notification pastille
// [] do the animation of when a task is added
// [] if task updated and prev update was input, remove input before going to next update ? 

export default class TaskManager {
  constructor({ pageEl, gui, emitter }) {
    // DOM Elements
    this.pageEl = pageEl;
    this.container = this.pageEl.querySelector(".task-manager__container");
    this.button = this.pageEl.querySelector(".task-manager__button");
    this.closeButton = this.pageEl.querySelector(".task-manager__closing-icon");
    this.fullscreenButton = this.pageEl.querySelector(".task-manager__fullscreen-icon");
    this.closeFullscreenButton = this.pageEl.querySelector(".task-manager__closeFullscreen-icon");
    this.accordionContainer = this.pageEl.querySelector(".task-manager__accordion-container");

    // States
    this.taskManagerState = STATES.CLOSED;
    this.currentTask = null;
    this.addListeners();

    // ALEX -> Comment/uncomment to have tasks at start for integration
    this.tasks = [
        // {
        //   name: "Task 1",
        //   key: 1,
        //   status: {
        //     type: STATUSES.IN_PROGRESS,
        //     title: "searching",
        //     description:
        //       "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        //   },
        // },
        // {
        //   name: "Task 2",
        //   key: 2,
        //   status: {
        //     type: STATUSES.INPUT_REQUIRED,
        //     title: "question",
        //     description: "Flight for 18th Mar are all fully booked. Is there any other dates you would like to try for?",
        //   },
        // },
        // {
        //   name: "Task 3",
        //   key: 3,
        //   status: {
        //     type: STATUSES.COMPLETED,
        //     title: "",
        //     description: "",
        //   },
        // },
    ];

    // Debug
    this.debugContainer = this.pageEl.querySelector(".task-manager__debug");
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.gui = gui;

    if (this.debug) {
      this.debugTask = {
        name: `Task ${this.tasks.length + 1}`,
        key: this.tasks.length + 1,
      };

      this.taskNameController = this.gui.add(this.debugTask, "name").onChange((value) => {
        this.debugTask.name = value;
      });

      this.gui.add(
        {
          addTask: (e) => {
            const task = {
              ...this.debugTask,
              status: { type: STATUSES.IN_PROGRESS, ...defaultValues[STATUSES.IN_PROGRESS] },
            };
            this.addDebugTask(task);
            this.createTask(task);

            this.debugTask.name = `Task ${this.tasks.length + 1}`;
            this.debugTask.key = this.tasks.length + 1;
            this.taskNameController.setValue(this.debugTask.name);
          },
        },
        "addTask"
      );

      this.tasks.forEach((task) => {
        this.addDebugTask(task);
      });
    }
  }

  addDebugTask(task) {
    const folder = this.gui.addFolder(task.name);
    folder.open();
    folder.add(task.status, "type", STATUSES).onChange((value) => {
      task.status = { type: value, ...defaultValues[value] };
      titleController.setValue(task.status.title);
      descriptionController.setValue(task.status.description);
      this.onStatusUpdate(task.key, task.status);
    });

    const titleController = folder.add(task.status, "title").onChange((value) => {
      task.status.title = value;
    });

    const descriptionController = folder.add(task.status, "description").onChange((value) => {
      task.status.description = value;
    });
    folder.add(
      {
        updateStatus: () => {
          this.onStatusUpdate(task.key, task.status);
        },
      },
      "updateStatus"
    );
    folder.add(
      {
        deleteTask: () => {
          this.removeTask(task.key);
          this.debugTask.name = `Task ${this.tasks.length + 1}`;
          this.debugTask.key = this.tasks.length + 1;
          this.taskNameController.setValue(this.debugTask.name);
          this.gui.removeFolder(folder);
        },
      },
      "deleteTask"
    );
  }

  // ---------- Handling the task-manager states ----------
  changeState(newState) {
    this.taskManagerState = newState;
    const initialState = Flip.getState(this.container);

    // Remove all state classes
    this.container.classList.remove("closed", "minimized", "fullscreen");
    // Add the new state class
    this.container.classList.add(newState);
  
    Flip.from(initialState, {
      duration: 0.5,
      ease: "power2.inOut",
      absolute: true,
    })
  }
  
  closeTaskManager() {
    this.changeState(STATES.CLOSED);
  }
  
  toMinimized() {
    this.closeFullscreenButton.classList.add("hidden")
    this.fullscreenButton.classList.remove("hidden")
    this.changeState(STATES.MINIMIZED);
  }
  
  toFullscreen() {
    this.closeFullscreenButton.classList.remove("hidden")
    this.fullscreenButton.classList.add("hidden")
    this.changeState(STATES.FULLSCREEN);
  }

  // ---------- Handling the notification pill ----------
  initNotificationPill(taskKey, status){
    if (this.notificationContainer) this.disposeNotificationPill();

    this.notificationContainer = document.createElement("div");
    this.notificationContainer.classList.add("task-manager__notification-container" , "hidden");
    
    this.notificationContainer.style.backgroundColor = STATUS_COLORS[status.type]; 

    const notificationLabel = document.createElement("p");
    notificationLabel.classList.add("task-manager__notification-label");
    notificationLabel.textContent = status.label;

    const notificationCloseBtn = document.createElement("button");
    notificationCloseBtn.classList.add("task-manager__notification-closeBtn");
    notificationCloseBtn.innerHTML = `
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.800781" y="1.47949" width="0.96" height="10.56" rx="0.48" transform="rotate(-45 0.800781 1.47949)" fill="white"/>
        <rect x="0.799805" y="8.26758" width="10.56" height="0.96" rx="0.48" transform="rotate(-45 0.799805 8.26758)" fill="white"/>
      </svg>
    `

    this.notificationContainer.appendChild(notificationLabel);
    this.notificationContainer.appendChild(notificationCloseBtn);
    this.pageEl.appendChild(this.notificationContainer);

    this.notificationContainer.addEventListener('click', () => {
      this.expandNotificationPill();
      console.log(taskKey)
    });
    notificationCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeNotificationPill();
    })

    this.expandNotificationPill();
  }

  expandNotificationPill(){
    const label = this.notificationContainer.querySelector(".task-manager__notification-label");
    const closeBtn = this.notificationContainer.querySelector(".task-manager__notification-closeBtn");
    const svg = closeBtn.querySelector("svg");

    gsap.to(this.notificationContainer,{
      opacity: 1,
      onComplete: () => {
        const initialState = Flip.getState([this.notificationContainer, label, closeBtn, svg] );
        this.notificationContainer.classList.add("expanded");
        Flip.from(initialState, {
          duration: 0.5,
          ease: "power2.inOut",
          absolute: true,
          onComplete: () => this.notificationContainer.classList.remove("hidden")
        })
      }
    })
  }

  closeNotificationPill(){
    const label = this.notificationContainer.querySelector(".task-manager__notification-label");
    const closeBtn = this.notificationContainer.querySelector(".task-manager__notification-closeBtn");
    const svg = closeBtn.querySelector("svg");

    const initialState = Flip.getState([this.notificationContainer, label, closeBtn, svg] );
    this.notificationContainer.classList.remove("expanded");
    Flip.from(initialState, {
      duration: 0.5,
      ease: "power2.inOut",
      absolute: true,
      onComplete: () => {
        gsap.to(this.notificationContainer,{
          opacity: 0,
          onComplete: () => this.disposeNotificationPill()
        })
      }
    })
  }

  disposeNotificationPill(){
    this.notificationContainer.remove();
    this.notificationContainer = null;
  }

  handleNotificationPill(taskKey, status){
    if (status.type === STATUSES.INPUT_REQUIRED || status.type === STATUSES.COMPLETED){
      this.initNotificationPill(taskKey, status);
    } else {
      this.notificationContainer.classList.add("hidden");
    }
  }

  // ---------- Handling the task-manager button ----------
  getButtonColor(){
    // order of priority for the color of the button
    const order = [STATUSES.COMPLETED, STATUSES.INPUT_REQUIRED, STATUSES.IN_PROGRESS];
    for (const status of order){
      // the first status found in the tasks array will be the color of the button
      if (this.tasks.some((task) => task.status.type === status)){
        return STATUS_COLORS[status];
      }
    }
  }

  initializeButton(){
    this.button.classList.remove("hidden");
    this.updateButton();
  }

  updateButton(){
    this.button.innerHTML = this.tasks.length;
    this.button.style.backgroundColor = this.getButtonColor();
  }

  removeButton(){
    this.button.classList.add("hidden");
  }

  handleButton (){
    if (this.tasks.length === 0){
      this.removeButton();
    } else if (this.tasks.length === 1){
      this.initializeButton();
    } else {
      this.updateButton();
    }
  }

  // ---------- Handling the accordion ----------
  togglePanel(key) {
    // Check if the clicked panel is already open
    const isPanelOpen = this.currentTask === key

    // Close all panels
    this.accordionPanels.forEach(panel => panel.style.maxHeight = "0px");
    this.accordionHeaders.forEach(header => header.classList.remove("active"));
    // If the clicked panel was not already open, open it
    if (!isPanelOpen) {
      const currentTask = this.accordionContainer.querySelector(`[task-key="${key}"]`);
      currentTask.querySelector('.task-manager__accordion-header').classList.add("active");
      const panel = currentTask.querySelector('.task-manager__accordion-panel') 
      panel.style.maxHeight = panel.scrollHeight + "px";
      this.currentTask = key
    } else {
      this.currentTask = null
    }
  }

  goToPanel(key){
    // Close all panels
    this.accordionPanels.forEach(panel => panel.style.maxHeight = "0px");
    this.accordionHeaders.forEach(header => header.classList.remove("active"));

    // Open the panel or update its max height
    const currentTask = this.accordionContainer.querySelector(`[task-key="${key}"]`);
    currentTask.querySelector('.task-manager__accordion-header').classList.add("active");
    const panel = currentTask.querySelector('.task-manager__accordion-panel') 
    panel.style.maxHeight = panel.scrollHeight + "px";
    this.currentTask = key
  }

  // ---------- Update the tasks UI  ----------
  addTaskUI(data){
   // Create elements
    const li = document.createElement("li");
    li.setAttribute("task-key", data.key)
    li.classList.add("task-manager__accordion");

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("task-manager__accordion-header");

    const headerTitle = document.createElement("h4");
    headerTitle.textContent = data.name;

    const statusDiv = document.createElement("div");

    const statusPill = document.createElement("p");
    statusPill.classList.add("task-manager__status-pill");
    statusPill.style.backgroundColor = STATUS_COLORS[data.status.type];
    statusPill.textContent = data.status.label;

    const chevronButton = document.createElement("button");
    chevronButton.classList.add("task-manager__accordion-chevron");

    const chevronIcon = document.createElement("img");
    chevronIcon.src = "/images/down.svg";
    chevronIcon.alt = "chevron down icon";

    const panelDiv = document.createElement("div");
    panelDiv.classList.add("task-manager__accordion-panel");

    const statusContainerDiv = document.createElement("div");
    statusContainerDiv.classList.add("task-manager__status-container");

    const statusTitleP = document.createElement("p");
    statusTitleP.classList.add("task-manager__status-title");
    statusTitleP.textContent = data.status.title;

    const statusDescriptionP = document.createElement("p");
    statusDescriptionP.classList.add("task-manager__status-description");
    statusDescriptionP.textContent = data.status.description;

    // Append elements
    headerDiv.appendChild(headerTitle);
    statusDiv.appendChild(statusPill);
    chevronButton.appendChild(chevronIcon);
    statusDiv.appendChild(chevronButton);
    headerDiv.appendChild(statusDiv);

    statusContainerDiv.appendChild(statusTitleP);
    statusContainerDiv.appendChild(statusDescriptionP);
    panelDiv.appendChild(statusContainerDiv);

    li.appendChild(headerDiv);
    li.appendChild(panelDiv);

    this.accordionContainer.appendChild(li);

    // I set the accordionHeaders and Panels up to date
    this.accordionHeaders = Array.from(this.pageEl.querySelectorAll('.task-manager__accordion-header'));
    this.accordionPanels = Array.from(this.pageEl.querySelectorAll('.task-manager__accordion-panel'));

    headerDiv.addEventListener('click', () => this.togglePanel(data.key));
  }

  addPanel(key, panel, status){
    if (status.type === STATUSES.COMPLETED) {
      // we add an empty panel when complete to override the pink color of the last panel set in CSS.
      const statusContainerDiv = document.createElement("div");
      panel.appendChild(statusContainerDiv); 
      return; 
    }; 
    
    const divider = document.createElement("div");
    divider.classList.add("task-manager__accordion-panel-divider");
    
    const statusContainerDiv = document.createElement("div");
    statusContainerDiv.classList.add("task-manager__status-container");

    const statusTitleP = document.createElement("p");
    statusTitleP.classList.add("task-manager__status-title");
    statusTitleP.textContent = status.title;

    const statusDescriptionP = document.createElement("p");
    statusDescriptionP.classList.add("task-manager__status-description");
    statusDescriptionP.textContent = status.description;

    statusContainerDiv.appendChild(statusTitleP);
    statusContainerDiv.appendChild(statusDescriptionP);

    if (status.type === STATUSES.INPUT_REQUIRED){
      this.addInput(key, statusContainerDiv)
    }

    panel.appendChild(divider)
    panel.appendChild(statusContainerDiv)
  }

  addInput(key, statusContainer){
    const statusInputContainer = document.createElement("form");
    statusInputContainer.classList.add("task-manager__input-container");

    const statusInput = document.createElement("input");
    statusInput.type = "text";
    statusInput.classList.add("task-manager__input");

    const button = document.createElement("button");
    button.type = "submit";

    const buttonIcon = document.createElement("img");
    buttonIcon.src = "/icons/arrow-up.svg";
    buttonIcon.alt = "arrow up icon";
    button.appendChild(buttonIcon);

    statusInputContainer.addEventListener('submit', (e) => this.handleSubmit(e, key, statusInputContainer));

    statusInputContainer.appendChild(statusInput);
    statusInputContainer.appendChild(button);
    statusContainer.appendChild(statusInputContainer);
  }

  handleSubmit(e, key, container){
    e.preventDefault();
    const input = e.target.querySelector("input");
    const value = input.value;
    console.log(value) // here is the value from input 

    this.closeInput(container);

    this.onStatusUpdate(key,{
      type: STATUSES.IN_PROGRESS,
      title: "answer : ",
      description: "Processing the answer...",
    })
  }

  closeInput(container){
    container.style.display = "none";
  }

  updateTaskUI(key, status){
    const task = this.accordionContainer.querySelector(`[task-key="${key}"]`);
    const header = task.querySelector(".task-manager__accordion-header");
    const statusPill = header.querySelector(".task-manager__status-pill");
    statusPill.innerText = status.label
    statusPill.style.backgroundColor = STATUS_COLORS[status.type];

    const panel = task.querySelector(".task-manager__accordion-panel");

    this.addPanel(key, panel, status)
    this.goToPanel(key)
  }

  // ---------- Handling the tasks ----------
  createTask(task) {
    this.tasks.push(task);
    this.addTaskUI(task)
    this.handleButton();
  }

  removeTask(taskKey) {
    this.tasks = this.tasks.filter((task) => task.key !== taskKey);
    this.handleButton();
  }

  onStatusUpdate(taskKey, status) {
    this.handleButton();
    this.updateTaskUI(taskKey, status);
    this.handleNotificationPill(taskKey, status);
  }

  addListeners(){
    this.button.addEventListener('click', () => this.toMinimized());
    this.closeButton.addEventListener('click', () => this.closeTaskManager());
    this.fullscreenButton.addEventListener('click', () => this.toFullscreen());
    this.closeFullscreenButton.addEventListener('click', () => this.toMinimized());
  }
}
