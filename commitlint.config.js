module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", ["deps", "configurations", "tracing", "metrics", "conventions","conventions-scripts"]],
  },
};
