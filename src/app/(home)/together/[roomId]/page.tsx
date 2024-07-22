"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import AvatarCanvas from "@/components/general/localVideo2"; // Update this with the correct path to AvatarCanvas
import useRoomStore from "../../../../../store/roomStore";
import Hourglass from "@/components/hourglass/hourglass";
import { Task } from "@/type/types";
import useTitleStore from "../../../../../store/titleStore";

type User = {
  userId: string;
  userName: string;
  mainTitle: string;
};

export default function VideoChat() {
  const params = useParams();
  const remoteVideoRefs = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const roomId = params.roomId as string;
  const [users, setUsers] = useState<User[]>([]);

  const [videoOn, setVideoOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const [remoteVideoAdded, setRemoteVideoAdded] = useState(false); // 원격 접속자가 있을 때만 remote video 추가
  const [clickedConnect, setClickedConnect] = useState<boolean>(false); // Connect Video 버튼 클릭 여부

  const { password } = useRoomStore((state) => ({
    password: state.roomPassword,
  }));

  const { userName, mainTitle, fetchTitles } = useTitleStore();

  const router = useRouter();

  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

  const handleTaskComplete = useCallback((taskId: number) => {
    return;
  }, []);

  const createPeerConnection = useCallback(
    (userId: string) => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
        ],
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
            remoteVideo.playsInline = true;
            remoteVideo.className = "remote-video w-40 h-40";

            const user = users.find((user) => user.userId === userId);

            // 사용자 이름과 칭호를 추가
            const userInfo = document.createElement("div");
            userInfo.id = `userInfo-${userId}`;
            userInfo.innerHTML = user?.mainTitle
              ? `<p>${user.userName}</p><br/><p>${user.mainTitle}</p>`
              : `<p>${user?.userName}</p>`;

            remoteVideoRefs.current.appendChild(remoteVideo);
            remoteVideoRefs.current.appendChild(userInfo);

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
    [roomId, localStream, users]
  );

  const handleJoinRoom = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/together/join/${roomId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: password }),
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        return;
      } else {
        router.push("/together");
      }
    } catch (error) {
      console.error(error);
    }
  }, [roomId, password, router]);

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
    for (const user of users) {
      if (user.userId !== socketRef.current?.id) {
        let pc = peerConnections.current[user.userId];
        if (!pc) {
          pc = createPeerConnection(user.userId);
        }
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketRef.current?.emit("offer", {
            roomId,
            toUserId: user.userId,
            offer,
          });
        } catch (error) {
          console.error("Error starting call with", user.userId, error);
        }
      }
    }
  }, []);

  // 특정 userId에게 통화 시작
  const startCallWithUser = useCallback(
    async (userId: string) => {
      console.log("Starting call with user:", userId);
      let pc = peerConnections.current[userId];
      if (!pc) {
        pc = createPeerConnection(userId);
      }
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit("offer", {
          roomId,
          toUserId: userId,
          offer,
        });
      } catch (error) {
        console.error("Error starting call with", userId, error);
      }
    },
    []
  );

  const connectVideo = useCallback(
    async (stream: MediaStream) => {
      try {
        setLocalStream(stream);
        setVideoOn(true);
        setMicOn(true);
        setAudioOn(true);
        startCall(); // 비디오가 연결되면 자동으로 통화 시작
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    },
    []
  );

  useEffect(() => {
    if (!roomId) return;
    handleJoinRoom();
    // const newSocket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string); // polling -> websocket 방식
    const newSocket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, { // 바로 websocket 방식
      transports: ["websocket"],
      upgrade: false,
    });
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Socket.IO connection established");
      newSocket.emit("join", { roomId, userName, mainTitle });
    });

    newSocket.on("users", (userList: User[]) => {
      console.log("Received user list:", userList);
      setUsers(userList);
      // user list를 받으면 자동으로 통화시작
      if (localStream) {
        startCall();
      }
    });

    newSocket.on("offer", handleOffer);
    newSocket.on("answer", handleAnswer);
    newSocket.on("candidate", handleCandidate);

    newSocket.on("userJoined", ({ userId, userName, mainTitle }) => {
      console.log("User joined:", userId);
      setUsers((prevUsers) => [...prevUsers, { userId, userName, mainTitle }]);
      // Start call with the new user
      if (localStream) {
        startCallWithUser(userId);
      }
    });

    newSocket.on("userLeft", (userId: string) => {
      console.log("User left:", userId);
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user.userId !== userId);
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
      const userInfo = document.getElementById(`userInfo-${userId}`);
      if (remoteVideo) {
        remoteVideo.remove();
      }
      if (userInfo) {
        userInfo.remove();
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Socket.IO connection closed");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, handleOffer, handleAnswer, handleCandidate]); // 여기 잘못 건들면 통화 터져요

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
      <div className="flex flex-wrap justify-center">
        <div
          ref={remoteVideoRefs}
          className="remote-videos"
          style={remoteVideoAdded ? { border: "10px solid #F2CD88" } : {}}
        ></div>
        <div className="flex flex-col items-center max-w-[600px]">
          <h1 className="text-xl font-bold mt-3 mb-4 flex justify-center items-center">
            Video Chat - Room {roomId}
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
            {clickedConnect ? (
              <Image
                onClick={startCall}
                src="/img/videochat/start-call.png"
                alt="Start Call"
                width={60}
                height={60}
              />
            ) : (
              <Image
                onClick={() => {
                  connectVideo(localStream!);
                  setClickedConnect(true);
                }}
                src="/img/videochat/connect-video.png"
                alt="Connect Video"
                width={60}
                height={60}
              />
            )}
          </div>
        </div>
        <div className="flex flex-row w-[400px] justify-center items-center relative">
          <Hourglass width={200} />
          {/* <TodayTasks tasks={todayTasks} setTasks={setTodayTasks} onTaskComplete={handleTaskComplete}/> */}
        </div>
      </div>
    </div>
  );
}
