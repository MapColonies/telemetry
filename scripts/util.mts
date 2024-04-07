import { AttributeDescription, ConventionSchema } from './autogen.mjs';

type AttributeWithKeyName = AttributeDescription & { keyName: string };

export function getAllPropertyNames(attributeObject: ConventionSchema): AttributeWithKeyName[] {
  const attributesNameList: AttributeWithKeyName[] = [];

  const subAttributes = Object.entries(attributeObject.content.subAttributes!).map<AttributeWithKeyName>(([key, value]) => ({
    ...value,
    keyName: `${attributeObject.domain}.${key}`,
  }));

  while (subAttributes.length > 0) {
    const includedAttributes = subAttributes.pop();

    if (!includedAttributes?.subAttributes) {
      attributesNameList.push(includedAttributes!);
      continue;
    }

    const currentSubAttributes = Object.entries(includedAttributes.subAttributes).map<AttributeWithKeyName>(([key, value]) => ({
      ...value,
      keyName: [includedAttributes.keyName, key].join('.'),
    }));
    subAttributes.push(...currentSubAttributes);
  }

  return attributesNameList;
}
