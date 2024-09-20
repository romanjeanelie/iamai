import { NotificationPillAnimations } from "./NotificationPillAnimations";

export class NotificationPill {
  constructor(taskKey, status, duration = 1500000) {
    this.taskKey = taskKey;
    this.status = status;
    this.duration = duration;
    this.notificationTimeoutId = null;
    this.notificationContainer = null;

    this.anims = new NotificationPillAnimations();

    this.initNotificationPill();
  }

  initNotificationPill() {
    if (this.notificationContainer) this.disposeNotificationPill();

    this.notificationContainer = document.createElement("div");
    this.notificationContainer.classList.add("task-manager__notification-container", "hidden");
    this.notificationContainer.style.backgroundColor = STATUS_COLORS[this.status.type];

    const notificationLabel = document.createElement("div");
    notificationLabel.classList.add("task-manager__notification-label");

    const notificationLabelP = document.createElement("p");
    notificationLabelP.textContent = this.status.label || this.status.type;
    const notificationCloseBtn = document.createElement("button");
    notificationCloseBtn.classList.add("task-manager__notification-closeBtn");
    notificationCloseBtn.innerHTML = `
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.800781" y="1.47949" width="0.96" height="10.56" rx="0.48" transform="rotate(-45 0.800781 1.47949)" fill="white"/>
        <rect x="0.799805" y="8.26758" width="10.56" height="0.96" rx="0.48" transform="rotate(-45 0.799805 8.26758)" fill="white"/>
      </svg>
    `;
    notificationLabel.appendChild(notificationLabelP);
    this.notificationContainer.appendChild(notificationLabel);
    this.notificationContainer.appendChild(notificationCloseBtn);

    document.body.appendChild(this.notificationContainer);

    this.notificationContainer.addEventListener("click", () => this.handleClickOnNotificationPill());
    notificationCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeNotificationPill();
    });

    this.expandNotificationPill();
  }

  expandNotificationPill() {
    const label = this.notificationContainer.querySelector(".task-manager__notification-label");
    const closeBtn = this.notificationContainer.querySelector(".task-manager__notification-closeBtn");
    const svg = closeBtn.querySelector("svg");

    gsap.to(this.notificationContainer, {
      opacity: 1,
      onComplete: () => {
        const initialState = Flip.getState([this.notificationContainer, label, closeBtn, svg]);
        this.notificationContainer.classList.add("expanded");
        Flip.from(initialState, {
          duration: 0.5,
          ease: "power2.inOut",
          absolute: true,
          onComplete: () => {
            this.notificationContainer.classList.remove("hidden");
            this.notificationTimeoutId = setTimeout(() => {
              this.closeNotificationPill();
              this.notificationTimeoutId = null;
            }, this.duration);
          },
        });
      },
    });
  }

  closeNotificationPill() {
    if (!this.notificationContainer) return;

    const label = this.notificationContainer.querySelector(".task-manager__notification-label");
    const closeBtn = this.notificationContainer.querySelector(".task-manager__notification-closeBtn");
    const svg = closeBtn.querySelector("svg");
    const initialState = Flip.getState([this.notificationContainer, label, closeBtn, svg]);
    this.notificationContainer.classList.remove("expanded");

    Flip.from(initialState, {
      duration: 0.5,
      ease: "power2.inOut",
      absolute: true,
      onComplete: () => {
        gsap.to(this.notificationContainer, {
          opacity: 0,
          onComplete: () => this.disposeNotificationPill(),
        });
      },
    });
  }

  disposeNotificationPill() {
    this.notificationContainer?.remove();
    this.notificationContainer = null;
  }

  handleClickOnNotificationPill() {
    if (this.notificationTimeoutId) {
      clearTimeout(this.notificationTimeoutId);
      this.notificationTimeoutId = null;
    }
  }
}
