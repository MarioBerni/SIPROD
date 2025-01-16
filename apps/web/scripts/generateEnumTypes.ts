#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface EnumDefinition {
  name: string;
  values: { key: string; label: string; value: string }[];
}

function extractEnums(schemaContent: string): EnumDefinition[] {
  const enumRegex = /enum\s+(\w+)\s*{([^}]*)}/g;
  const valueMapRegex = /@map\("([^"]+)"\)/;
  const enums: EnumDefinition[] = [];

  let match;
  while ((match = enumRegex.exec(schemaContent)) !== null) {
    const enumName = match[1];
    const enumBody = match[2];
    const values: { key: string; label: string; value: string }[] = [];

    const lines = enumBody.split('\n').map(line => line.trim()).filter(line => line);
    lines.forEach(line => {
      const [key, ...rest] = line.split(/\s+/);
      if (key) {
        const mapMatch = rest.join(' ').match(valueMapRegex);
        const label = mapMatch ? mapMatch[1] : key.split('_').map(
          word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        // El value será el label convertido a formato enum
        const value = label.toUpperCase().replaceAll(' ', '_');
        values.push({ key, label, value });
      }
    });

    if (values.length > 0) {
      enums.push({ name: enumName, values });
    }
  }

  return enums;
}

function generateTypeScriptEnums(enums: EnumDefinition[]): string {
  let output = '// Este archivo es generado automáticamente. No modificar manualmente.\n\n';

  // Generar utilidades de conversión
  output += `// Utilidades de conversión para enums
export const convertToEnumValue = (str: string): string => {
  return str.toUpperCase().replaceAll(' ', '_');
};

export const convertToLabel = (enumValue: string): string => {
  return enumValue.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};\n\n`;

  enums.forEach(({ name, values }) => {
    // Generar el enum
    output += `export enum ${name} {\n`;
    values.forEach(({ key, value }) => {
      output += `  ${key} = '${value}',\n`;
    });
    output += '}\n\n';

    // Generar el objeto de etiquetas
    output += `export const ${name}Label: Record<keyof typeof ${name}, string> = {\n`;
    values.forEach(({ key, label }) => {
      output += `  ${key}: '${label}',\n`;
    });
    output += '} as const;\n\n';

    // Generar función de conversión específica para cada enum
    output += `export const convertTo${name} = (str: string): ${name} => {
  const enumValue = convertToEnumValue(str);
  return enumValue as ${name};
};\n\n`;
  });

  return output;
}

async function main() {
  try {
    // Leer el schema de Prisma
    const schemaPath = join(__dirname, '../../api/prisma/schema.prisma');
    const schemaContent = readFileSync(schemaPath, 'utf-8');

    // Extraer los enums
    const enums = extractEnums(schemaContent);

    // Generar el código TypeScript
    const typeScriptCode = generateTypeScriptEnums(enums);

    // Escribir el archivo de tipos
    const outputPath = join(__dirname, '../src/components/tabla-principal/types/generated.ts');
    writeFileSync(outputPath, typeScriptCode);

    console.log('✅ Tipos generados exitosamente');
  } catch (error) {
    console.error('❌ Error al generar los tipos:', error);
    process.exit(1);
  }
}

main();
