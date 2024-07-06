'use client';
import { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

const socket = io('https://jungle5105.xyz:12346', {
    withCredentials: true,
    transports: ['websocket'],
});

// TODO: 일단 들어오는 사람 전부 1방에 몰아넣기

export default function TestPage() {
    const [room, setRoom] = useState("");
    const [rooms, setRooms] = useState<string[]>([]);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        socket.on('room_created', (data) => {
            console.log('Room created:', data.room);
        });

        socket.on('room_joined', (data) => {
            console.log('Room joined:', data.room);
        });

        socket.on('signal', async (data) => {
            if (peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.signalData));
                    if (data.signalData.type === 'offer') {
                        const answer = await peerConnectionRef.current.createAnswer();
                        await peerConnectionRef.current.setLocalDescription(answer);
                        socket.emit('signal', { room, signalData: answer });
                    }
                } catch (error) {
                    console.error('Error handling signal:', error);
                }
            }
        });

        return () => {
            socket.off('room_created');
            socket.off('room_joined');
            socket.off('signal');
        };
    }, []);

    const createRoom = () => {
        if (room) {
            setRooms([...rooms, room]);
            socket.emit('create_room', { room });
            initializePeerConnection();
        }
    };

    const joinRoom = (room: string) => {
        console.log("Joining room: ", room);
        socket.emit('join_room', { room });
        initializePeerConnection();
    };

    const initializePeerConnection = async () => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302',
                },
            ],
        });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('signal', { room, signalData: event.candidate });
            }
        };

        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('signal', { room, signalData: offer });
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }

        peerConnectionRef.current = peerConnection;
    };

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4">
                <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Enter room number"
                    className="border p-2"
                />
                <button onClick={createRoom} className="ml-2 p-2 bg-blue-500 text-white">
                    Create Room
                </button>
            </div>
            <div>
                {rooms.map((room, index) => (
                    <button
                        key={index}
                        onClick={() => joinRoom(room)}
                        className="m-2 p-2 bg-green-500 text-white"
                    >
                        Join Room {room}
                    </button>
                ))}
            </div>
            <div className="video-container">
                <video ref={localVideoRef} autoPlay muted className="local-video" />
                <video ref={remoteVideoRef} autoPlay className="remote-video" />
            </div>
        </div>
    );
}