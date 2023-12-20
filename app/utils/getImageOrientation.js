export default function getImageOrientation(img) {
  if (img.naturalWidth > img.naturalHeight) {
    return "landscape";
  } else if (img.naturalHeight > img.naturalWidth) {
    return "portrait";
  } else {
    return "square";
  }
}
