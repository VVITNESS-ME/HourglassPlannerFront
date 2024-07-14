'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import io, { Socket } from 'socket.io-client';

export default function VideoChat() {
    const params = useParams();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const roomId = params.roomId as string;
    const [isCaller, setIsCaller] = useState(false);

    const createPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('candidate', { roomId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            console.log("Remote track received");
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        peerConnectionRef.current = pc;
    }, [roomId]);

    const handleOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
        if (!peerConnectionRef.current) {
            createPeerConnection();
        }
        try {
            await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnectionRef.current?.createAnswer();
            await peerConnectionRef.current?.setLocalDescription(answer);
            socketRef.current?.emit('answer', { roomId, answer });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }, [roomId, createPeerConnection]);

    const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
        try {
            await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }, []);

    const handleCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        try {
            await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error('Error handling ICE candidate:', error);
        }
    }, []);

    const startCall = useCallback(async () => {
        if (!peerConnectionRef.current) {
            createPeerConnection();
        }
        try {
            console.log('Starting call');
            const offer = await peerConnectionRef.current?.createOffer();
            await peerConnectionRef.current?.setLocalDescription(offer);
            socketRef.current?.emit('offer', { roomId, offer });
            setIsCaller(true);
        } catch (error) {
            console.error('Error starting call:', error);
        }
    }, [roomId, createPeerConnection]);

    useEffect(() => {
        if (!roomId) return;

        const newSocket: Socket = io('https://localhost:3000');
        socketRef.current = newSocket;

        newSocket.on('connect', () => {
            console.log('Socket.IO connection established');
            newSocket.emit('join', roomId);
        });

        newSocket.on('offer', handleOffer);
        newSocket.on('answer', handleAnswer);
        newSocket.on('candidate', handleCandidate);

        newSocket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId, handleOffer, handleAnswer, handleCandidate]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                stream.getTracks().forEach(track => peerConnectionRef.current?.addTrack(track, stream));
            })
            .catch(error => {
                console.error('Error accessing media devices:', error);
            });
    }, []);

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