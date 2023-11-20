export default {
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
