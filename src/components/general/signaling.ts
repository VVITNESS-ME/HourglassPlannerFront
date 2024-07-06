const signalingServerUrl = 'wss://hourglass.ninja:8889';
const ws = new WebSocket(signalingServerUrl);

export const sendToServer = (message: any) => {
  ws.send(JSON.stringify(message));
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  // Handle signaling data
};