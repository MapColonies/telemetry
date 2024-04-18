/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['./src/index.ts', './src/semanticConventions/index.ts'],
  out: 'docs',
  includeVersion: true,
};
