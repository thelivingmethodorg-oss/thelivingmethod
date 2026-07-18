/**
 * Replicates packages/cms-schema createCustomSchemaHash(fields):
 *   rehydrateSchema(fields) -> createSchemaHash(zodObject)
 * Sources extracted verbatim from cms-renderer's source maps
 * (documents/rehydration.ts, documents/schema-hash.ts, fields/*).
 * .meta() calls are omitted — the hash depends only on zod type + optional.
 *
 * Usage: bun compute-hash.ts <fields.json>   (single field array)
 *        bun compute-hash.ts <multi.json>    ({ name: fields[] } map — prints hash per name)
 */
import { z, type ZodObject, type ZodRawShape, type ZodType, type ZodTypeAny } from 'zod';
// @ts-expect-error object-hash ships no types; only used by this CLI script
import hash from 'object-hash';

// ---- fields/primitives/url.ts ----
const ROOT_RELATIVE_URL_PATTERN = /^\/(?!\/)/;
function isValidCmsUrl(value: string): boolean {
  return ROOT_RELATIVE_URL_PATTERN.test(value) || z.url().safeParse(value).success;
}
function createUrlStringSchema(schema: z.ZodType<string>): z.ZodType<string> {
  return schema.refine(isValidCmsUrl, 'Invalid URL format');
}

// ---- fields/complex/richtext.ts ----
const textNodeSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  marks: z.array(z.string()).optional(),
});
const blockSchema: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    type: z.string(),
    children: z.array(z.union([textNodeSchema, blockSchema])).optional(),
    marks: z.array(z.string()).optional(),
    level: z.number().optional(),
    url: z.string().optional(),
  })
);
const richtextSchema = z.union([z.array(blockSchema), z.string()]);
function createRichtextField(options: { label: string; required?: boolean }) {
  return options.required ? richtextSchema : richtextSchema.optional();
}

// ---- fields/complex/media.ts ----
const ImageReferenceSchema = z.object({
  alt: z.string().min(1, 'Alt text is required for accessibility'),
  caption: z.string().max(500).optional(),
  attribution: z.string().max(255).optional(),
  _asset: z.object({
    id: z.uuid(),
    transformation: z.string().nullable().optional(),
  }),
});

// ---- documents/rehydration.ts ----
const LAYOUT_VALUES = ['middle', 'left', 'right'] as const;
const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// select({...}) without required -> z.enum(values).optional()
// string({...}) without required -> z.string().regex(pattern).optional()
const DEFAULT_COMPONENT_FIELDS: Record<string, ZodType> = {
  layout: z.enum(LAYOUT_VALUES.map((v) => v) as unknown as [string, ...string[]]).optional(),
  background: z.string().regex(HEX_COLOR_PATTERN, 'Must be a hex color like #fff or #1a2b3c').optional(),
};

interface FieldConstraints {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  integer?: boolean;
  enumValues?: string[];
  arrayItemType?: 'string' | 'number' | 'boolean' | 'reference';
  minItems?: number;
  maxItems?: number;
  refSchema?: string;
}
interface FieldDefinition {
  name: string;
  type: string;
  displayName?: string;
  description?: string;
  required: boolean;
  constraints?: FieldConstraints;
}

function applyStringConstraints(schema: z.ZodString, constraints?: FieldConstraints): z.ZodString {
  if (!constraints) return schema;
  let result = schema;
  if (constraints.minLength !== undefined) {
    result = result.min(constraints.minLength, `Must be at least ${constraints.minLength} characters`);
  }
  if (constraints.maxLength !== undefined) {
    result = result.max(constraints.maxLength, `Must be at most ${constraints.maxLength} characters`);
  }
  if (constraints.pattern) {
    result = result.regex(new RegExp(constraints.pattern), 'Invalid format');
  }
  return result;
}

function applyNumberConstraints(schema: z.ZodNumber, constraints?: FieldConstraints): z.ZodNumber {
  if (!constraints) return schema;
  let result = schema;
  if (constraints.min !== undefined) result = result.min(constraints.min, `Must be at least ${constraints.min}`);
  if (constraints.max !== undefined) result = result.max(constraints.max, `Must be at most ${constraints.max}`);
  if (constraints.integer) result = result.int('Must be an integer');
  return result;
}

function applyArrayConstraints<T extends z.ZodArray<any>>(schema: T, constraints?: FieldConstraints): z.ZodArray<any> {
  if (!constraints) return schema;
  let result: z.ZodArray<any> = schema;
  if (constraints.minItems !== undefined) result = result.min(constraints.minItems, `Must have at least ${constraints.minItems} items`);
  if (constraints.maxItems !== undefined) result = result.max(constraints.maxItems, `Must have at most ${constraints.maxItems} items`);
  return result;
}

function createPrimitiveSchema(type: 'string' | 'number' | 'boolean'): ZodType {
  switch (type) {
    case 'string': return z.string();
    case 'number': return z.number();
    case 'boolean': return z.boolean();
  }
}

