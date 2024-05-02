import { Remarkable } from "remarkable";
import hljs from 'highlight.js';

export default function getRemarkable(options = {}) {
  const md = new Remarkable({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {}
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (__) {}

        return ''; // use external default escaping
    }
});


  md.set({
    html: true,
    breaks: true,
    code: true,
    // typographer: false,
  });

  return md;
}
