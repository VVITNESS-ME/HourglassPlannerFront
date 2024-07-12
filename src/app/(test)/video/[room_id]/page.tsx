'use client';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import LocalVideo from "@/components/general/localVideo";
import PeerVideo from "@/components/general/peerVideo";
import Hourglass from "@/components/hourglass/hourglass";
import VideoChatRoom from "@/components/together/videoChatRoom";

const VideoPage: React.FC = () => {
  const params = useParams();
  const roomId = params?.room_id;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<{[id: string]: RTCPeerConnection}>({});
  const [myId, setMyId] = useState<string>('');
  const [peerId, setPeerId] = useState<string>('');
  const [remoteStreams, setRemoteStreams] = useState<{[id: string]: MediaStream}>({});
  const signalingServerRef = useRef<WebSocket | null>(null);

  const sendToServer = (message: any) => {
    signalingServerRef.current?.send(JSON.stringify(message));
  };

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        if (!signalingServerRef.current) {
          const socketURL = "wss://jungle5105.xyz:8889/";
          const signalingServer = new WebSocket(socketURL + roomId);
          signalingServerRef.current = signalingServer;

          signalingServer.onopen = () => {
            console.log('WebSocket connection established.');
            // sendToServer({ type: 'join', roomId });
          };

          signalingServerRef.current.onmessage = (message) => {
            const data = JSON.parse(message.data);
    
            switch (data.type) {
              case 'offer':
                handleOffer(data.peerId, data.offer);
                break;
              case 'answer':
                handleAnswer(data.peerId, data.answer);
                break;
              case 'candidate':
                handleCandidate(data.peerId, data.candidate);
                break;
              case 'join':
                handleJoin(data.peerId);
                break;
              case 'peerId':
                setMyId(data.peerId);
                // setPeerId(data.peerId)
                console.log(`in function ${peerId}`);
                console.log("got myId: " + data.peerId);
                break;
              default:
                break;
            }
          };
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    startMedia();
  }, []);


  useEffect(() => {
    if (myId) {
      console.log("myId has been set: " + myId);
    }
  }, [myId]);

  const createPeerConnection = (peerId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendToServer({ type: 'candidate', candidate: event.candidate, peerId: myId });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams(prevStreams => ({ ...prevStreams, [peerId]: event.streams[0] }));
    };

    localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));

    return pc;
  };

  const handleOffer = async (peerId: string, offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection(peerId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendToServer({ type: 'answer', answer, peerId: myId});
    console.log("answer sent. myId is")
    console.log(myId);
    setPeerConnections(prevConnections => ({ ...prevConnections, [peerId]: pc }));
  };

  const handleAnswer = async (peerId: string, answer: RTCSessionDescriptionInit) => {
    const pc = peerConnections[peerId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleCandidate = async (peerId: string, candidate: RTCIceCandidateInit) => {
    const pc = peerConnections[peerId];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const handleJoin = async (peerId: string) => {
    const pc = createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendToServer({ type: 'offer', offer, peerId: myId});
    console.log("offer sent. myId is")
    console.log(myId);
    setPeerConnections(prevConnections => ({ ...prevConnections, [peerId]: pc }));
  };

  const checkMyId = () => {
    setMyId('examplePeerId');
  };

  return (
    <div className="container mx-auto max-w-fit">
      <h1>WebRTC Video Chat Room #{roomId}</h1>
      <div className="flex flex-col md:flex-row justify-evenly">
        <div className="flex flex-col w-full md:w-1/4 space-y-4">
          {Object.keys(remoteStreams).map(peerId => (
            <PeerVideo key={peerId} stream={remoteStreams[peerId]} />
          ))}
        </div>
        <div className="flex flex-col w-full md:w-2/4 p-4 justify-center">
          {/* <LocalVideo stream={localStream} onStreamReady={handleStreamReady} /> */}
        </div>
        <div className="flex flex-col w-full md:w-1/4 p-4 space-y-4"><Hourglass/></div>
      </div>
      <button onClick={checkMyId}>Set Example Peer ID</button>
    </div>
  );
};

export default VideoPage;