function createBaseSchema(type: string, constraints?: FieldConstraints): ZodType {
  switch (type) {
    case 'string': return applyStringConstraints(z.string(), constraints);
    case 'richtext': return createRichtextField({ label: 'Rich Text', required: true });
    case 'number': return applyNumberConstraints(z.number(), constraints);
    case 'boolean': return z.boolean();
    case 'image': return ImageReferenceSchema;
    case 'icon': return z.string().max(50);
    case 'date': return z.iso.date('Invalid date format. Expected YYYY-MM-DD');
    case 'datetime': return z.iso.datetime({ offset: true, message: 'Invalid datetime format. Expected ISO 8601' });
    case 'url': return createUrlStringSchema(applyStringConstraints(z.string(), constraints));
    case 'email': return applyStringConstraints(z.string(), constraints).pipe(z.email('Invalid email format'));
    case 'enum': {
      const values = constraints?.enumValues;
      if (!values || values.length === 0) throw new Error('Enum field requires at least one enumValues in constraints');
      return z.enum(values as [string, ...string[]]);
    }
    case 'reference': return z.record(z.string(), z.unknown());
    case 'array': {
      const itemType = constraints?.arrayItemType ?? 'string';
      const itemSchema = itemType === 'reference' ? z.record(z.string(), z.unknown()) : createPrimitiveSchema(itemType);
      return applyArrayConstraints(z.array(itemSchema), constraints);
    }
    default: throw new Error(`Unknown field type: ${type}`);
  }
}

function rehydrateField(field: FieldDefinition): ZodType {
  let schema = createBaseSchema(field.type, field.constraints);
  if (!field.required) schema = schema.optional();
  return schema;
}

function rehydrateSchema(fields: FieldDefinition[]): ZodObject<ZodRawShape> {
  if (!Array.isArray(fields) || fields.length === 0) throw new Error('Schema must have at least one field');
  const shape: Record<string, ZodType> = {};
  const seenNames = new Set<string>();
  for (const field of fields) {
    if (seenNames.has(field.name)) throw new Error(`Duplicate field name: "${field.name}"`);
    seenNames.add(field.name);
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.name)) throw new Error(`Invalid field name "${field.name}"`);
    shape[field.name] = rehydrateField(field);
  }
  for (const [name, fieldSchema] of Object.entries(DEFAULT_COMPONENT_FIELDS)) {
    if (!seenNames.has(name)) shape[name] = fieldSchema;
  }
  return z.object(shape);
}

// ---- documents/schema-hash.ts (verbatim logic) ----
function unwrapZodType(zodType: ZodTypeAny): ZodTypeAny {
  const current = zodType;
  const def = (current as any)._def;
  if ('innerType' in def && def.innerType) {
    return unwrapZodType(def.innerType as ZodTypeAny);
  }
  return current;
}

function getZodTypeName(zodType: ZodTypeAny): string {
  const unwrapped = unwrapZodType(zodType);
  const def = (unwrapped as any)._def;
  if (!def) return 'unknown';
  if ('type' in def && typeof def.type === 'string') return def.type as string;
  if ('typeName' in def) return def.typeName as string;
  return 'unknown';
}

function createSchemaHash(schema: ZodObject<ZodRawShape>): string {
  const shape = schema.shape;
  const schemaDefinition = Object.entries(shape).reduce(
    (acc, [key, zodType]) => {
      const typeName = getZodTypeName(zodType as ZodTypeAny);
      const unwrapped = unwrapZodType(zodType as ZodTypeAny);
      const unwrappedDef = (unwrapped as any)._def as Record<string, unknown>;
      const isOptional =
        'isOptional' in (zodType as any) && typeof (zodType as any).isOptional === 'function'
          ? (zodType as any).isOptional()
          : false;
      acc[key] = {
        type: typeName,
        optional: isOptional,
        ...(typeName === 'object' &&
          'shape' in unwrappedDef &&
          typeof unwrappedDef.shape === 'function' && {
            shape: Object.keys((unwrappedDef.shape as () => Record<string, unknown>)()),
          }),
      };
      return acc;
    },
    {} as Record<string, unknown>
  );
  return hash(schemaDefinition, { algorithm: 'md5', respectType: false, unorderedArrays: false });
}

export function createCustomSchemaHash(fields: FieldDefinition[]): string {
  return createSchemaHash(rehydrateSchema(fields));
}

// ---- CLI ----
const file = process.argv[2];
if (file) {
  const { readFileSync } = await import("node:fs");
  const data = JSON.parse(readFileSync(file, "utf8"));
  if (Array.isArray(data)) {
    console.log(createCustomSchemaHash(data));
  } else {
    for (const [name, fields] of Object.entries(data)) {
      console.log(`${name}\t${createCustomSchemaHash(fields as FieldDefinition[])}`);
    }
  }
}
