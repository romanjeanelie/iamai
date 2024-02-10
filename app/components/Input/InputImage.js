import createImageFile from "../../utils/createImageFile";
import uploadFiles from "../../utils/uploadFiles";
export default class InputImage {
  constructor(anims, callbacks, pageEl, emitter) {
    this.emitter = emitter;
    // DOM
    this.pageEl = pageEl;
    this.imageDroppedContainer = this.pageEl.querySelector(".image-dropped__container");
    this.dropImageOverlayEl = this.pageEl.querySelector(".image-drop-zone--overlay");

    this.inputFileUploadEl = this.pageEl.querySelector(".input__file-upload");
    this.inputImageEl = this.pageEl.querySelector(".input__image");
    this.closeBtnSlider = document.querySelector(".slider__close");

    this.anims = anims;
    this.callbacks = callbacks;

    //TEMP
    this.analizingImageMinTime = 1000; //ms
    this.isEnabled = false;
    this.imgs = [];
    this.addListeners();
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.callbacks.onImageCancel();
    this.inputFileUploadEl.value = "";
    this.imageDroppedContainer.innerHTML = "";
    this.imageDroppedContainer.classList.remove("visible");
    this.emitter.emit("slider:close");
    this.isEnabled = false;
    this.imgs = [];
  }

  async onDrop(imgFile) {
    this.anims.toImageDroped();
    const imgsUploaded = await uploadFiles(imgFile);
    imgsUploaded.forEach((img) => {
      this.previewImage(img);
    });
  }

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

  previewImage(src) {
    this.anims.toImageAnalyzed();

    let img = new Image();
    img.onload = () => {
      this.addImageToSlider(img);
    };
    img.src = src;
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
      this.onDrop(files);
    });

    this.inputFileUploadEl.addEventListener("change", (e) => {
      if (this.inputFileUploadEl.files && this.inputFileUploadEl.files[0]) {
        this.onDrop(this.inputFileUploadEl.files);
      }
    });

    this.inputImageEl.addEventListener("keydown", async (e) => {
      // If key === enter
      if (e.keyCode == 13) {
        const url = this.inputImageEl.value;
        const imgFile = await createImageFile(url);
        this.onDrop(imgFile);
      }
    });

    this.closeBtnSlider.addEventListener("click", (e) => {
      if (!this.isEnabled) return;
      this.disable();
    });
  }
}
