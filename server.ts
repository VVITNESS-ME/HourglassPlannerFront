import { createServer } from 'https';
import { createServer as createHttpServer } from 'http';
import { parse } from 'url';
import next from 'next';
import fs from 'fs';
import { IncomingMessage, ServerResponse } from 'http';

// 환경 변수는 env-cmd를 통해 로드됩니다.
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const runMode = process.env.NEXT_PUBLIC_RUN_MODE;

if (runMode === 'local') {
  const httpsOptions = {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
  };

  app.prepare().then(() => {
    createServer(httpsOptions, (req: IncomingMessage, res: ServerResponse) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }).listen(3000, () => {
      console.log('> Ready on https://localhost:3000');
    });
  });
} else {
  app.prepare().then(() => {
    createHttpServer((req: IncomingMessage, res: ServerResponse) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    }).listen(3000, () => {
      console.log('> Ready on http://localhost:3000');
    });
  });
}