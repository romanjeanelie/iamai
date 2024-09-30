"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getDomainAndFavicon;

function getDomainAndFavicon(url) {
  // Ensure the URL has a protocol
  if (!/^https?:\/\//i.test(url)) {
    url = "https://".concat(url);
  }

  var urlObj = new URL(url);
  var domain = urlObj.hostname;
  var favicon = "https://".concat(domain, "/favicon.ico");
  return {
    domain: domain,
    favicon: favicon
  };
}