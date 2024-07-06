'use client'
import React, { useState, useEffect } from 'react';
import Video from '@/components/general/video';
import { sendToServer } from '@/components/general/signaling';

const VideoPage: React.FC = () => {
  const socketURL = "wss://hourglass.ninja:8889"
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setLocalStream(stream);
        const pc = new RTCPeerConnection();

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
      console.log("OFFER!");
      sendToServer({ type: 'offer', offer });
    }
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log("ANSWER!");
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
        console.log("CANDIDATE!");
        peerConnection?.addIceCandidate(candidate);
      }
    };

    const signalingServer = new WebSocket(socketURL);
    signalingServer.onmessage = handleMessage;

    return () => {
      signalingServer.close();
    };
  }, []);

  return (
    <div>
      <h1>WebRTC Video Chat</h1>
      <button onClick={createOffer}>Start Call</button>
      <div className='flex flex-row justify-between'>
        <Video stream={localStream} />
        <Video stream={remoteStream} />
      </div>
    </div>
  );
};

export default VideoPage;