import loadImage from "./loadImage";

export default async function loadImages(srcs) {
  const successfulSrcs = [];
  const errors = [];

  await Promise.all(
    srcs.map((src) =>
      loadImage(src)
        .then(() => successfulSrcs.push(src))
        .catch((error) => {
          errors.push({ src, error });
          console.log("Error loading image:", error);
        })
    )
  );
  return successfulSrcs;
}
