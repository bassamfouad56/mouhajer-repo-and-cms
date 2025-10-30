import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

// Map blueprint field types to GraphQL types
function mapFieldTypeToGraphQL(fieldType: string): string {
  const typeMap: Record<string, string> = {
    text: 'String',
    textarea: 'String',
    rich_text: 'String',
    markdown: 'String',
    number: 'Int',
    float: 'Float',
    boolean: 'Boolean',
    date: 'DateTime',
    datetime: 'DateTime',
    time: 'String',
    image: 'Asset',
    gallery: '[Asset!]',
    file: 'Asset',
    video: 'String',
    select: 'String',
    radio: 'String',
    checkbox: '[String!]',
    color: 'String',
    json: 'JSON',
    reference: 'ID',
    relation: '[ID!]',
    repeater: 'JSON',
    group: 'JSON',
    location: 'JSON',
    address: 'String',
  };

  return typeMap[fieldType] || 'String';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pluralize(str: string): string {
  // Simple pluralization (can be enhanced)
  if (str.endsWith('y')) {
    return str.slice(0, -1) + 'ies';
  }
  if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z') || str.endsWith('ch') || str.endsWith('sh')) {
    return str + 'es';
  }
  return str + 's';
}

interface FieldDefinition {
  id: string;
  name: string;
  label: { en: string; ar: string };
  type: string;
  required?: boolean;
  bilingual?: boolean;
  validation?: any;
  options?: any[];
  fields?: FieldDefinition[];
  referenceType?: string;
}

