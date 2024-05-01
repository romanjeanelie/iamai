import { Remarkable } from "remarkable";

export default function getRemarkable(options = {}) {
  const md = new Remarkable();
  md.set({
    html: true,
    breaks: true,
    // typographer: false,
  });

  return md;
}
