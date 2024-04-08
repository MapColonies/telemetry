import fsPromise from 'node:fs/promises';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import { parse as jsoncParse } from 'comment-json';
import type { ConventionSchema } from './autogen.mjs';

const SCHEMA_DIR = path.join('schemas', 'attribute.schema.json');
const SEMANTIC_ATTRIBUTES_DIR = path.join('src', 'semanticConventions');

if (!existsSync(SCHEMA_DIR)) {
  throw new Error(`Could not find the file ${SCHEMA_DIR} referenced in the error it wasn't TS or JSON`);
}

const schema = readFileSync(SCHEMA_DIR, { encoding: 'utf-8' });
const ajv = new Ajv.default({ allErrors: true });
const schemaJson = JSON.parse(schema) as object;
const validate = ajv.compile(schemaJson);

// read and filter all relevant static db json files per domain
const dbFiles = readdirSync(SEMANTIC_ATTRIBUTES_DIR).filter((file) => path.extname(file) === '.json');

console.log(`Detect ${dbFiles.length} domains db files: ${dbFiles.join(',')}`);

// load and validate each json by shred schema
await runValidationOnFiles(dbFiles);

async function runValidationOnFiles(filesName: string[]): Promise<void> {
  for (const file of filesName) {
    const dbJson = await fsPromise.readFile(path.join(SEMANTIC_ATTRIBUTES_DIR, file), { encoding: 'utf-8' });

    const data = jsoncParse(dbJson);
    const isValidByScheme = validateSchema(data);
    if (!isValidByScheme) {
      throw new Error(`db file ${file} not supported the scheme ${SCHEMA_DIR}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`Complete all json validation for domains db files: ${dbFiles}`);
}

function validateSchema(data: unknown): data is ConventionSchema {
  const valid = validate(data);
  if (validate.errors) {
    const reducedValidationErrorObj = validate.errors.map((err) => {
      return { instancePath: err.instancePath, schemaPath: err.schemaPath, message: err.message };
    });

    console.error('Failed Scheme validation with current errors:\n', reducedValidationErrorObj);
  }
  return valid;
}
