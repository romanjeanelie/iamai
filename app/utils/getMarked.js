import { marked } from 'marked';
import hljs from 'highlight.js';

export default function getMarked(options = {}) {
  // Set options
  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (__) {}
      }

      try {
        return hljs.highlightAuto(code).value;
      } catch (__) {}

      return ''; // use external default escaping
    },
    langPrefix: 'hljs language-', // add language prefix to class
    pedantic: false,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: false
  });

  return marked;
}