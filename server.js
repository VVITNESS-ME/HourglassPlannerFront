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
    target: 'http://localhost:8082',
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

  const rooms = new Map();

  io.on('connection', (socket) => {
    socket.on('join', (roomId) => {
      socket.join(roomId);
      const room = rooms.get(roomId) || new Set();
      room.add(socket.id);
      rooms.set(roomId, room);

      // Send the list of users to the newly joined user
      socket.emit('users', Array.from(room));

      // Notify others in the room that a new user has joined
      socket.to(roomId).emit('userJoined', socket.id);
    });

    socket.on('offer', ({ roomId, toUserId, offer }) => {
      socket.to(toUserId).emit('offer', { fromUserId: socket.id, offer });
    });

    socket.on('answer', ({ roomId, toUserId, answer }) => {
      socket.to(toUserId).emit('answer', { fromUserId: socket.id, answer });
    });

    socket.on('candidate', ({ roomId, userId, candidate }) => {
      socket.to(userId).emit('candidate', { fromUserId: socket.id, candidate });
    });

    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (rooms.has(room)) {
          const users = rooms.get(room);
          users.delete(socket.id);
          if (users.size === 0) {
            rooms.delete(room);
          } else {
            socket.to(room).emit('userLeft', socket.id);
          }
        }
      }
    });
  });

  httpsServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on https://localhost:${PORT}`);
  });
});