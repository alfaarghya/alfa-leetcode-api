import path from 'node:path';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const SPEC_PATH = path.resolve(process.cwd(), 'swagger.yaml');

/**
 * Serves the raw OpenAPI spec at /openapi.yaml and mounts Swagger UI at /api-docs.
 * Call this BEFORE registering /:username wildcard routes in app.ts.
 */
export function setupSwagger(app: Express): void {
  app.get('/openapi.yaml', (_req, res) => {
    res.setHeader('Content-Type', 'text/yaml');
    res.sendFile(SPEC_PATH);
  });

  app.use('/api-docs', swaggerUi.serve);
  app.get(
    '/api-docs',
    swaggerUi.setup(undefined, {
      swaggerUrl: '/openapi.yaml',
      customSiteTitle: 'Alfa-LeetCode API Docs',
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
      },
    }),
  );
}
