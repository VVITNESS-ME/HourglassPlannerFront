'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

export default function VideoChat() {
    const params = useParams();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const [roomId, setRoomId] = useState<string | string[] | undefined>(params.roomId);
    const [isCaller, setIsCaller] = useState(false);

    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'answer', answer }));
                }
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        }
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        }
    };

    const handleCandidate = async (candidate: RTCIceCandidateInit) => {
        if (peerConnection) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error handling ICE candidate:', error);
            }
        }
    };

    const startCall = async () => {
        if (peerConnection) {
            try {
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'offer', offer }));
                }
                setIsCaller(true);
            } catch (error) {
                console.error('Error starting call:', error);
            }
        }
    };

    useEffect(() => {
        if (!roomId) return;

        // const socketURL = `wss://jungle5105.xyz:12345/${roomId}`;
        const socketURL = `wss://localhost:8080/${roomId}`;
        const newSocket = new WebSocket(socketURL);

        newSocket.onopen = () => {
            console.log('WebSocket connection established');
            setSocket(newSocket);
        };

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received message:', data);

            switch(data.type) {
                case 'offer':
                    handleOffer(data.offer);
                    break;
                case 'answer':
                    handleAnswer(data.answer);
                    break;
                case 'candidate':
                    handleCandidate(data.candidate);
                    break;
            }
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            if (newSocket.readyState === WebSocket.OPEN) {
                newSocket.close();
            }
        };
    }, []);

    useEffect(() => {
        if (socket) {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });

            pc.onicecandidate = (event) => {
                if (event.candidate && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
                }
            };

            pc.ontrack = (event) => {
                console.log("Remote track received");
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };

            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                    stream.getTracks().forEach(track => pc.addTrack(track, stream));
                })
                .catch(error => {
                    console.error('Error accessing media devices:', error);
                });

            setPeerConnection(pc);
            // console.log(pc);
        }
    }, [socket]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Video Chat - Room {roomId}</h1>
            <div className="video-container">
                <video ref={localVideoRef} autoPlay muted className="local-video w-10 h-10" />
                <video ref={remoteVideoRef} autoPlay className="remote-video w-10 h-10" />
            </div>
            <button onClick={startCall} className="px-4 py-2 border border-black mr-2">
                Start Call
            </button>
        </div>
    );
}