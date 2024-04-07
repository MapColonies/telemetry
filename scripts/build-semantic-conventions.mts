import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { inspect } from 'node:util';
import { constantCase } from 'change-case-all';
import set from 'just-safe-set';
import { parse as jsoncParse } from 'comment-json';
import type { ConventionSchema } from './autogen.mjs';
import { getAllPropertyNames } from './util.mjs';

const SEMANTIC_ATTRIBUTES_DIR = 'src/semanticConventions';
const FILE_HEADER_MARK = `/* eslint-disable */
/**
 * This file was automatically generated by @mapcolonies/telemetry npm package.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and release new compiled package to regenerate this file.
 */\n\n`;

const DEPRECATION_JS_DOCSTRING = `* @deprecated and should use newer attributes\n`;
const JS_COMMENT_START = `/**`;
const JS_COMMENT_END = `*/`;
const PACKAGE_INDEX_DIR = 'src/semanticConventions/index.ts';
const ATTRIBUTE_FILE_SUFIX = 'GENERATED_ATTRIBUTES';

// read and filter all relevant static db json files per domain
const dbFiles = readdirSync(SEMANTIC_ATTRIBUTES_DIR).filter((file) => file.endsWith('.json'));

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
console.log(`Detect ${dbFiles.length} domains db files: ${dbFiles}`);

writeFileSync(PACKAGE_INDEX_DIR, '', { flag: 'w' });
for (const file of dbFiles) {
  const data = readFileSync(path.join(SEMANTIC_ATTRIBUTES_DIR, file), { encoding: 'utf-8' });
  const dataJson = jsoncParse(data) as unknown as ConventionSchema;
  const attributesArr = getAllPropertyNames(dataJson);
  const domainDescription = dataJson.content.description;
  const isDomainDeprecated = dataJson.content.deprecated;
  generateConstantTsFile(attributesArr, dataJson.domain.toUpperCase(), domainDescription, isDomainDeprecated);
}

function generateConstantTsFile(
  domainAttribute: ReturnType<typeof getAllPropertyNames>,
  domain: string,
  domainDescription: string,
  deprecated: boolean | undefined
): void {
  writeFileSync(path.join(SEMANTIC_ATTRIBUTES_DIR, `${domain}_${ATTRIBUTE_FILE_SUFIX}.ts`), FILE_HEADER_MARK);
  const fullDomainObj = {};

  for (const attribute of domainAttribute) {
    const valueStr = attribute.propertyName;
    const keyStr = constantCase(attribute.keyName);

    let attributeStr = `export const ${keyStr} = '${valueStr}'\n`;
    set(fullDomainObj, attribute.keyName, valueStr);
    const docStr = buildDocString(attribute.description, attribute.deprecated);
    attributeStr = `${docStr}\n${attributeStr}\n`;
    writeFileSync(path.join(SEMANTIC_ATTRIBUTES_DIR, `${domain}_${ATTRIBUTE_FILE_SUFIX}.ts`), attributeStr, { flag: 'a+' });
  }
  addToIndexFile(`${domain}_${ATTRIBUTE_FILE_SUFIX}`);

  const docStr = buildDocString(domainDescription, deprecated);
  const domainObjStr = `export const ${domain}_CONVENTIONS = ${inspect(fullDomainObj)}\n`;
  const full = `${docStr}\n${domainObjStr}`;
  writeFileSync(path.join(SEMANTIC_ATTRIBUTES_DIR, `${domain}_${ATTRIBUTE_FILE_SUFIX}.ts`), full, { flag: 'a+' });
}

function buildDocString(description: string, deprecated: boolean | undefined): string {
  const deprecatedStr = deprecated !== undefined && deprecated ? `${DEPRECATION_JS_DOCSTRING}\n` : '';
  const docStr = `${JS_COMMENT_START}\n* ${description}\n${'* @constant'}\n${deprecatedStr}${JS_COMMENT_END}`;
  return docStr;
}

function addToIndexFile(fileDir: string): void {
  const exportStr = `export * from './${fileDir}'\n`;
  writeFileSync(PACKAGE_INDEX_DIR, exportStr, { flag: 'a+' });
}
