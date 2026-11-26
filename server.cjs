const http = require('node:http');
const { readFile } = require('node:fs/promises');
const { join } = require('node:path');

const routes = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/vendor/pptxgen.bundle.js', ['vendor/pptxgen.bundle.js', 'text/javascript; charset=utf-8']],
  ['/vendor/html2canvas.min.js', ['vendor/html2canvas.min.js', 'text/javascript; charset=utf-8']],
  ['/layouts.js', ['layouts.js', 'text/javascript; charset=utf-8']],
  ['/text-edit.js',['text-edit.js','text/javascript']],
  ['/text-map.js',['text-map.js','text/javascript']],
  ['/fonts/DM-Sans.ttf',['fonts/DM-Sans.ttf','font/ttf']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/presentation.pptx', ['presentation.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']]
]);

for (let i=1; i<=20; i++) {
  const path='slides/page-'+String(i).padStart(2,'0')+'.png';
  routes.set('/'+path,[path,'image/png']);
}
http.createServer(async (request, response) => {
  const route = routes.get(request.url.split('?')[0]);
  if (!route || request.method !== 'GET') {
    response.writeHead(404).end();
    return;
  }
  try {
    const bytes = await readFile(join(__dirname, route[0]));
    response.writeHead(200, { 'Content-Type': route[1], 'Cache-Control': 'no-cache' }).end(bytes);
  } catch {
    response.writeHead(500).end('Unable to open the requested file.');
  }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('Forma is ready on localhost.'));
