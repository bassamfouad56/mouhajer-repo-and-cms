/**
 * Structured Data Component
 * Renders JSON-LD structured data for SEO
 */

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
}

export default function StructuredData({ data }: StructuredDataProps) {
  // Handle both single schema and array of schemas
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}
