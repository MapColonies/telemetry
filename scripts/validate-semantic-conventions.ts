import fsPromise from 'node:fs/promises';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import Ajv from 'ajv';
import path from 'node:path';

const SCHEMA_JSON_NAME = 'attribute.schema.json';
const SCHEMA_DIR = 'schemas';
const SEMANTIC_ATTRIBUTES_DIR = 'src/semanticAttributes';

if (!existsSync(path.join(SCHEMA_DIR, SCHEMA_JSON_NAME))) {
  throw new Error(`Could not find the file ${SCHEMA_JSON_NAME} referenced in the error it wasn't TS or JSON`);
}

const schema = readFileSync(path.join(SCHEMA_DIR, SCHEMA_JSON_NAME), { encoding: 'utf-8' });
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(JSON.parse(schema));

// read and filter all relevant static db json files per domain
const dbFiles = readdirSync(SEMANTIC_ATTRIBUTES_DIR).filter((file) => file.endsWith('.json'));
console.log(`Detect ${dbFiles.length} domains db files: ${dbFiles}`);

// load and validate each json by shred schema
runValidationOnFiles(dbFiles);

async function runValidationOnFiles(filesName: string[]) {
  for (const file of filesName) {
    const dbJson = await fsPromise.readFile(path.join(SEMANTIC_ATTRIBUTES_DIR, file), { encoding: 'utf-8' });
    const isValidByScheme = validateSchema(JSON.parse(dbJson));
    if (!isValidByScheme) {
      throw new Error(`db file ${file} not supported the scheme ${SCHEMA_JSON_NAME}`);
    }
  }
  console.log(`Complete all json validation for domains db files: ${dbFiles}`);
}

function validateSchema(data: any) {
  const valid = validate(data);
  if (validate.errors) {
    const reducedValidationErrorObj = validate.errors.map((err) => {
      return { instancePath: err.instancePath, schemaPath: err.schemaPath, message: err.message };
    });

    console.error('Failed Scheme validation with current errors:\n', reducedValidationErrorObj);
  }
  return valid;
}
