export default class TaskAccordion {
  constructor({ container }) {
    this.container = container;

    // States
    this.panels = [];
    this.activePanel = null;

    // Init Methods
    this.addListeners();
  }

  addNewPanel(title, imgSrc) {
    const panelContainer = document.createElement("div");
    panelContainer.setAttribute("data-title", title);
    panelContainer.className = "task-accordion__container";

    // Insert the panel Header
    const header = document.createElement("div");
    header.classList.add("task-accordion__header");

    const label = document.createElement("div");
    label.classList.add("task-accordion__header-label");
    label.innerHTML = `
      <div class = "task-accordion__header-icon">
        <img src="${imgSrc}" alt="header-icon" />
      </div>
      <h3 class="task-accordion__header-title">${title}</h3>
    `;

    const chevron = document.createElement("button");
    chevron.className = "task-accordion__header-chevron hidden";
    chevron.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
        <path d="M11 1L6 6L1 0.999999" stroke="#676E7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    chevron.addEventListener("click", () => {
      this.togglePanel(title);
    });

    header.appendChild(label);
    header.appendChild(chevron);

    const content = document.createElement("div");
    content.classList.add("task-accordion__content");

    panelContainer.appendChild(header);
    panelContainer.appendChild(content);

    this.panels.push(panelContainer);
    this.container.appendChild(panelContainer);

    return content;
  }

  togglePanel(panelTitle) {
    const panelContainer = this.panels.find((panel) => panel.getAttribute("data-title") === panelTitle);
    this.activePanel = !panelContainer.classList.contains("active") ? panelContainer : null;
    const panelContent = panelContainer.querySelector(".task-accordion__content");

    if (!this.activePanel) {
      // Close the panel
      panelContent.style.maxHeight = 0;
    } else {
      // Close any previously opened panel
      this.panels.forEach((panel) => {
        const content = panel.querySelector(".task-accordion__content");
        content.style.maxHeight = 0;
        const chevron = panel.querySelector(".task-accordion__header-chevron");
        chevron.classList.remove("open");
        panel.classList.remove("active");
      });

      // Open the panel
      panelContent.style.maxHeight = panelContent.scrollHeight + "px";
    }

    // Toggle the active state
    panelContainer.classList.toggle("active");
  }

  displayChevrons() {
    this.panels.forEach((panel) => {
      const chevron = panel.querySelector(".task-accordion__header-chevron");
      chevron.classList.remove("hidden");
    });
  }

  // Method to update panel height dynamically if content changes
  updatePanelHeight() {
    if (!this.activePanel) return;
    const panelContent = this.activePanel.querySelector(".task-accordion__content");
    panelContent.style.maxHeight = panelContent.scrollHeight + "px";
  }

  addListeners() {
    window.addEventListener("resize", this.updatePanelHeight.bind(this));
  }
}
