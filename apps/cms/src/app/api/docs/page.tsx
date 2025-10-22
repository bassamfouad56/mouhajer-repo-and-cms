'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Mouhajer CMS API Documentation</h1>
          <p className="text-muted-foreground">
            Interactive REST API documentation powered by Swagger/OpenAPI 3.0
          </p>
        </div>
        <SwaggerUI url="/api/docs/swagger.json" />
      </div>
    </div>
  );
}
