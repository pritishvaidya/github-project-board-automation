export default {
  files: ["tests/**/*.js"],
  babel: true,
  extensions: {
    ts: "module",
  },
  nonSemVerExperiments: {
    configurableModuleFormat: true,
  },
  nodeArguments: ["--loader=ts-node/esm"],
};
