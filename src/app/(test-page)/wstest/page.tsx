'use client';
import { useState, useEffect, useRef } from 'react';

const socketURL = "wss://jungle5105.xyz:12345/1";
// const socketURL = "wss://jungle5105.xyz:12345/room1";
// wss://jungle5105.xyz:12345/room1

export default function TestWS() {
    const [isSocketOpen, setIsSocketOpen] = useState(false);
    const socketRef = useRef<WebSocket|null>(null);

    useEffect(() => {
        const socket = new WebSocket(socketURL);
        socketRef.current = socket;

        socket.onopen = function(event) {
            setIsSocketOpen(true);
            console.log("WebSocket is open now.");
        };

        socket.onmessage = function(event) {
            console.log("WebSocket message received:", event);
        };

        socket.onclose = function(event) {
            setIsSocketOpen(false);
            console.log("WebSocket is closed now.");
        };

        socket.onerror = function(error) {
            console.error("WebSocket error observed:", error);
        };

        // Clean up the socket connection when the component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    function sendToSignal() {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const message = {
                type: "message",
                content: "Hello, World!"
            };
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.error("WebSocket is not open. Ready state is: " + (socketRef.current ? socketRef.current.readyState : "null"));
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Test WebSocket</h1>
            <button 
                onClick={sendToSignal} 
                disabled={!isSocketOpen}
                className={`px-4 py-2 border border-black ${!isSocketOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Send Message
            </button>
        </div>
    );
}