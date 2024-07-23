"use client";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { OrbitControls, Float, Text3D } from "@react-three/drei";
import AvatarManager from "@/components/together/facelandmark-demo/class/AvatarManager";
import { useHourglassStore } from "../../../store/hourglassStore";

interface VideoProps {
  stream: MediaStream | null;
  onStreamReady: (stream: MediaStream) => void;
}

const AvatarCanvas: React.FC<VideoProps> = ({ stream, onStreamReady }) => {
  const pause = useHourglassStore((state) => state.pause);
  const setPause = useHourglassStore((state) => state.setPause);
  const setResume = useHourglassStore((state) => state.setResume);
  let timeDoze = 0;
  let timeMia = 0;
  let timeSober = 0;
  let timeSober2 = 0;

  const width = 500;
  const height = 400;
  const url = "https://models.readyplayer.me/66922d78d77fc1238cb520a1.glb";

  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const avatarManagerRef = useRef<AvatarManager>(AvatarManager.getInstance());
  const requestRef = useRef(0);
  const combinedCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastVideoTimeRef = useRef(-1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    avatarManagerRef.current.setAvatarVisibility(false);
  }, []);

  const animate = useCallback(() => {
    if (videoRef.current && videoRef.current.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      try {
        const FaceLandmarkManager = require("../bbmode/FaceLandmarkManager").default;
        const faceLandmarkManager = FaceLandmarkManager.getInstance();
        faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
        const results = faceLandmarkManager.getResults();
        const faceStatus = avatarManagerRef.current.updateFacialTransforms(results, true);

        if (faceStatus == 1) {
          timeDoze++;
          if (timeDoze > 50) {
            setPause();
            avatarManagerRef.current.setAvatarVisibility(true);
            if (audioRef.current) audioRef.current.play();
            timeSober = 0;
          }
        } else if (faceStatus == 3) {
          timeMia++;
          if (timeMia > 50) {
            setPause();
            timeSober = 0;
          }
        } else {
          timeSober++;
          timeSober2++;
          if (timeSober > 25) {
            setResume();
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            timeDoze = 0;
            timeMia = 0;
            timeSober = 0;
          }
          if (timeSober2 > 250) {
            avatarManagerRef.current.setAvatarVisibility(false);
            timeSober2 = 0;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [setPause, setResume, timeDoze, timeMia, timeSober, timeSober2]);

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
        streamRef.current = stream;
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
      const audioTrack =
        videoRef.current?.srcObject instanceof MediaStream
          ? videoRef.current.srcObject.getAudioTracks()[0]
          : null;
      if (audioTrack) {
        canvasStream.addTrack(audioTrack);
      }
      streamRef.current = canvasStream;
      onStreamReady(canvasStream);
    }
  }, [isLoading, onStreamReady]);

  const Renderer = () => {
    const { gl, scene, camera } = useThree();
    useFrame(() => {
      if (combinedCanvasRef.current && videoRef.current) {
        const ctx = combinedCanvasRef.current.getContext("2d");
        if (ctx) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-width, 0);
          ctx.drawImage(videoRef.current, 0, 0, width, height);
          ctx.restore();
          gl.render(scene, camera);
          ctx.drawImage(gl.domElement, 0, 0, width, height);
        }
      }
    });
    return null;
  };

  return (
    <div className="flex justify-center relative" style={{ width: width, height: height }}>
      <video
        className="w-full h-auto"
        ref={videoRef}
        loop={true}
        muted={true}
        autoPlay={true}
        playsInline={true}
        style={{
          position: "absolute",
          zIndex: 0,
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
      <div className="absolute" style={{ width: width, height: height, zIndex: 1 }}>
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
          {scene && <primitive object={scene} />}
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
      <div style={{ display: "none" }}>
        <audio ref={audioRef}>
          <source src="../wakeupCall.wav" type="audio/wav" />
        </audio>
      </div>
    </div>
  );
};

export default AvatarCanvas;
