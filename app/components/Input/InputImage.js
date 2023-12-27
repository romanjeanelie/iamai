const uplaodfiles = (imageData) =>
  new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ai.iamplus.services/files/uploadimage", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      if (xhr.status === 200) {
        // alert('Files uploaded successfully');
        console.log(this.responseText);
        resolve(this.responseText);
      } else {
        // alert('An error occurred!');
        reject("An error occurred!");
      }
    };
    console.log("imageData", imageData);
    xhr.send(JSON.stringify({ image: imageData }));
  });

export default class InputImage {
  constructor(anims, callbacks, pageEl, emitter) {
    this.emitter = emitter;
    // DOM
    this.pageEl = pageEl;
    this.imageDroppedContainer = this.pageEl.querySelector(".image-dropped__container");
    this.dropImageOverlayEl = this.pageEl.querySelector(".image-drop-zone--overlay");

    this.inputFileUploadEl = this.pageEl.querySelector(".input__file-upload");
    this.inputImageEl = this.pageEl.querySelector(".input__image");
    this.closeBtn = this.pageEl.querySelector(".input__image--closeBtn");

    this.anims = anims;
    this.callbacks = callbacks;

    //TEMP
    this.analizingImageMinTime = 1000; //ms

    this.isEnabled = false;
    this.imgs = [];
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
    this.imageDroppedContainer.classList.remove("visible");
    this.emitter.emit("slider:close");
    this.isEnabled = false;
  }

  async onDrop(img) {
    this.anims.toImageDroped();

    console.log("TODO: add end point to send the image file to the server", img);
    // this.uploadFile(img)
    const imgUploaded = await uplaodfiles(img.src);
    console.log("imgUploaded", imgUploaded);

    setTimeout(() => {
      // TODO Call this function when image is analyzed
      this.previewImage(img);
    }, this.analizingImageMinTime);
  }

  //   addImageToContainer(img) {
  //     this.imageDroppedContainer.appendChild(img);
  //     this.callbacks.onImageUploaded(img);
  //   }

  addImageToSlider(img) {
    if (this.imgs.length === 0) {
      this.emitter.emit("slider:open", { imgs: [img], currentIndex: 0, allPage: false });
    } else {
      this.emitter.emit("slider:addImg", img);
      this.emitter.emit("slider:goTo", { index: this.imgs.length + 1 });
    }
    this.imgs.push(img);
    this.callbacks.onImageUploaded(img);
  }

  previewImage(file) {
    let imageType = /image.*/;
    if (file.type.match(imageType)) {
      this.anims.toImageAnalyzed();
      let fReader = new FileReader();

      fReader.readAsDataURL(file);
      fReader.onloadend = (event) => {
        let img = new Image();
        img.onload = () => {
          this.addImageToSlider(img);
        };
        img.src = event.target.result;
      };
    } else {
      this.anims.reset();
      console.error("Only images are allowed!", file);
    }
  }

  fetchImage({ url }) {
    this.anims.toImageDroped();

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      this.anims.toImageAnalyzed();

      setTimeout(() => {
        this.addImageToContainer(image);
      }, this.analizingImageMinTime);
    };

    image.onerror = () => {
      this.anims.reset(500);
    };
    image.src = url;
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

    this.inputImageEl.addEventListener("keydown", (e) => {
      // If key === enter
      if (e.keyCode == 13) {
        this.fetchImage({ url: this.inputImageEl.value });
      }
    });
  }
}
