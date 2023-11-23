class InputImage {
  constructor(anims) {
    this.dropImageEl = document.querySelector(".image-drop-zone");
    this.dropImageOverlayEl = document.querySelector(".image-drop-zone--overlay");
    this.inputFileUploadEl = document.querySelector("#file-upload");
    this.closeBtn = document.querySelector(".input__image--closeBtn");
    this.anims = anims;
    this.analizingImageTime = 2e3;
    this.addListeners();
  }
  // TODO : send the file to the server
  uploadFile(file) {
    let imageType = /image.*/;
    if (file.type.match(imageType)) {
      let url = "HTTP/HTTPS URL TO SEND THE DATA TO";
      let formData = new FormData();
      formData.append("file", file);
      fetch(url, {
        method: "put",
        body: formData
      }).then((response) => response.json()).then((result) => {
        console.log("Success:", result);
      }).catch((error) => {
        console.error("Error:", error);
      });
    } else {
      console.error("Only images are allowed!", file);
    }
  }
  enable() {
    this.dropImageEl.style.pointerEvents = "auto";
  }
  disable() {
    this.dropImageEl.style.pointerEvents = "none";
  }
  onDrop(img) {
    this.anims.onDroped();
    console.log("TODO: add end point to send the image file to the server", img);
    this.timeoutTranscripting = setTimeout(() => {
      this.previewImage(img);
    }, this.analizingImageTime);
  }
  previewImage(file) {
    let imageType = /image.*/;
    if (file.type.match(imageType)) {
      this.anims.onImageAnalyzed();
      let fReader = new FileReader();
      fReader.readAsDataURL(file);
      fReader.onloadend = () => {
        let img = document.createElement("img");
        img.src = fReader.result;
        file.size / 1e3 + " KB";
        this.dropImageEl.appendChild(img);
        this.dropImageEl.classList.add("visible");
      };
    } else {
      this.anims.reset();
      console.error("Only images are allowed!", file);
    }
  }
  addListeners() {
    console.log("listener");
    ["dragenter", "dragover", "dragleave", "drop"].forEach((e) => {
      this.dropImageEl.addEventListener(e, prevDefault, false);
    });
    function prevDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    ["dragenter", "dragover"].forEach((e) => {
      this.dropImageEl.addEventListener(e, () => {
        this.dropImageOverlayEl.classList.add("hovered");
      });
    });
    ["dragleave", "drop"].forEach((e) => {
      this.dropImageEl.addEventListener(e, () => {
        this.dropImageOverlayEl.classList.remove("hovered");
      });
    });
    this.dropImageEl.addEventListener(
      "drop",
      (e) => {
        let dataTrans = e.dataTransfer;
        let files = dataTrans.files;
        const img = files[0];
        this.onDrop(img);
      },
      false
    );
    this.inputFileUploadEl.addEventListener("change", (e) => {
      console.log("oui");
      if (this.inputFileUploadEl.files && this.inputFileUploadEl.files[0]) {
        const img = this.inputFileUploadEl.files[0];
        this.onDrop(img);
      }
    });
  }
}
export {
  InputImage as default
};
