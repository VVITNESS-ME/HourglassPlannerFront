const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = dev ? {
  key: fs.readFileSync('./server-key.pem'),
  cert: fs.readFileSync('./server.pem'),
} : {
  key: fs.readFileSync('./server-key.pem'),
  cert: fs.readFileSync('./server.pem'),
};

app.prepare().then(() => {
  const server = express();

  // API 프록시 설정
  server.use('/api', createProxyMiddleware({
    target: 'http://jungle5105.xyz:12345',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // URL에서 /api를 제거합니다.
    },
  }));

  server.use(cors());

  // Next.js의 기본 요청 핸들러 설정
  server.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  const httpsServer = https.createServer(httpsOptions, server);

  const io = socketIo(httpsServer, {
    cors: {
      origin: "*", // 모든 도메인 허용
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (roomId) => {
      socket.join(roomId);
      console.log(`Client joined room ${roomId}, total clients: ${io.sockets.adapter.rooms.get(roomId).size}`);
    });

    socket.on('offer', (data) => {
      const { roomId, offer } = data;
      console.log(offer);
      socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (data) => {
      const { roomId, answer } = data;
      console.log(answer);
      socket.to(roomId).emit('answer', answer);
    });

    socket.on('candidate', (data) => {
      const { roomId, candidate } = data;
      socket.to(roomId).emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  httpsServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on https://localhost:${PORT}`);
  });
});