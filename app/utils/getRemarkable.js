import { Remarkable } from "remarkable";
import hljs from 'highlight.js';
import { linkify } from 'remarkable/linkify';

export default function getRemarkable(options = {}) {

  const md = new Remarkable({
    html: true,        // Enable HTML tags in source
    xhtmlOut: false,
    breaks: true,      // Convert '\n' in paragraphs into <br>
    typographer: true,
    quotes: '“”‘’',
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
  md.use(linkify)

  md.set({
    html: true,
    breaks: true,
    code: true,
    // typographer: false,
  });

  return md;
}
