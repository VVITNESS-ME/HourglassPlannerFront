const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // API 프록시 설정
  server.use('/api', createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // URL에서 /api를 제거합니다.
    },
  }));

  server.use('/socket', createProxyMiddleware({
    target: 'ws://localhost:3001',
    ws: true,
    changeOrigin: true,
    pathRewrite: {
      '^/socket': '', // URL에서 /socket를 제거합니다.
    },
  }));

  server.use(cors());

  // Next.js의 기본 요청 핸들러 설정
  server.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${PORT}`);
  });

// const wss = new WebSocket.Server({ server });

  // wss.on('connection', function connection(ws) {
  //     // 웹소켓 연결 처리 로직
  //     ws.on('message', (data, isBinary) => {
  //         // Broadcast to everyone else.
  //         const message = isBinary ? data : data.toString();
  //         console.log("you've got message!");
  //         console.log(message);
  //         wss.clients.forEach((client) => {
  //           if (client !== ws && client.readyState === WebSocket.OPEN) {
  //             client.send(message);
  //           }
  //         });
  //       });
  //     console.log("연결됐음")
  // });
});