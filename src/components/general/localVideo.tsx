'use client'
import { useEffect, useRef, useState, useCallback } from "react";
import FaceLandmarkManager from "../bbmode/FaceLandmarkManager";
import { useHourglassStore } from "../../../store/hourglassStore";

interface VideoProps {
    stream: MediaStream | null;
}

const LocalVideo: React.FC<VideoProps> = ({stream}) => {
  const pause = useHourglassStore((state) => state.pause);
  const setPause = useHourglassStore((state) => state.setPause);
  const setResume = useHourglassStore((state) => state.setResume);

  const bbMode = useHourglassStore((state) => state.bbMode);

  let timeDoze = 0;
  let timeMia = 0;
  let timeSober = 0;

  const lastVideoTimeRef = useRef(-1);
  const requestRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  const [videoSize, setVideoSize] = useState<{
      width: number;
      height: number;
    }>();
  
  const animate = useCallback(() => {
  if (
      videoRef.current &&
      videoRef.current.currentTime !== lastVideoTimeRef.current
  ) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      try {
      if (drawCanvasRef.current) {
      drawCanvasRef.current.width = videoSize!.width;
      drawCanvasRef.current.height = videoSize!.height;
      const faceLandmarkManager = FaceLandmarkManager.getInstance();
      faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
      const faceStatus = faceLandmarkManager.drawLandmarks(drawCanvasRef.current);
      if (faceStatus == 1) { // 눈감음
          timeDoze++;
          // console.log("timeDoze: " + timeDoze);
          if (timeDoze > 50) {setPause(); timeSober = 0;}
      }
      else if (faceStatus == 2) { // 자리이탈
          timeMia++;
          // console.log("timeMia: " + timeMia);
          if (timeMia > 50) {setPause(); timeSober = 0}
      }
      else { // 정상상태
        {
          timeSober++;
          // console.log("timesober: " + timeSober);
          if (timeSober > 25) {
            setResume();
            timeSober = 0;
            timeDoze = 0;
            timeMia = 0;
          }
        }
      }
      
      }
      } catch (e) {
      console.log(e);
      }
  }
  requestRef.current = requestAnimationFrame(animate);
  },[videoSize?.width, videoSize?.height]);
  
  useEffect (() => {
      if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
              setVideoSize({
                width: videoRef.current!.offsetWidth,
                height: videoRef.current!.offsetHeight,
              });
              videoRef.current!.play();
  
              // Start animation once video is loaded
              requestRef.current = requestAnimationFrame(animate);
          }
      }
      return () => cancelAnimationFrame(requestRef.current);
  }, [stream, animate])

  return (
    <div className="flex justify-center">
    <video
      className="w-full h-auto"
      ref={videoRef}
      loop={true}
      muted={true}
      autoPlay={true}
      playsInline={true}
    ></video>
    {videoSize && (
      <canvas
      className="absolute"
      style={{ width: videoSize.width, height: videoSize.height}}
      ref={drawCanvasRef}
    ></canvas>
    )}
  </div>
  )
}

export default LocalVideo;