async function generateGraphQLSchema() {
  console.log('🔄 Generating GraphQL schema from blueprints...\n');

  const blueprints = await prisma.contentBlueprint.findMany({
    orderBy: { name: 'asc' },
  });

  console.log(`📋 Found ${blueprints.length} blueprints\n`);

  const typeDefs: string[] = [];
  const queries: string[] = [];
  const mutations: string[] = [];
  const inputTypes: string[] = [];

  // Add header
  const header = `# ========================================
# AUTO-GENERATED FROM CONTENT BLUEPRINTS
# DO NOT EDIT MANUALLY
# Run: npm run generate:graphql
# ========================================

scalar DateTime
scalar JSON

enum Locale {
  EN
  AR
}

enum BlueprintType {
  DOCUMENT
  COMPONENT
}

# Base Asset type for media files
type Asset {
  id: ID!
  url: String!
  alt: String
  caption: String
  mimeType: String
  size: Int
  width: Int
  height: Int
}
`;

  typeDefs.push(header);

  // Generate types for each blueprint
  for (const blueprint of blueprints) {
    // Handle Prisma JSON field (could be string or object)
    const fields = (typeof blueprint.fields === 'string'
      ? JSON.parse(blueprint.fields)
      : blueprint.fields) as FieldDefinition[];

    console.log(`   📝 Generating: ${blueprint.displayName} (${blueprint.name})`);

    // Generate field definitions
    const fieldDefs = fields.map((field: any) => {
      let graphqlType = mapFieldTypeToGraphQL(field.type);

      // Handle references to other blueprints
      if (field.type === 'reference' && field.referenceType) {
        graphqlType = field.referenceType;
      }

      // Handle bilingual fields
      if (field.bilingual) {
        return `  ${field.name}En: ${graphqlType}\n  ${field.name}Ar: ${graphqlType}`;
      }

      const nullable = field.required ? '!' : '';
      return `  ${field.name}: ${graphqlType}${nullable}`;
    }).join('\n');

    // Generate main type
    typeDefs.push(`
# ${blueprint.description || blueprint.displayName}
type ${blueprint.name} {
  id: ID!
${fieldDefs}

  # Metadata
  status: String!
  publishedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}`);

    // Generate filter input type
    inputTypes.push(`
input ${blueprint.name}FilterInput {
  status: String
  publishedAt_gte: DateTime
  publishedAt_lte: DateTime
  search: String
}`);

    // Generate create input type
    const createInputFields = fields.map((field: any) => {
      let graphqlType = mapFieldTypeToGraphQL(field.type);

      if (field.type === 'reference' && field.referenceType) {
        graphqlType = 'ID';
      } else if (field.type === 'relation') {
        graphqlType = '[ID!]';
      } else if (field.type === 'image' || field.type === 'file') {
        graphqlType = 'ID';
      } else if (field.type === 'gallery') {
        graphqlType = '[ID!]';
      }

      if (field.bilingual) {
        const nullable = field.required ? '!' : '';
        return `  ${field.name}En: ${graphqlType}${nullable}\n  ${field.name}Ar: ${graphqlType}${nullable}`;
      }

      const nullable = field.required ? '!' : '';
      return `  ${field.name}: ${graphqlType}${nullable}`;
    }).join('\n');

    inputTypes.push(`
input Create${blueprint.name}Input {
${createInputFields}
  status: String
  publishedAt: DateTime
}`);

    // Generate update input type (all fields optional)
    const updateInputFields = fields.map((field: any) => {
      let graphqlType = mapFieldTypeToGraphQL(field.type);

      if (field.type === 'reference' && field.referenceType) {
        graphqlType = 'ID';
      } else if (field.type === 'relation') {
        graphqlType = '[ID!]';
      } else if (field.type === 'image' || field.type === 'file') {
        graphqlType = 'ID';
      } else if (field.type === 'gallery') {
        graphqlType = '[ID!]';
      }

      if (field.bilingual) {
        return `  ${field.name}En: ${graphqlType}\n  ${field.name}Ar: ${graphqlType}`;
      }

      return `  ${field.name}: ${graphqlType}`;
    }).join('\n');

    inputTypes.push(`
input Update${blueprint.name}Input {
${updateInputFields}
  status: String
  publishedAt: DateTime
}`);

    // Generate queries
    if (blueprint.allowMultiple) {
      const pluralName = blueprint.blueprintType === 'DOCUMENT'
        ? pluralize(blueprint.name.toLowerCase())
        : pluralize(blueprint.name);

      queries.push(`
  # Get all ${blueprint.displayName} instances
  ${pluralName}(
    locale: Locale = EN
    filter: ${blueprint.name}FilterInput
    limit: Int = 10
    offset: Int = 0
    orderBy: String = "createdAt"
    orderDirection: String = "desc"
  ): [${blueprint.name}!]!`);
    }

    // Single instance query
    queries.push(`
  # Get single ${blueprint.displayName} by ID
  ${blueprint.name.toLowerCase()}(
    id: ID!
    locale: Locale = EN
  ): ${blueprint.name}`);

    // Generate mutations
    mutations.push(`
  # Create new ${blueprint.displayName}
  create${blueprint.name}(
    input: Create${blueprint.name}Input!
    locale: Locale = EN
  ): ${blueprint.name}!`);

    mutations.push(`
  # Update existing ${blueprint.displayName}
  update${blueprint.name}(
    id: ID!
    input: Update${blueprint.name}Input!
    locale: Locale = EN
  ): ${blueprint.name}!`);

    mutations.push(`
  # Delete ${blueprint.displayName}
  delete${blueprint.name}(id: ID!): Boolean!`);

    if (!blueprint.isSystem) {
      mutations.push(`
  # Duplicate ${blueprint.displayName}
  duplicate${blueprint.name}(id: ID!): ${blueprint.name}!`);
    }
  }

  // Combine all parts
  const schema = `${typeDefs.join('\n')}

${inputTypes.join('\n')}

# ========================================
# QUERIES
# ========================================

extend type Query {${queries.join('')}

  # Blueprint metadata
  blueprints: [ContentBlueprint!]!
  blueprint(id: ID!): ContentBlueprint
}

# ========================================
# MUTATIONS
# ========================================

extend type Mutation {${mutations.join('')}
}

# ========================================
# BLUEPRINT METADATA TYPE
# ========================================

type ContentBlueprint {
  id: ID!
  name: String!
  displayName: String!
  description: String
  blueprintType: BlueprintType!
  allowMultiple: Boolean!
  isSystem: Boolean!
  icon: String
  category: String!
  fields: JSON!
  createdAt: DateTime!
  updatedAt: DateTime!
}
`;

  // Ensure generated directory exists
  const generatedDir = join(process.cwd(), 'src', 'graphql', 'generated');
  await mkdir(generatedDir, { recursive: true });

  // Write schema file
  const schemaPath = join(generatedDir, 'blueprints.graphql');
  await writeFile(schemaPath, schema);

  console.log(`\n✅ GraphQL schema generated successfully!`);
  console.log(`   📄 File: src/graphql/generated/blueprints.graphql`);
  console.log(`   📊 Generated:`);
  console.log(`      - ${blueprints.length} types`);
  console.log(`      - ${queries.length} queries`);
  console.log(`      - ${mutations.length} mutations`);
  console.log(`      - ${inputTypes.length} input types\n`);

  // Generate TypeScript types summary
  console.log(`💡 Next steps:`);
  console.log(`   1. Run: npm run graphql-codegen (to generate TypeScript types)`);
  console.log(`   2. Import schema in: src/graphql/schema/index.ts`);
  console.log(`   3. Create resolvers in: src/graphql/resolvers/blueprints.ts\n`);

  return {
    blueprintCount: blueprints.length,
    queryCount: queries.length,
    mutationCount: mutations.length,
  };
}

// Main execution
generateGraphQLSchema()
  .then((stats) => {
    console.log(`🎉 GraphQL generation complete!`);
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Error generating GraphQL schema:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
