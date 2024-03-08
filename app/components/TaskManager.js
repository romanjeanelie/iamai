const STATUSES = {
  IN_PROGRESS: "inProgress",
  INPUT_REQUIRED: "inputRequired",
  COMPLETED: "completed",
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

export default class TaskManager {
  constructor({ pageEl, gui, emitter }) {
    // DOM Elements
    this.pageEl = pageEl;
    this.container = this.pageEl.querySelector(".task-manager__container");

    // ALEX -> Comment/uncomment to have tasks at start for integration
    this.tasks = [
      {
        name: "Task 1",
        key: 1,
        status: {
          type: STATUSES.IN_PROGRESS,
          title: "searching",
          description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
        },
      },
      {
        name: "Task 2",
        key: 2,
        status: {
          type: STATUSES.INPUT_REQUIRED,
          title: "question",
          description: "Flight for 18th Mar are all fully booked. Is there any other dates you would like to try for?",
        },
      },
      {
        name: "Task 3",
        key: 3,
        status: {
          type: STATUSES.COMPLETED,
          title: "",
          description: "",
        },
      },
    ];

    // Debug
    this.debugContainer = this.pageEl.querySelector(".task-manager__debug");
    this.debug = import.meta.env.VITE_DEBUG === "true";
    this.gui = gui;

    if (this.debug) {
      const debugTask = {
        name: `Task ${this.tasks.length + 1}`,
        key: this.tasks.length + 1,
      };

      const taskNameController = this.gui.add(debugTask, "name").onChange((value) => {
        debugTask.name = value;
      });

      this.gui.add(
        {
          addTask: (e) => {
            const task = {
              ...debugTask,
              status: { type: STATUSES.IN_PROGRESS, ...defaultValues[STATUSES.IN_PROGRESS] },
            };
            this.addDebugTask(task);
            this.createTask(task);

            debugTask.name = `Task ${this.tasks.length + 1}`;
            debugTask.key = this.tasks.length + 1;
            taskNameController.setValue(debugTask.name);
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
    const copyTask = { ...task };
    const folder = this.gui.addFolder(copyTask.name);
    folder.open();
    folder.add(copyTask.status, "type", STATUSES).onChange((value) => {
      copyTask.status = { type: value, ...defaultValues[value] };
      titleController.setValue(copyTask.status.title);
      descriptionController.setValue(copyTask.status.description);
      this.onStatusUpdate(copyTask.key, copyTask.status);
    });

    const titleController = folder.add(copyTask.status, "title").onChange((value) => {
      copyTask.status.title = value;
    });

    const descriptionController = folder.add(copyTask.status, "description").onChange((value) => {
      copyTask.status.description = value;
    });
    folder.add(
      {
        updateStatus: () => {
          this.onStatusUpdate(copyTask.key, copyTask.status);
        },
      },
      "updateStatus"
    );
  }

  createTask(task) {
    this.tasks.push(task);
    console.log("Task created", task);
  }

  onStatusUpdate(taskKey, status) {
    console.log("Task", taskKey, "/ Status:", status.label);
  }
}
