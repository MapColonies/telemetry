/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['src/index.ts', 'src/semanticConventions/index.ts', 'src/metrics/middleware/metrics.ts'],
  out: 'docs',
  excludeInternal: true,
  includeVersion: true,
  categorizeByGroup: true,
  navigation: {
    includeGroups: true,
  },
};
