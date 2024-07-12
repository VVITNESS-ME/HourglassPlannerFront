const express = require('express');
const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');
const cors = require('cors');

const app = express();
const server = https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
}, app);


// CORS 설정
app.use(cors());

const rooms = {};  // 각 경로별 클라이언트를 저장하기 위한 객체
const wss = new WebSocket.Server({ server });

const createRoom = (path) => {
    if (!rooms[path]) {
        rooms[path] = new WebSocket.Server({server})
        rooms[path].on('connection', function connection(ws) {
            // 웹소켓 연결 처리 로직
            ws.on('message', (data, isBinary) => {
                // Broadcast to everyone else.
                const message = isBinary ? data : data.toString();
                console.log("you've got message!");
                console.log(message);
                wss.clients.forEach((client) => {
                  if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                  }
                });
              });
            console.log("연결됐음")
        });

    }
}

const PORT = process.env.PORT || 3001;

server.on('upgrade', (request, socket, head) => {
    const pathname = request.url;

    if (!rooms[pathname]) {
        createRoom(pathname);
    }

    rooms[pathname].handleUpgrade(request, socket, head, (ws) => {
        rooms[pathname].emit('connection', ws, request);
    });
});


server.listen(PORT, function() {
    console.log(`HTTPS 서버가 포트 ${PORT}에서 실행 중입니다.`);
});



setInterval(() => {
  server.getConnections((err, count) => {
      if (err) {
          console.error('Error getting connections:', err);
      } else {
          console.log(`Current connections: ${count}`);
      }

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(count);
        }
      });
  });
  
}, 5000); // 매 5초마다 연결된 소켓 수를 확인