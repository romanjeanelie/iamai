export default class InputImage {
  constructor(anims, pageEl) {
    // DOM
    this.pageEl = pageEl;
    this.imageDroppedContainer = this.pageEl.querySelector(".image-dropped__container");
    this.dropImageOverlayEl = this.pageEl.querySelector(".image-drop-zone--overlay");

    this.inputFileUploadEl = this.pageEl.querySelector("#file-upload");
    this.closeBtn = this.pageEl.querySelector(".input__image--closeBtn");

    this.anims = anims;

    //TEMP
    this.analizingImageMinTime = 1000; //ms

    this.isEnabled = false;
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
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.error("Only images are allowed!", file);
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.inputFileUploadEl.value = "";
    this.imageDroppedContainer.innerHTML = "";
    this.isEnabled = false;
  }

  onDrop(img) {
    this.anims.toImageDroped();

    console.log("TODO: add end point to send the image file to the server", img);
    // this.uploadFile(img)

    setTimeout(() => {
      // TODO Call this function when image is analyzed
      this.previewImage(img);
    }, this.analizingImageMinTime);
  }

  previewImage(file) {
    let imageType = /image.*/;
    if (file.type.match(imageType)) {
      this.anims.toImageAnalyzed();
      let fReader = new FileReader();

      fReader.readAsDataURL(file);
      fReader.onloadend = () => {
        let img = document.createElement("img");
        img.src = fReader.result;

        let fSize = file.size / 1000 + " KB";
        this.imageDroppedContainer.appendChild(img);
        this.anims.onImage;
      };
    } else {
      this.anims.reset();

      console.error("Only images are allowed!", file);
    }
  }

  addListeners() {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((e) => {
      this.pageEl.addEventListener(e, prevDefault);
    });
    function prevDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach((e) => {
      this.pageEl.addEventListener(e, () => {
        if (!this.isEnabled) return;
        this.dropImageOverlayEl.classList.add("hovered");
      });
    });

    ["dragleave", "drop"].forEach((e) => {
      this.pageEl.addEventListener(e, () => {
        if (!this.isEnabled) return;
        this.dropImageOverlayEl.classList.remove("hovered");
      });
    });

    this.pageEl.addEventListener("drop", (e) => {
      if (!this.isEnabled) return;
      let dataTrans = e.dataTransfer;
      let files = dataTrans.files;
      const img = files[0];
      this.onDrop(img);
    });

    this.inputFileUploadEl.addEventListener("change", (e) => {
      if (this.inputFileUploadEl.files && this.inputFileUploadEl.files[0]) {
        const img = this.inputFileUploadEl.files[0];
        this.onDrop(img);
      }
    });
  }
}
