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

// TO DO 
// [X] make the button appear when a task is created 
// [X] update the button with the state
// [X] show number of tasks on the button
// [X] Do the basic layout for the minimized state
// [] make the accordion for the task list
// [] refactor the accordion logic and put it inside its own class
// [] update the active tasks in the accordion
// [] make the accordion dynamic
// [] Do the basic layout for the fullscreen state
// [] handle transition between fullscreen and minimized state
// [] handle the accordion panel in function of the type of the status (input required, in progress, completed)

export default class TaskManager {
  constructor({ pageEl, gui, emitter }) {
    // DOM Elements
    this.pageEl = pageEl;
    this.container = this.pageEl.querySelector(".task-manager__container");
    this.button = this.pageEl.querySelector(".task-manager__button");
    this.accordionContainer = this.pageEl.querySelector(".task-manager__accordion-container");

    this.initializeAccordion();

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
  initializeAccordion() {
    this.accordionHeaders = Array.from(this.pageEl.querySelectorAll('.task-manager__accordion-header'));
    this.accordionPanels = Array.from(this.pageEl.querySelectorAll('.task-manager__accordion-panel'));
  
    this.accordionHeaders.forEach((header, index) => {
      header.addEventListener('click', () => this.handleAccordion(index));
    });
  }  



  handleAccordion(index) {
    // Check if the clicked panel is already open
    const isPanelOpen = this.accordionPanels[index].style.maxHeight !== "0px";
    
    // Close all panels
    this.accordionPanels.forEach(panel => panel.style.maxHeight = "0px");
    
    // If the clicked panel was not already open, open it
    if (!isPanelOpen) {
      this.accordionPanels[index].style.maxHeight = this.accordionPanels[index].scrollHeight + "px";
    }
  }

  // ---------- Handling the tasks ----------
  createTask(task) {
    this.tasks.push(task);
    this.handleButton();
  }

  removeTask(taskKey) {
    this.tasks = this.tasks.filter((task) => task.key !== taskKey);
    this.handleButton();

  }

  onStatusUpdate(taskKey, status) {
    this.handleButton();
    console.log("Task", taskKey, "/ Status:", status.label);
  }
}
