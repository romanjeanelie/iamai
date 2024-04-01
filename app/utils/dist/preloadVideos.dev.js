"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preloadVideos = void 0;

// Fonction pour charger une vidéo en tant qu'objet Blob
var loadVideoBlobAsync = function loadVideoBlobAsync(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    xhr.onload = function () {
      if (xhr.status === 200) {
        var videoBlob = new Blob([xhr.response], {
          type: "video/mp4"
        }); // Stocker la vidéo dans un objet global (window)

        window.preloadedVideos = window.preloadedVideos || {};
        window.preloadedVideos[url] = videoBlob;
        resolve({
          status: "fulfilled",
          value: videoBlob
        });
      } else {
        reject({
          status: "rejected",
          reason: "Failed to load video: ".concat(url)
        });
      }
    };

    xhr.onerror = function () {
      reject({
        status: "rejected",
        reason: "Failed to load video: ".concat(url)
      });
    };

    xhr.send();
  });
}; // Options pour la fonction de préchargement des vidéos


var preloadVideos = function preloadVideos(urls, options) {
  var onComplete, results, successfulVideos;
  return regeneratorRuntime.async(function preloadVideos$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          onComplete = options.onComplete;
          console.log("preloading...");
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(Promise.allSettled(urls.map(function (url) {
            return loadVideoBlobAsync(url);
          })));

        case 5:
          results = _context.sent;
          successfulVideos = results.filter(function (result) {
            return result.status === "fulfilled";
          }).map(function (result) {
            return result.value;
          });
          console.log("All videos preloaded", successfulVideos);

          if (onComplete && typeof onComplete === "function") {
            onComplete();
          }

          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](2);
          console.error("Error during preloading videos", _context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 11]]);
};

exports.preloadVideos = preloadVideos;