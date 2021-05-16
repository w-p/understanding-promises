module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/style/style.scss";`,
      },
    },
  },
};
