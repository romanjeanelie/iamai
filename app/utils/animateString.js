const animateString = (
  index,
  textArray,
  element,
  imgSrc = "",
  callback,
  delay = 150,
  deletedelay = 50,
  fulltextdelay = 1000
) => {
  if (!element) return; // Element not found

  let str = textArray[index++];
  let i = 0;
  let isAdding = true;

  function createImageElement() {
    const img = document.createElement("img");
    img.src = imgSrc;
    return img;
  }

  function updateText() {
    if (isAdding) {
      element.textContent += str[i++];
      if (i === str.length) {
        isAdding = false;
        if (imgSrc && imgSrc.length > 0) {
          setTimeout(delay);
          const img = createImageElement();
          img.alt = str[i];
          element.appendChild(img);
        }
        // else {
        setTimeout(updateText, fulltextdelay);
        // }
      } else {
        setTimeout(updateText, delay);
      }
    } else {
      element.textContent = element.textContent.slice(0, -1);
      if (element.textContent.length > 0) {
        setTimeout(updateText, deletedelay);
      } else if (callback) {
        callback(textArray, index, element, imgSrc);
      }
    }
  }
  updateText();
};

export default animateString;
