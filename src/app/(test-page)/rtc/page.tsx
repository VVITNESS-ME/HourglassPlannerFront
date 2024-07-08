'use client';
import { useEffect, useRef, useState } from 'react';

const peerConnectionConfig = {
    iceServers: [
        { urls: 'stun:stun.stunprotocol.org:3478' },
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const Home = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>(new RTCPeerConnection(peerConnectionConfig));

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socket) socket.close();
        };
    }, []);

    const connectWebSocket = () => {
        const newSocket = new WebSocket('wss://jungle5105.xyz:12345/signal');

        newSocket.onopen = () => {
            console.log('WebSocket connection opened.');
            sendToServer({
                type: 'join_room',
                room: 'default'
            });
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        newSocket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
            if (event.code !== 1000) {
                console.error('WebSocket closed with error:', event);
                setTimeout(connectWebSocket, 1000); // 1초마다 재연결 시도
            }
        };

        newSocket.onmessage = (message) => {
            const webSocketMessage = JSON.parse(message.data);
            console.log(webSocketMessage);
            handleSignalingData(webSocketMessage);
        };

        setSocket(newSocket);
    };

    const sendToServer = (msg: { type: string; room: string; data?: any }) => {
        if (socket) {
            socket.send(JSON.stringify(msg));
        }
    };

    const handleSignalingData = (data: any) => {
        switch (data.type) {
            case 'offer':
                handleOffer(data.data);
                break;
            case 'answer':
                handleAnswer(data.data);
                break;
            case 'candidate':
                handleCandidate(data.data);
                break;
            default:
                break;
        }
    };

    const getMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    };

    const createOffer = async () => {
        if (peerConnection) {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            sendToServer({
                type: 'offer',
                room: 'default',
                data: offer
            });
        }
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
        if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            sendToServer({
                type: 'answer',
                room: 'default',
                data: answer
            });
        }
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
        if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
    };

    const handleCandidate = async (candidate: RTCIceCandidateInit) => {
        if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    useEffect(() => {
        if (peerConnection) {
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    sendToServer({
                        type: 'candidate',
                        room: 'default',
                        data: event.candidate
                    });
                }
            };

            peerConnection.ontrack = (event) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };
        }
    }, [peerConnection]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1>WebRTC Video Call</h1>
            <video ref={localVideoRef} autoPlay playsInline></video>
            <video ref={remoteVideoRef} autoPlay playsInline></video>
            <button onClick={getMedia}>Start Video</button>
            <button onClick={createOffer}>Create Offer</button>
        </div>
    );
};

export default Home;