import { AttributeDescription, ConventionSchema } from './autogen';

export function getAllPropertyNames(attributeObject: ConventionSchema): AttributeDescription[] {
  const attributesNameList: AttributeDescription[] = [];
  let subAttributes = Object.values(attributeObject.content.subAttributes!);

  while (subAttributes.length > 0) {
    const includedAttributes = subAttributes.pop();

    if (includedAttributes?.subAttributes) {
      subAttributes = subAttributes.concat(Object.values(includedAttributes.subAttributes));
      continue;
    }

    attributesNameList.push(includedAttributes!);
  }
  return attributesNameList;
}
