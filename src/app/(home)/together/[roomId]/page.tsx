"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import AvatarCanvas from "@/components/general/localVideo2"; // Update this with the correct path to AvatarCanvas
import { set } from "date-fns";
import useRoomStore from "../../../../../store/roomStore";
import Hourglass from "@/components/hourglass/hourglass";
import { Task } from '@/type/types';
import TodayTasks from "@/components/console/todayTasks";

export default function VideoChat() {
  const params = useParams();
  const remoteVideoRefs = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const roomId = params.roomId as string;
  const [users, setUsers] = useState<string[]>([]);

  const [videoOn, setVideoOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [remoteVideoAdded, setRemoteVideoAdded] = useState(false); // 원격 접속자가 있을 때만 remote video 추가
  const [clickedConnect, setClickedConnect] = useState<boolean>(false); // Connect Video 버튼 클릭 여부


  const { password } = useRoomStore(state => ({password: state.roomPassword}));
  const router = useRouter();
  const handleJoinRoom = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/together/join/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password: password}),
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        return;
      } else {router.push("/together");}
    } catch (error) {
      console.error(error);
    }
  };

  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

  const handleTaskComplete = (taskId: number) => {
    return;
  };

  const createPeerConnection = useCallback(
    (userId: string) => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit("candidate", {
            roomId,
            userId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        console.log("Remote track received from", userId);
        if (remoteVideoRefs.current) {
          let remoteVideo = document.getElementById(
            `remoteVideo-${userId}`
          ) as HTMLVideoElement;
          if (!remoteVideo) {
            remoteVideo = document.createElement("video");
            remoteVideo.id = `remoteVideo-${userId}`;
            remoteVideo.autoplay = true;
            remoteVideo.className = "remote-video w-40 h-40";
            remoteVideoRefs.current.appendChild(remoteVideo);
            setRemoteVideoAdded(true);
          }
          remoteVideo.srcObject = event.streams[0];
        }
      };

      if (localStream) {
        localStream
          .getTracks()
          .forEach((track) => pc.addTrack(track, localStream));
      }

      peerConnections.current[userId] = pc;
      return pc;
    },
    [roomId, localStream]
  );

  const handleOffer = useCallback(
    async ({
             fromUserId,
             offer,
           }: {
      fromUserId: string;
      offer: RTCSessionDescriptionInit;
    }) => {
      console.log("Received offer from", fromUserId);
      let pc = peerConnections.current[fromUserId];
      if (!pc) {
        pc = createPeerConnection(fromUserId);
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.emit("answer", {
          roomId,
          toUserId: fromUserId,
          answer,
        });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    },
    [roomId, createPeerConnection]
  );

  const handleAnswer = useCallback(
    async ({
             fromUserId,
             answer,
           }: {
      fromUserId: string;
      answer: RTCSessionDescriptionInit;
    }) => {
      console.log("Received answer from", fromUserId);
      const pc = peerConnections.current[fromUserId];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      }
    },
    []
  );

  const handleCandidate = useCallback(
    async ({
             fromUserId,
             candidate,
           }: {
      fromUserId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      const pc = peerConnections.current[fromUserId];
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error handling ICE candidate:", error);
        }
      }
    },
    []
  );

  const startCall = useCallback(async () => {
    console.log("Starting call with users:", users);
    for (const userId of users) {
      if (userId !== socketRef.current?.id) {
        let pc = peerConnections.current[userId];
        if (!pc) {
          pc = createPeerConnection(userId);
        }
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketRef.current?.emit("offer", { roomId, toUserId: userId, offer });
        } catch (error) {
          console.error("Error starting call with", userId, error);
        }
      }
    }
  }, [roomId, users, createPeerConnection]);

  const connectVideo = useCallback(async (stream: MediaStream) => {
    try {
      setLocalStream(stream);
      setVideoOn(true);
      setMicOn(true);
      setAudioOn(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;
    // handleJoinRoom()
    const newSocket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Socket.IO connection established");
      newSocket.emit("join", roomId);
    });

    newSocket.on("users", (userList: string[]) => {
      console.log("Received user list:", userList);
      setUsers(userList);
    });

    newSocket.on("offer", handleOffer);
    newSocket.on("answer", handleAnswer);
    newSocket.on("candidate", handleCandidate);

    newSocket.on("userJoined", (userId: string) => {
      console.log("User joined:", userId);
      setUsers((prevUsers) => [...prevUsers, userId]);
    });

    newSocket.on("userLeft", (userId: string) => {
      console.log("User left:", userId);
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((id) => id !== userId);
        // 자신의 제외한 통화 중인 유저가 모두 나가면 remoteVideoAdded 상태를 false로 설정
        if (updatedUsers.length === 1) {
          setRemoteVideoAdded(false);
        }
        return updatedUsers;
      });

      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close();
        delete peerConnections.current[userId];
      }
      const remoteVideo = document.getElementById(`remoteVideo-${userId}`);
      if (remoteVideo) {
        remoteVideo.remove();
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Socket.IO connection closed");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, handleOffer, handleAnswer, handleCandidate]);

  const OnVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => (track.enabled = true));
      setVideoOn(true);
    }
  };

  const OffVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => (track.enabled = false));
      setVideoOn(false);
    }
  };

  const OnMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = true));
      setMicOn(true);
    }
  };

  const OffMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = false));
      setMicOn(false);
    }
  };

  const OnAudio = () => {
    setAudioOn(true);
    Object.values(peerConnections.current).forEach((pc) => {
      pc.getReceivers().forEach((receiver) => {
        if (receiver.track.kind === "audio") {
          receiver.track.enabled = true;
        }
      });
    });
  };

  const OffAudio = () => {
    setAudioOn(false);
    Object.values(peerConnections.current).forEach((pc) => {
      pc.getReceivers().forEach((receiver) => {
        if (receiver.track.kind === "audio") {
          receiver.track.enabled = false;
        }
      });
    });
  };

  return (
    <div className="flex flex-col justify-around p-4">
      <div className="flex flex-row flex-wrap justify-center items-center">
        <div
          ref={remoteVideoRefs}
          className="remote-videos"
          style={remoteVideoAdded ? { border: "10px solid #F2CD88" } : {}}
        ></div>
        <div
          className="flex-1 flex flex-col items-center"
        >
          <h1 className="text-xl font-bold mt-3 mb-4 flex justify-center items-center">
            회일킴 드루와 - {roomId}
          </h1>
          <div className="local-video-container flex justify-center items-center h-full">
            <AvatarCanvas stream={localStream} onStreamReady={connectVideo} />
          </div>
          <div className="menu-bar flex justify-center items-center space-x-4">
            {videoOn ? (
              <Image
                src={"/img/videochat/video-on.png"}
                alt="Video On"
                width={40}
                height={40}
                onClick={OffVideo}
              />
            ) : (
              <Image
                src={"/img/videochat/video-off.png"}
                alt="Video Off"
                width={40}
                height={40}
                onClick={OnVideo}
              />
            )}
            {micOn ? (
              <Image
                src={"/img/videochat/mic-on.png"}
                alt="Mic On"
                width={40}
                height={40}
                onClick={OffMic}
              />
            ) : (
              <Image
                src={"/img/videochat/mic-off.png"}
                alt="Mic Off"
                width={40}
                height={40}
                onClick={OnMic}
              />
            )}
            {audioOn ? (
              <Image
                src={"/img/videochat/volume-on.png"}
                alt="Audio On"
                width={40}
                height={40}
                onClick={OffAudio}
              />
            ) : (
              <Image
                src={"/img/videochat/volume-mute.png"}
                alt="Audio Off"
                width={40}
                height={40}
                onClick={OnAudio}
              />
            )}
          </div>
          <div className="call-menu py-5">
            {
              clickedConnect ? (<Image
                onClick={startCall}
                src="/img/videochat/start-call.png"
                alt="Start Call"
                width={60}
                height={60}
              />) : (<Image
                onClick={() => {connectVideo(localStream!); setClickedConnect(true);}}
                src="/img/videochat/connect-video.png"
                alt="Connect Video"
                width={60}
                height={60}
              />)
            }
          </div>
        </div>
        <div className="flex flex-row max-w-[500px] justify-center items-center relative">
          <Hourglass width={220}/>
          {/* <TodayTasks tasks={todayTasks} setTasks={setTodayTasks} onTaskComplete={handleTaskComplete}/> */}
        </div>
      </div>

    </div>
  );
}