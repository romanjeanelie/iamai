export default class TaskAccordion {
  constructor({ container }) {
    this.container = container;

    // States
    this.panels = [];
    this.activePanel = null;

    // DOM Elements

    // Init Methods
    this.addListeners();
  }

  addNewPanel(title, svgContent) {
    const panelContainer = document.createElement("div");
    panelContainer.className = "task-accordion__container active";

    // Insert the panel Header
    const header = document.createElement("div");
    header.classList.add("task-accordion__header");

    const label = document.createElement("div");
    label.classList.add("task-accordion__header-label");
    label.innerHTML = `
      ${svgContent}
      <h3 class="task-accordion__header-title">${title}</h3>
    `;

    const chevron = document.createElement("button");
    chevron.classList.add("task-accordion__header-chevron");
    chevron.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
        <path d="M11 1L6 6L1 0.999999" stroke="#676E7F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    chevron.addEventListener("click", () => {
      this.togglePanel(panelContainer);
    });

    header.appendChild(label);
    header.appendChild(chevron);

    const content = document.createElement("div");
    content.classList.add("task-accordion__content");

    panelContainer.appendChild(header);
    panelContainer.appendChild(content);

    this.panels.push(panelContainer);
    this.container.appendChild(panelContainer);

    this.activePanel = panelContainer;

    return content;
  }

  togglePanel(panelContainer) {
    const panelContent = panelContainer.querySelector(".task-accordion__content");

    if (panelContainer.classList.contains("active")) {
      // Close the panel
      panelContent.style.maxHeight = 0;
    } else {
      // Open the panel
      panelContent.style.maxHeight = panelContent.scrollHeight + "px";

      // Close any previously opened panel
      if (this.activePanel && this.activePanel !== panelContainer) {
        const activeContent = this.activePanel.querySelector(".task-accordion__content");
        activeContent.style.maxHeight = 0;
        const activeChevron = this.activePanel.querySelector(".task-accordion__header-chevron");
        activeChevron.classList.remove("open");
        this.activePanel.classList.remove("active");
      }
    }

    // Toggle the active state
    panelContainer.classList.toggle("active");
    this.activePanel = panelContainer.classList.contains("active") ? panelContainer : null;
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
