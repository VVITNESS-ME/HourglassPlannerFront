const express = require('express');
const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');
const cors = require('cors');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./server-key.pem'),
  cert: fs.readFileSync('./server.pem'),
  // key: fs.readFileSync('./localhost-key.pem'),
  // cert: fs.readFileSync('./localhost.pem'),
};

app.prepare().then(() => {
  const server = express();

  // API 프록시 설정 (http-proxy-middleware 사용)
  const { createProxyMiddleware } = require('http-proxy-middleware');
  server.use('/api', createProxyMiddleware({
    target: 'http://localhost:8082',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // URL에서 /api를 제거합니다.
    },  
  }));
  server.use('/socket', createProxyMiddleware({
  target: 'wss://localhost:3001',
  ws: true,
  changeOrigin: true,
  secure: false, // 로컬 인증서를 사용할 때, 필요에 따라 이 옵션을 설정
  pathRewrite: {
    '^/socket': '', // URL에서 /api를 제거합니다.
  }, 
  }))
  server.use(cors());

  // Next.js의 기본 요청 핸들러 설정
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = 3000;
  https.createServer(httpsOptions, server).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on https://localhost:${PORT}`);
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
