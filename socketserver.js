// 필요한 라이브러리 불러오기
const express = require('express');
const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Express 애플리케이션 생성
const app = express();
const server = https.createServer({
  key: fs.readFileSync('./server-key.pem'),
  cert: fs.readFileSync('./server.pem'),
}, app);

// CORS 설정
app.use(cors());

const rooms = {};  // 각 경로별 클라이언트를 저장하기 위한 객체
const wss = new WebSocket.Server({ noServer: true });

const clients = new Map(); // 클라이언트의 WebSocket 연결을 저장하기 위한 Map

// 채팅방 생성 
const createRoom = (path) => {
    // 이미 존재하는 채팅방인지 확인
    if (!rooms[path]) {
        rooms[path] = new Set();
    }
};

// WebSocket 연결 처리 함수
// ws는 클라이언트의 WebSocket 연결 객체
const handleWebSocketConnection = (ws, request) => {
    const pathname = new URL(request.url, `https://${request.headers.host}`).pathname;

    if (!rooms[pathname]) {
        createRoom(pathname);
    }

    rooms[pathname].add(ws);

    ws.on('message', (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        console.log(message);
        // 동일 경로의 모든 클라이언트에게 메시지를 브로드캐스트
        rooms[pathname].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        rooms[pathname].delete(ws);
        if (rooms[pathname].size === 0) {
            delete rooms[pathname];
        }
    });
};

// WebSocket 서버 연결 처리
wss.on('connection', handleWebSocketConnection);

server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url, `https://${request.headers.host}`).pathname;
    if (!rooms[pathname]) {
        createRoom(pathname);
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
        const peerId = uuidv4();
        clients.set(ws, peerId);
        console.log("연결됐음. peerID: " + peerId);
        ws.send(JSON.stringify({ type: 'peerId', peerId }));

        rooms[pathname].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'join', peerId }));
            }
        });
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, function() {
    console.log(`HTTPS 서버가 포트 ${PORT}에서 실행 중입니다.`);
});