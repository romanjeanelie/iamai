export default function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = (error) => reject(error);
    img.src = src;
  });
}
