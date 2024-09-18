// vite.config.js
import handlebars from "file:///Users/lapiscine/Developer/iamai-gitkraken/node_modules/vite-plugin-handlebars/dist/index.js";
import { resolve } from "path";
import mkcert from "file:///Users/lapiscine/Developer/iamai-gitkraken/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
var __vite_injected_original_dirname = "/Users/lapiscine/Developer/iamai-gitkraken";
var vite_config_default = {
  server: { https: true },
  // Not needed for Vite 5+
  plugins: [
    mkcert(),
    handlebars({
      partialDirectory: resolve(__vite_injected_original_dirname, "partials"),
      helpers: {
        isBlue: (labelPage) => labelPage === "blue"
      }
    })
  ],
  build: {
    minify: true,
    rollupOptions: {
      input: {
        index: resolve(__vite_injected_original_dirname, "index.html"),
        call: resolve(__vite_injected_original_dirname, "call/index.html"),
        // login: resolve(__dirname, "login/index.html"),
        login_google: resolve(__vite_injected_original_dirname, "login/login_google.html"),
        assistant: resolve(__vite_injected_original_dirname, "assistant/assistant.html"),
        blog: resolve(__vite_injected_original_dirname, "blog/index.html"),
        lang: resolve(__vite_injected_original_dirname, "lang/index.html"),
        languages: resolve(__vite_injected_original_dirname, "languages.html"),
        accor: resolve(__vite_injected_original_dirname, "accor.html"),
        external: resolve(__vite_injected_original_dirname, "external.html"),
        callservice: resolve(__vite_injected_original_dirname, "phone-call.html")
      },
      output: {
        preserveModules: false
      },
      preserveEntrySignatures: "strict"
    }
  }
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGFwaXNjaW5lL0RldmVsb3Blci9pYW1haS1naXRrcmFrZW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9sYXBpc2NpbmUvRGV2ZWxvcGVyL2lhbWFpLWdpdGtyYWtlbi92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbGFwaXNjaW5lL0RldmVsb3Blci9pYW1haS1naXRrcmFrZW4vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgaGFuZGxlYmFycyBmcm9tIFwidml0ZS1wbHVnaW4taGFuZGxlYmFyc1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgbWtjZXJ0IGZyb20gXCJ2aXRlLXBsdWdpbi1ta2NlcnRcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzZXJ2ZXI6IHsgaHR0cHM6IHRydWUgfSwgLy8gTm90IG5lZWRlZCBmb3IgVml0ZSA1K1xuICBwbHVnaW5zOiBbXG4gICAgbWtjZXJ0KCksXG4gICAgaGFuZGxlYmFycyh7XG4gICAgICBwYXJ0aWFsRGlyZWN0b3J5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJwYXJ0aWFsc1wiKSxcbiAgICAgIGhlbHBlcnM6IHtcbiAgICAgICAgaXNCbHVlOiAobGFiZWxQYWdlKSA9PiBsYWJlbFBhZ2UgPT09IFwiYmx1ZVwiLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBtaW5pZnk6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgaW5kZXg6IHJlc29sdmUoX19kaXJuYW1lLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIGNhbGw6IHJlc29sdmUoX19kaXJuYW1lLCBcImNhbGwvaW5kZXguaHRtbFwiKSxcbiAgICAgICAgLy8gbG9naW46IHJlc29sdmUoX19kaXJuYW1lLCBcImxvZ2luL2luZGV4Lmh0bWxcIiksXG4gICAgICAgIGxvZ2luX2dvb2dsZTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwibG9naW4vbG9naW5fZ29vZ2xlLmh0bWxcIiksXG4gICAgICAgIGFzc2lzdGFudDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiYXNzaXN0YW50L2Fzc2lzdGFudC5odG1sXCIpLFxuICAgICAgICBibG9nOiByZXNvbHZlKF9fZGlybmFtZSwgXCJibG9nL2luZGV4Lmh0bWxcIiksXG4gICAgICAgIGxhbmc6IHJlc29sdmUoX19kaXJuYW1lLCBcImxhbmcvaW5kZXguaHRtbFwiKSxcbiAgICAgICAgbGFuZ3VhZ2VzOiByZXNvbHZlKF9fZGlybmFtZSwgXCJsYW5ndWFnZXMuaHRtbFwiKSxcbiAgICAgICAgYWNjb3I6IHJlc29sdmUoX19kaXJuYW1lLCBcImFjY29yLmh0bWxcIiksXG4gICAgICAgIGV4dGVybmFsOiByZXNvbHZlKF9fZGlybmFtZSwgXCJleHRlcm5hbC5odG1sXCIpLFxuICAgICAgICBjYWxsc2VydmljZTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwicGhvbmUtY2FsbC5odG1sXCIpLFxuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBwcmVzZXJ2ZU1vZHVsZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIHByZXNlcnZlRW50cnlTaWduYXR1cmVzOiBcInN0cmljdFwiLFxuICAgIH0sXG4gIH0sXG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVCxPQUFPLGdCQUFnQjtBQUN2VSxTQUFTLGVBQWU7QUFDeEIsT0FBTyxZQUFZO0FBRm5CLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVE7QUFBQSxFQUNiLFFBQVEsRUFBRSxPQUFPLEtBQUs7QUFBQTtBQUFBLEVBQ3RCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxJQUNQLFdBQVc7QUFBQSxNQUNULGtCQUFrQixRQUFRLGtDQUFXLFVBQVU7QUFBQSxNQUMvQyxTQUFTO0FBQUEsUUFDUCxRQUFRLENBQUMsY0FBYyxjQUFjO0FBQUEsTUFDdkM7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxPQUFPLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQ3RDLE1BQU0sUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQTtBQUFBLFFBRTFDLGNBQWMsUUFBUSxrQ0FBVyx5QkFBeUI7QUFBQSxRQUMxRCxXQUFXLFFBQVEsa0NBQVcsMEJBQTBCO0FBQUEsUUFDeEQsTUFBTSxRQUFRLGtDQUFXLGlCQUFpQjtBQUFBLFFBQzFDLE1BQU0sUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQSxRQUMxQyxXQUFXLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsUUFDOUMsT0FBTyxRQUFRLGtDQUFXLFlBQVk7QUFBQSxRQUN0QyxVQUFVLFFBQVEsa0NBQVcsZUFBZTtBQUFBLFFBQzVDLGFBQWEsUUFBUSxrQ0FBVyxpQkFBaUI7QUFBQSxNQUNuRDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04saUJBQWlCO0FBQUEsTUFDbkI7QUFBQSxNQUNBLHlCQUF5QjtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
