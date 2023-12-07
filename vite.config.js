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
    minify: false,
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      preserveEntrySignatures: "strict",
    },
  },
};
