import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
import mkcert from "vite-plugin-mkcert";

export default {
  server: { https: true }, // Not needed for Vite 5+
  plugins: [
    mkcert(),
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
      helpers: {
        isBlue: (labelPage) => labelPage === "blue",
      },
    }),
  ],
  build: {
    minify: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        main: resolve(__dirname, "main.html"),
        call: resolve(__dirname, "call/index.html"),
        // login: resolve(__dirname, "login/index.html"),
        login_google: resolve(__dirname, "login/login_google.html"),
        assistant: resolve(__dirname, "assistant/assistant.html"),
      },
      output: {
        preserveModules: false,
      },
      preserveEntrySignatures: "strict",
    },
  },
};
