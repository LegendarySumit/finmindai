import { openApiSpec } from '@/lib/openapi';
import { NextResponse } from 'next/server';
import { errorResponse } from '@/lib/apiResponse';

const SWAGGER_UI_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>FinMindAI API Documentation</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.js"></script>
  <script>
    const ui = SwaggerUIBundle({
      url: "/api/docs/spec",
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: "StandaloneLayout",
      deepLinking: true
    })
  </script>
</body>
</html>
`;

export async function GET(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === '/api/docs') {
    return new NextResponse(SWAGGER_UI_HTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  if (url.pathname === '/api/docs/spec') {
    return NextResponse.json(openApiSpec, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return errorResponse('NOT_FOUND', 'Not Found', { status: 404 });
}
