'use client'
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from 'react';
import LocalVideo from "@/components/general/localVideo";
import PeerVideo from "@/components/general/peerVideo";
import Hourglass from "@/components/hourglass/hourglass";
import VideoChatRoom from "@/components/together/videoChatRoom";


const VideoPage: React.FC = () => {
  const params = useParams();
  const roomId = params?.room_id;
  let myId: string = "";
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const signalingServerRef = useRef<WebSocket | null>(null);

  const sendToServer = (message: any) => {
    signalingServerRef.current?.send(JSON.stringify(message));
  };

  const closeExistingPeerConnection = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      setRemoteStream(null);
      console.log('Existing peer connection closed.');
    }
  };

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setLocalStream(stream);
        const pc = new RTCPeerConnection(
          {
          iceServers: [
          {urls: 'stun:stun.l.google.com:19302',},
          ],
        }
        );

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            sendToServer({ type: 'candidate', candidate: event.candidate });
          }
        };

        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };

        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        setPeerConnection(pc);
        console.log(peerConnection)
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    if (!signalingServerRef.current) {
      const socketURL = "wss://jungle5105.xyz:8889/";
      const signalingServer = new WebSocket(socketURL + roomId);
      signalingServerRef.current = signalingServer;

      signalingServer.onopen = () => {
        console.log('WebSocket connection established.');
      };
      startMedia();
    }
    else {
      closeExistingPeerConnection();
      startMedia();
    }

  }, []);
  
  const createOffer = async () => {
    if (peerConnection) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      sendToServer({ type: 'offer', offer });
    }
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      sendToServer({ type: 'answer', answer });
    }
  };

  // Handle messages from signaling server
  useEffect(() => {
    console.log(peerConnection)
    const handleMessage = (message: any) => {
      const data = JSON.parse(message.data);

      if (data.type === 'offer') {
        createAnswer(data.offer);
      } else if (data.type === 'answer') {
        peerConnection?.setRemoteDescription(data.answer);
      } else if (data.type === 'candidate') {
        const candidate = new RTCIceCandidate(data.candidate);
        peerConnection?.addIceCandidate(candidate);
      } else if (data.type === 'peerId') {
        myId = data.peerId;
      }
    };
    if (signalingServerRef.current) signalingServerRef.current.onmessage = handleMessage;

  }, [peerConnection]);

  function logpeer() {
    console.log(peerConnection);
    return;
  }

  return (
    <div className="container mx-auto max-w-fit">
      <h1>WebRTC Video Chat Room #{roomId}</h1>
      <button onClick={createOffer}>Start Call</button>
      <div className="flex flex-col md:flex-row justify-evenly">
        <div className="flex flex-col w-full md:w-1/4 space-y-4">
          <PeerVideo stream={remoteStream} />
        </div>
        <div className="flex flex-col w-full md:w-2/4 p-4 justify-center">
          <LocalVideo stream={localStream} />
        </div>
        <div className="flex flex-col w-full md:w-1/4 p-4 space-y-4"><Hourglass/></div>
      </div>
      <button onClick={logpeer}>check console to see peerConnection</button>

    </div>
  );
};

export default VideoPage;