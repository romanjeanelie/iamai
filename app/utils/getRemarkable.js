import { Remarkable } from "remarkable";
import hljs from 'highlight.js';

export default function getRemarkable(options = {}) {

  // const md = new Remarkable({
  //   html: true,        // Enable HTML tags in source
  //   xhtmlOut: false,   // Use '/' to close single tags (<br />)
  //   breaks: true,      // Convert '\n' in paragraphs into <br>
  //   langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
  //                            // useful for external highlighters.
  //   linkify: true,     // Autoconvert URL-like text to links
  //   typographer: true, // Enable some language-neutral replacements + quotes beautification
  //   quotes: '“”‘’'    // Double and single quotes replacement pairs, when typographer enabled,
  //                     // and smartquotes on. Could be either a String or an Array.
  // });
  const md = new Remarkable({
    html: true,        // Enable HTML tags in source
    xhtmlOut: false,
    linkify: true,
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


  md.set({
    html: true,
    breaks: true,
    code: true,
    // typographer: false,
  });

  return md;
}
