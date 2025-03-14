import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { constantCase } from 'change-case-all';
import set from 'just-safe-set';
import { parse as jsoncParse } from 'comment-json';
import type { ConventionSchema } from './autogen.mjs';
import { getAllPropertyNames } from './util.mjs';

const SEMANTIC_ATTRIBUTES_DIR = path.join('src', 'semanticConventions');
const FILE_HEADER_MARK = `/* eslint-disable */
/**
 * This file was automatically generated by @mapcolonies/telemetry npm package.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and release new compiled package to regenerate this file.
 */\n\n`;

const DEPRECATION_JS_DOCSTRING = `* @deprecated Change to new attribute if this one was replaced \n`;
const JS_COMMENT_START = `/**`;
const JS_COMMENT_END = `*/`;
const PACKAGE_INDEX_DIR = path.join('src', 'semanticConventions', 'index.ts');
const ATTRIBUTE_FILE_SUFIX = 'GENERATED_ATTRIBUTES';

// read and filter all relevant static db json files per domain
const dbFiles = readdirSync(SEMANTIC_ATTRIBUTES_DIR).filter((file) => path.extname(file) === '.json');
console.log(`Detect ${dbFiles.length} domains db files: ${dbFiles.join(',')}`);

writeFileSync(PACKAGE_INDEX_DIR, '', { flag: 'w' }); // override and create new TS file
// Iterate each domain file in directory
for (const file of dbFiles) {
  const data = readFileSync(path.join(SEMANTIC_ATTRIBUTES_DIR, file), { encoding: 'utf-8' });
  const dataJson = jsoncParse(data) as unknown as ConventionSchema;
  const attributesArr = getAllPropertyNames(dataJson);
  const domainDescription = dataJson.content.description;
  const isDomainDeprecated = dataJson.content.deprecated;
  generateTsFile(attributesArr, dataJson.domain.toUpperCase(), domainDescription, isDomainDeprecated);
}

console.log(`Complete generating TS modules and updated index.ts exporting in `);

/**
 * This method parse and write all domain's attributes to TS generated file as flat constants and canonical object
 * @param domainAttribute Array of all related names under current domain
 * @param domain Array - name of the domain
 * @param domainDescription Explain the responsibility of the domain
 * @param isDomainDeprecated Flag indicate deprecation about the domain
 */
function generateTsFile(
  domainAttribute: ReturnType<typeof getAllPropertyNames>,
  domain: string,
  domainDescription: string,
  isDomainDeprecated: boolean | undefined
): void {
  writeFileSync(path.join(SEMANTIC_ATTRIBUTES_DIR, `${domain}_${ATTRIBUTE_FILE_SUFIX}.ts`), FILE_HEADER_MARK);
  const fullDomainObj = {};

  for (const attribute of domainAttribute) {
    const valueStr = attribute.propertyName;
    const keyStr = constantCase(attribute.keyName);

    let attributeStr = `export const ${keyStr} = '${valueStr}'\n`;
    const isDeprecatedStr = attribute.deprecated !== undefined && attribute.deprecated ? 'true' : 'false';
    set(fullDomainObj, attribute.keyName, [valueStr, attribute.description, isDeprecatedStr].join('@'));
    const docStr = buildDocString(attribute.description, attribute.deprecated);
    attributeStr = `${docStr}\n${attributeStr}\n`;
    writeFileSync(path.join(SEMANTIC_ATTRIBUTES_DIR, `${domain}_${ATTRIBUTE_FILE_SUFIX}.ts`), attributeStr, { flag: 'a+' });
  }

  addToIndexFile(`${domain}_${ATTRIBUTE_FILE_SUFIX}`);
  const mainDocStr = buildDocString(domainDescription, isDomainDeprecated);

  const objectWithDocs = generateDomainConventionObject(fullDomainObj);
  const domainObjStr = `export const ${domain}_CONVENTIONS = ${objectWithDocs} as const\n`;
  const fullDomainObjectSection = `${mainDocStr}\n${domainObjStr}`;
  writeFileSync(path.join(SEMANTIC_ATTRIBUTES_DIR, `${domain}_${ATTRIBUTE_FILE_SUFIX}.ts`), fullDomainObjectSection, { flag: 'a+' });
}

/**
 * This function generate docstring per attribute
 * @param description attribute's description to be documented
 * @param deprecated boolean flag that indicated if the attribute should be written with deprecation notation
 * @returns String - docstring for the attribute
 */
function buildDocString(description: string, deprecated: boolean | undefined): string {
  const deprecatedStr = deprecated !== undefined && deprecated ? `${DEPRECATION_JS_DOCSTRING}\n` : '';
  const docStr = `${JS_COMMENT_START}\n* ${description}\n${'* @constant'}\n${deprecatedStr}${JS_COMMENT_END}`;
  return docStr;
}

/**
 * Add export declaration to new TS file in index.ts of the subdirectory
 * @param fileDir
 */
function addToIndexFile(fileDir: string): void {
  const exportStr = `export * from './${fileDir}'\n`;
  writeFileSync(PACKAGE_INDEX_DIR, exportStr, { flag: 'a+' });
}

/**
 * Extend domain object with related docs for each property
 * @param objectWithoutDocs properties included extended property name with description & deprecation notation
 * @returns original object with docstring on each propertyName
 */
function generateDomainConventionObject(objectWithoutDocs: unknown): string {
  const OBJECT_PADDING_FACTOR = 2;
  const objectArrayTmp = JSON.stringify(objectWithoutDocs, undefined, OBJECT_PADDING_FACTOR).split('\n');

  for (const line of objectArrayTmp) {
    if (line.includes('@')) {
      const [keyValueLine, description, deprecated] = line.split('@');
      const isDeprecated = (deprecated as string).toLowerCase().includes('true');
      const docStr = buildDocString(description as string, isDeprecated);
      const currentIdx = objectArrayTmp.indexOf(line);
      objectArrayTmp[currentIdx] = `${keyValueLine}",`; // place the propertyName to current index
      objectArrayTmp.splice(currentIdx, 0, docStr); // add docs to related propertyName
    }
  }
  const mergedObj = objectArrayTmp.join('\n');
  return mergedObj;
}
