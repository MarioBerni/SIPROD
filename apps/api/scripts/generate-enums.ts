import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface EnumDefinition {
  name: string;
  values: { key: string; value: string }[];
}

function extractEnums(schemaContent: string): EnumDefinition[] {
  const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/g;
  const enums: EnumDefinition[] = [];
  let match;

  while ((match = enumRegex.exec(schemaContent)) !== null) {
    const enumName = match[1];
    const enumBody = match[2];
    const valueRegex = /(\w+)\s*(?:@map\("([^"]+)")?\s*$/gm;
    const values: { key: string; value: string }[] = [];
    let valueMatch;

    while ((valueMatch = valueRegex.exec(enumBody)) !== null) {
      const key = valueMatch[1];
      const mappedValue = valueMatch[2] || key;
      values.push({ key, value: mappedValue });
    }

    enums.push({ name: enumName, values });
  }

  return enums;
}

function generateTypeScriptEnums(enums: EnumDefinition[]): string {
  let output = '// Este archivo es generado automáticamente. NO EDITAR MANUALMENTE.\n\n';

  enums.forEach(({ name, values }) => {
    // Generar el enum
    output += `export enum ${name} {\n`;
    values.forEach(({ key }) => {
      output += `  ${key} = '${key}',\n`;
    });
    output += '}\n\n';

    // Generar el objeto de etiquetas
    output += `export const ${name}Label: Record<${name}, string> = {\n`;
    values.forEach(({ key, value }) => {
      output += `  [${name}.${key}]: '${value}',\n`;
    });
    output += '};\n\n';
  });

  return output;
}

function main() {
  try {
    // Leer el archivo schema.prisma
    const schemaPath = join(__dirname, '..', 'prisma', 'schema.prisma');
    const schemaContent = readFileSync(schemaPath, 'utf-8');

    // Extraer los enums
    const enums = extractEnums(schemaContent);

    // Generar el código TypeScript
    const tsCode = generateTypeScriptEnums(enums);

    // Escribir el archivo de salida
    const outputPath = join(__dirname, '..', '..', 'web', 'src', 'components', 'tabla-principal', 'types', 'generated-enums.ts');
    writeFileSync(outputPath, tsCode);

    console.log('✅ Enums generados exitosamente');
  } catch (error) {
    console.error('❌ Error al generar enums:', error);
    process.exit(1);
  }
}

main();
