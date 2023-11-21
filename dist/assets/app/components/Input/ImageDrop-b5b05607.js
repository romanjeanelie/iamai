class ImageDrop {
  constructor(anims) {
    this.dropImageEl = document.querySelector(".image-drop-zone");
    this.dropImageOverlayEl = document.querySelector(".image-drop-zone--overlay");
    this.anims = anims;
    this.analizingImageTime = 2e3;
  }
  filesManager(files) {
    files = [...files];
    console.log("TODO: add end point to send the image file to the server", files[0]);
    files.forEach((file) => this.previewFile(file));
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
  onDrop(e) {
    let dataTrans = e.dataTransfer;
    let files = dataTrans.files;
    this.anims.onDroped();
    this.timeoutTranscripting = setTimeout(() => {
      this.anims.onImageAnalyzed();
      this.filesManager(files);
    }, this.analizingImageTime);
  }
  addListeners() {
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
    this.dropImageEl.addEventListener("drop", this.onDrop.bind(this), false);
  }
  previewFile(file) {
    let imageType = /image.*/;
    if (file.type.match(imageType)) {
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
      console.error("Only images are allowed!", file);
    }
  }
}
export {
  ImageDrop as default
};
