const createImageFile = (url) => {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      return dataTransfer.files;
    })
    .catch((e) => {
      console.error("An error occurred!", e);
    });
};
export default createImageFile;
