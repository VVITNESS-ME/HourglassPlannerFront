// AvatarCanvas.tsx
"use client";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { OrbitControls, Float, Text3D } from "@react-three/drei";
import AvatarManager from "@/components/together/facelandmark-demo/class/AvatarManager";
import { useHourglassStore } from "../../../store/hourglassStore";
import { flattenJSON } from "three/src/animation/AnimationUtils.js";

interface VideoProps {
  stream: MediaStream | null;
  onStreamReady: (stream: MediaStream) => void;
}

const AvatarCanvas: React.FC<VideoProps> = ({ stream, onStreamReady }) => {
  const setPause = useHourglassStore((state) => state.setPause);
  const setResume = useHourglassStore((state) => state.setResume);
  let timeDoze = 0;
  let timeMia = 0;
  let timeSober = 0;

  const width = 500; // width를 컴포넌트 내부에서 정의
  const height = 400; // height를 컴포넌트 내부에서 정의
  const url = "https://models.readyplayer.me/66922d78d77fc1238cb520a1.glb"; // 모델 URL을 컴포넌트 내부에서 정의

  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAvatar, setShowAvatar] = useState(false); // 아바타 표시 여부 상태 추가
  const avatarManagerRef = useRef<AvatarManager>(AvatarManager.getInstance());
  const requestRef = useRef(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const combinedCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isPausedRef = useRef(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastVideoTimeRef = useRef(-1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animate = useCallback(() => {
    if (
      videoRef.current &&
      videoRef.current.currentTime !== lastVideoTimeRef.current
    ) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      try {
        // FaceLandmarkManager가 CSR로만 실행되도록 설정 - unhandledRejection: ReferenceError: document is not defined 에러 수정
        const FaceLandmarkManager =
          require("../bbmode/FaceLandmarkManager").default;
        const faceLandmarkManager = FaceLandmarkManager.getInstance();
        faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
        const results = faceLandmarkManager.getResults();
        const faceStatus = avatarManagerRef.current.updateFacialTransforms(
          results,
          true
        );

        if (faceStatus == 1) {
          // console.log("눈감음");
          // 눈감음
          timeDoze++;
          if (timeDoze > 50) {
            if(!isPausedRef.current){
              setPause();
              isPausedRef.current = true;
            }
            if (!showAvatar) {
              setShowAvatar(true); // 아바타 표시
              if (audioRef.current) audioRef.current.play();
            }
            timeSober = 0;
          }
        } else if (faceStatus == 3) {
          // console.log("자리이탈");
          // 자리이탈
          timeMia++;
          if (timeMia > 50) {
            if(!isPausedRef.current){
              setPause();
              isPausedRef.current = true;
            }
            /*
            if (!showAvatar) {
              setShowAvatar(true); // 아바타 표시
              if (audioRef.current) audioRef.current.play();
            }
            */
            timeSober = 0;
          }
        } else {
          // console.log("정상상태");
          // 정상상태
          timeSober++;
          // console.log(timeSober);
          if (timeSober > 25) {
            if (isPausedRef.current) {
              setResume();
              isPausedRef.current = false;
            }
            if (audioRef.current) {audioRef.current.pause(); audioRef.current.currentTime = 0;}
            timeDoze = 0;
            timeMia = 0;
          }
          if (timeSober > 200) {
            setShowAvatar(false); // 아바타 숨기기
            timeSober = 0;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [showAvatar, setPause, setResume]);

  useEffect(() => {
    const getUserCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current!.play();
            requestRef.current = requestAnimationFrame(animate);
          };
        }
        streamRef.current = stream; // 스트림을 저장해 둡니다.
      } catch (e) {
        console.log(e);
        alert("Failed to load webcam or microphone!");
      }
    };
    getUserCamera();

    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  useEffect(() => {
    setIsLoading(true);
    const avatarManager = AvatarManager.getInstance();
    avatarManager
      .loadModel(url)
      .then(() => {
        setScene(avatarManager.getScene());
        setIsLoading(false);
      })
      .catch((e) => {
        alert(e);
      });
  }, [url]);

  useEffect(() => {
    if (combinedCanvasRef.current) {
      const canvasStream = combinedCanvasRef.current.captureStream();
      // Get the audio track from the original user media stream
      const audioTrack =
        videoRef.current?.srcObject instanceof MediaStream
          ? videoRef.current.srcObject.getAudioTracks()[0]
          : null;
      if (audioTrack) {
        // Add the audio track to the canvas stream
        canvasStream.addTrack(audioTrack);
      }

      streamRef.current = canvasStream;
      onStreamReady(canvasStream);
    }
  }, [isLoading, onStreamReady]);

  const Renderer = () => {
    const { gl, scene, camera } = useThree();
    useEffect(() => {
      rendererRef.current = gl;
      const render = () => {
        if (showAvatar&& combinedCanvasRef.current && videoRef.current) {
          const ctx = combinedCanvasRef.current.getContext("2d");
          if (ctx) {
            ctx.save();
            ctx.scale(-1, 1); // X 축을 반전시킴
            ctx.translate(-width, 0); // 반전된 X축으로 인해 위치 보정
            ctx.drawImage(videoRef.current, 0, 0, width, height);
            ctx.restore();
            gl.render(scene, camera);
            ctx.drawImage(gl.domElement, 0, 0, width, height);
          }
        }
        requestAnimationFrame(render);
      };
      render();
    }, [gl, scene, camera]);
    return null;
  };

  return (
    <div
      className="flex justify-center relative"
      style={{ width: width, height: height }}
    >
      <video
        className="w-full h-auto"
        ref={videoRef}
        loop={true}
        muted={true}
        autoPlay={true}
        playsInline={true}
        style={{
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
        }}
      />
      <canvas
        ref={combinedCanvasRef}
        width={width}
        height={height}
        style={{ display: "none" }}
      />
      <div className="absolute" style={{ width: width, height: height }}>
        <Canvas camera={{ fov: 30, position: [0, 0.5, 1] }}>
          <Renderer />
          <ambientLight />
          <directionalLight />
          <OrbitControls
            target={[0, 0.6, 0]}
            enableDamping={false}
            enableRotate={false}
            enableZoom={false}
            enablePan={false}
          />
          {showAvatar && scene && <primitive object={scene} />}
          {isLoading && (
            <Float floatIntensity={1} speed={1}>
              <Text3D
                font={"../assets/fonts/Open_Sans_Condensed_Bold.json"}
                scale={0.05}
                position={[-0.1, 0.6, 0]}
                bevelEnabled
                bevelSize={0.05}
              >
                Loading...
                <meshNormalMaterial />
              </Text3D>
            </Float>
          )}
        </Canvas>
      </div>
      <div style={{ display: "hidden" }}>
        <audio ref={audioRef}>
          <source src="../wakeupCall.wav" type="audio/wav" />
        </audio>
      </div>
    </div>
  );
};

export default AvatarCanvas;