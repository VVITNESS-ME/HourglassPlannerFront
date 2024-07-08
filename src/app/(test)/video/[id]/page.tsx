'use client'
import { useParams } from "next/navigation";
import React, { useState, useEffect } from 'react';
import LocalVideo from "@/components/general/localVideo";
import PeerVideo from "@/components/general/peerVideo";
import Hourglass from "@/components/hourglass/hourglass";

const socketURL = "wss://hourglass.ninja:8889/";
const signalingServer = new WebSocket(socketURL);
const sendToServer = (message: any) => {
  signalingServer.send(JSON.stringify(message));
};

signalingServer.onopen = () => {
  console.log('WebSocket connection established.');
};

const VideoPage: React.FC = () => {
  const params = useParams();
  const roomId = params?.id;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

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

    startMedia();
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
    const handleMessage = (message: any) => {
      const data = JSON.parse(message.data);

      if (data.type === 'offer') {
        createAnswer(data.offer);
      } else if (data.type === 'answer') {
        peerConnection?.setRemoteDescription(data.answer);
      } else if (data.type === 'candidate') {
        const candidate = new RTCIceCandidate(data.candidate);
        peerConnection?.addIceCandidate(candidate);
      }
    };

    signalingServer.onmessage = handleMessage;

  }, [peerConnection]);

  return (
    <div className="items-center justify-center">
      <h1>WebRTC Video Chat Room #{roomId}</h1>
      <button onClick={createOffer}>Start Call</button>
      <div className="items-center justify-between">
        <div className="flex absolute">
          <PeerVideo stream={remoteStream} />
        </div>
        <div className="flex absolute w-screen items-center justify-center">
          <LocalVideo stream={localStream} />
        </div>
        <div className="flax absolute right-0"><Hourglass /></div>
      </div>
    </div>
  );
};

export default VideoPage;