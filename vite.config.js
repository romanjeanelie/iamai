import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";

export default {
  plugins: [
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
