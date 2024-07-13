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
  const [peerConnections, setPeerConnections] = useState<{[peerId: string]:RTCPeerConnection}>({});
  // const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const signalingServerRef = useRef<WebSocket | null>(null);

  const sendToServer = (message: any) => {
    signalingServerRef.current?.send(JSON.stringify(message));
  };

  // const closeExistingPeerConnection = () => {
  //   if (peerConnection) {
  //     peerConnection.close();
  //     setPeerConnection(null);
  //     setRemoteStream(null);
  //     console.log('Existing peer connection closed.');
  //   }
  // };

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setLocalStream(stream);
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
    // else {
    //   closeExistingPeerConnection();
    //   startMedia();
    // }

  }, []);
  
  const createOffer = async () => {
    if (peerConnections) {
      Object.keys(peerConnections).forEach(async (peerId) => {
        const offer = await peerConnections[peerId].createOffer();
      await peerConnections[peerId].setLocalDescription(offer);
      sendToServer({ type: 'offer', offer });
      })
    }
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit, pc: RTCPeerConnection) => {
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendToServer({ type: 'answer', answer });
  };

  // Handle messages from signaling server
  useEffect(() => {
    
    const handleMessage = (message: any) => {
      const data = JSON.parse(message.data);

      if (data.type === 'offer') {
        if (!peerConnections[data.peerId]) {
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
      
          if (localStream) {
          localStream.getTracks().forEach(track => pc.addTrack(track, localStream));}
      
          setPeerConnections(prevConn => ({...prevConn, [data.peerId]: pc}))
          createAnswer(data.offer, pc);
        }
        else {createAnswer(data.offer, peerConnections[data.peerId])}
      }
      // answer를 받았을때
      else if (data.type === 'answer') {
        peerConnections[data.peerId]?.setRemoteDescription(data.answer);
      }
      // candidate를 받았을때
      else if (data.type === 'candidate') {
        const candidate = new RTCIceCandidate(data.candidate);
        peerConnections[data.peerId]?.addIceCandidate(candidate);
      } else if (data.type === 'peerId') {
        myId = data.peerId;
      } else if (data.type === 'join') {
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
    
        if (localStream) {
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));}
    
        setPeerConnections(prevConn => ({...prevConn, [data.peerId]: pc}))
    
      }
    };
    if (signalingServerRef.current) signalingServerRef.current.onmessage = handleMessage;

  }, [peerConnections]);

  function logpeer() {
    console.log(peerConnections);
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