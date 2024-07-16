'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import io, { Socket } from 'socket.io-client';
import Image from 'next/image';

export default function VideoChat() {
    const params = useParams();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRefs = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
    const localStreamRef = useRef<MediaStream | null>(null);
    const roomId = params.roomId as string;
    const [users, setUsers] = useState<string[]>([]);

    const [videoOn, setVideoOn] = useState(false);
    const [micOn, setMicOn] = useState(false);
    const [audioOn, setAudioOn] = useState(false);

    const createPeerConnection = useCallback((userId: string) => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('candidate', { roomId, userId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            console.log("Remote track received from", userId);
            if (remoteVideoRefs.current) {
                let remoteVideo = document.getElementById(`remoteVideo-${userId}`) as HTMLVideoElement;
                if (!remoteVideo) {
                    remoteVideo = document.createElement('video');
                    remoteVideo.id = `remoteVideo-${userId}`;
                    remoteVideo.autoplay = true;
                    remoteVideo.className = "remote-video w-40 h-40";
                    remoteVideoRefs.current.appendChild(remoteVideo);
                }
                remoteVideo.srcObject = event.streams[0];
            }
        };

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current!));
        }

        peerConnections.current[userId] = pc;
        return pc;
    }, [roomId]);

    const handleOffer = useCallback(async ({ fromUserId, offer }: { fromUserId: string, offer: RTCSessionDescriptionInit }) => {
        console.log('Received offer from', fromUserId);
        let pc = peerConnections.current[fromUserId];
        if (!pc) {
            pc = createPeerConnection(fromUserId);
        }
        try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socketRef.current?.emit('answer', { roomId, toUserId: fromUserId, answer });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }, [roomId, createPeerConnection]);

    const handleAnswer = useCallback(async ({ fromUserId, answer }: { fromUserId: string, answer: RTCSessionDescriptionInit }) => {
        console.log('Received answer from', fromUserId);
        const pc = peerConnections.current[fromUserId];
        if (pc) {
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        }
    }, []);

    const handleCandidate = useCallback(async ({ fromUserId, candidate }: { fromUserId: string, candidate: RTCIceCandidateInit }) => {
        const pc = peerConnections.current[fromUserId];
        if (pc) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error handling ICE candidate:', error);
            }
        }
    }, []);

    const startCall = useCallback(async () => {
        console.log('Starting call with users:', users);
        for (const userId of users) {
            if (userId !== socketRef.current?.id) {
                let pc = peerConnections.current[userId];
                if (!pc) {
                    pc = createPeerConnection(userId);
                }
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socketRef.current?.emit('offer', { roomId, toUserId: userId, offer });
                } catch (error) {
                    console.error('Error starting call with', userId, error);
                }
            }
        }
    }, [roomId, users, createPeerConnection]);

    const connectVideo = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;

            setVideoOn(true);
            setMicOn(true);
            setAudioOn(true);
            
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            Object.values(peerConnections.current).forEach(pc => {
                stream.getTracks().forEach(track => pc.addTrack(track, stream));
            });
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    }, []);

    // TODO: 처음 입장할 때 유효한 사용자인지 백엔드에 요청해서 검증
    useEffect(() => {
        // validUser();
    }, []);

    useEffect(() => {
        if (!roomId) return;

        const newSocket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
        socketRef.current = newSocket;

        newSocket.on('connect', () => {
            console.log('Socket.IO connection established');
            newSocket.emit('join', roomId);
        });

        newSocket.on('users', (userList: string[]) => {
            console.log('Received user list:', userList);
            setUsers(userList);
        });

        newSocket.on('offer', handleOffer);
        newSocket.on('answer', handleAnswer);
        newSocket.on('candidate', handleCandidate);

        newSocket.on('userJoined', (userId: string) => {
            console.log('User joined:', userId);
            setUsers(prevUsers => [...prevUsers, userId]);
        });

        newSocket.on('userLeft', (userId: string) => {
            console.log('User left:', userId);
            setUsers(prevUsers => prevUsers.filter(id => id !== userId));
            if (peerConnections.current[userId]) {
                peerConnections.current[userId].close();
                delete peerConnections.current[userId];
            }
            const remoteVideo = document.getElementById(`remoteVideo-${userId}`);
            if (remoteVideo) {
                remoteVideo.remove();
            }
        });

        newSocket.on('disconnect', () => {
            console.log('Socket.IO connection closed');
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId, handleOffer, handleAnswer, handleCandidate]);

    const OnVideo = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => track.enabled = true);
            setVideoOn(true);
        }
    };

    const OffVideo = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => track.enabled = false);
            setVideoOn(false);
        }
    };

    const OnMic = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = true);
            setMicOn(true);
        }
    };

    const OffMic = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = false);
            setMicOn(false);
        }
    };

    const OnAudio = () => {
        setAudioOn(true);
        Object.values(peerConnections.current).forEach(pc => {
            pc.getReceivers().forEach(receiver => {
                if (receiver.track.kind === 'audio') {
                    receiver.track.enabled = true;
                }
            });
        });
    };

    const OffAudio = () => {
        setAudioOn(false);
        Object.values(peerConnections.current).forEach(pc => {
            pc.getReceivers().forEach(receiver => {
                if (receiver.track.kind === 'audio') {
                    receiver.track.enabled = false;
                }
            });
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Video Chat - Room {roomId}</h1>
            <div className="video-container">
                <div>
                    <video ref={localVideoRef} autoPlay muted className="local-video w-40 h-40" />
                    {
                        videoOn ?
                            <Image src={"/img/videochat/video-on.png"} alt="Video On" width={40} height={40} onClick={OffVideo}/>
                            :
                            <Image src={"/img/videochat/video-off.png"} alt="Video Off" width={40} height={40} onClick={OnVideo} />
                    }
                    {
                        micOn ?
                            <Image src={"/img/videochat/mic-on.png"} alt="Mic On" width={40} height={40} onClick={OffMic} />
                            :
                            <Image src={"/img/videochat/mic-off.png"} alt="Mic Off" width={40} height={40} onClick={OnMic} />
                    }
                    {
                        audioOn ?
                            <Image src={"/img/videochat/volume-on.png"} alt="Audio On" width={40} height={40} onClick={OffAudio} />
                            :
                            <Image src={"/img/videochat/volume-mute.png"} alt="Audio Off" width={40} height={40} onClick={OnAudio} />
                    }
                </div>
                <div ref={remoteVideoRefs} className="remote-videos"></div>
            </div>
            <button onClick={connectVideo} className="px-4 py-2 border border-black mr-2">
                Connect Video
            </button>
            <button onClick={startCall} className="px-4 py-2 border border-black">
                Start Call
            </button>
        </div>
    );
}