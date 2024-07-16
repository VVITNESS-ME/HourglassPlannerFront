'use client';
import * as THREE from 'three'; // THREE 네임스페이스 불러오기
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { OrbitControls, Float, Text3D } from "@react-three/drei";
import AvatarManager from "@/components/together/facelandmark-demo/class/AvatarManager";
import FaceLandmarkManager from '../bbmode/FaceLandmarkManager';
import { useHourglassStore } from '../../../store/hourglassStore';

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

  const width = 600; // width를 컴포넌트 내부에서 정의
  const height = 400; // height를 컴포넌트 내부에서 정의
  const url = "https://models.readyplayer.me/66922d78d77fc1238cb520a1.glb"; // 모델 URL을 컴포넌트 내부에서 정의

  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const avatarManagerRef = useRef<AvatarManager>(AvatarManager.getInstance());
  const requestRef = useRef(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastVideoTimeRef = useRef(-1);

  const animate = useCallback(() => {
    if (
      videoRef.current &&
      videoRef.current.currentTime !== lastVideoTimeRef.current
    ) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      try {
        const faceLandmarkManager = FaceLandmarkManager.getInstance();
        faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
        const results = faceLandmarkManager.getResults();
        avatarManagerRef.current.updateFacialTransforms(results, true);
        
        const faceStatus = avatarManagerRef.current.updateFacialTransforms(results, true);

        if (faceStatus == 1) { // 눈감음
          timeDoze++;
          if (timeDoze > 50) { setPause(); timeSober = 0}
        } else if (faceStatus == 3) { // 자리이탈
          timeMia++;
          if (timeMia > 50) { setPause(); timeSober = 0}
        } else { // 정상상태
          timeSober++;
          if (timeSober > 25) {
            setResume();
            timeSober = 0;
            timeDoze = 0;
            timeMia = 0;
          }
        }

      } catch (e) {
        console.log(e);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const getUserCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current!.play();
            requestRef.current = requestAnimationFrame(animate);
          };
        }
      } catch (e) {
        console.log(e);
        alert("Failed to load webcam!");
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



  return (
    <div className="flex justify-center relative" style={{ width: width, height: height }}>
      <video
        className='w-full h-auto'
        ref={videoRef}
        loop={true}
        muted={true}
        autoPlay={true}
        playsInline={true}
        style={{
          transform: 'scaleX(-1)' // 비디오 화면 좌우 반전
        }}
      />
      <div className="absolute" style={{ width: width, height: height }}>
        <Canvas camera={{ fov: 30, position: [0, 0.5, 1] }}>
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
    </div>
  );
};

export default AvatarCanvas;
