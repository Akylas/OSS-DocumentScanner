const sveltePreprocess = require("svelte-preprocess");

const createSveltePreprocessor = () => {
  return sveltePreprocess({
    tsconfigFile: "./tsconfig.json",
    sourceMap: false,
  });
};

module.exports = {
  preprocess: createSveltePreprocessor(),
  createSveltePreprocessor,
};
