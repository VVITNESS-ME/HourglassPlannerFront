'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import FaceLandmarkManager from '../bbmode/FaceLandmarkManager';
import { useHourglassStore } from '../../../store/hourglassStore';

interface VideoProps {
  stream: MediaStream | null;
  onStreamReady: (stream: MediaStream) => void;
}

const LocalVideo: React.FC<VideoProps> = ({ stream, onStreamReady }) => {
  const pause = useHourglassStore((state) => state.pause);
  const setPause = useHourglassStore((state) => state.setPause);
  const setResume = useHourglassStore((state) => state.setResume);

  let timeDoze = 0;
  let timeMia = 0;
  let timeSober = 0;

  const lastVideoTimeRef = useRef(-1);
  const requestRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const combinedCanvasRef = useRef<HTMLCanvasElement>(null);
  const [videoSize, setVideoSize] = useState<{ width: number; height: number }>();

  const imgRef = useRef<HTMLImageElement>(null); // 이미지 참조 추가
  const [showImage, setShowImage] = useState(false); // 이미지 표시 상태

  const animate = useCallback(() => {
    if (videoRef.current && videoRef.current.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      try {
        if (drawCanvasRef.current && combinedCanvasRef.current) {
          drawCanvasRef.current.width = videoSize!.width;
          drawCanvasRef.current.height = videoSize!.height;
          combinedCanvasRef.current.width = videoSize!.width;
          combinedCanvasRef.current.height = videoSize!.height;

          const faceLandmarkManager = FaceLandmarkManager.getInstance();
          faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
          const faceStatus = faceLandmarkManager.drawLandmarks(drawCanvasRef.current);

          const ctx = combinedCanvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, combinedCanvasRef.current.width, combinedCanvasRef.current.height);
            ctx.drawImage(videoRef.current, 0, 0, videoSize!.width, videoSize!.height);
            ctx.drawImage(drawCanvasRef.current, 0, 0, videoSize!.width, videoSize!.height);

            // 이미지 그리기
            if (showImage && imgRef.current) {
              ctx.drawImage(imgRef.current, 0, 0, videoSize!.width, videoSize!.height);
            }
          }

          if (faceStatus == 1) { // 눈감음
            timeDoze++;
            if (timeDoze > 50) { setPause(); timeSober = 0; setShowImage(true); }
          } else if (faceStatus == 2) { // 자리이탈
            timeMia++;
            if (timeMia > 50) { setPause(); timeSober = 0; setShowImage(true); }
          } else { // 정상상태
            timeSober++;
            if (timeSober > 25) {
              setResume();
              timeSober = 0;
              timeDoze = 0;
              timeMia = 0;
              setShowImage(false); // 정상 상태로 돌아가면 이미지 숨김
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [videoSize?.width, videoSize?.height, showImage]);

  useEffect(() => {
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

        // Create merged stream
        if (combinedCanvasRef.current) {
          const combinedStream = combinedCanvasRef.current.captureStream(30);

          // Add audio tracks if any
          stream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));

          onStreamReady(combinedStream);
        }
      };
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [stream, animate, onStreamReady]);

  return (
    <div className="flex justify-center relative">
      <video
        className="w-full h-auto"
        ref={videoRef}
        loop={true}
        muted={true}
        autoPlay={true}
        playsInline={true}
      ></video>
      {videoSize && (
        <>
          <canvas
            className="hidden"
            ref={drawCanvasRef}
          ></canvas>
          <canvas
            className="absolute top-0 left-0"
            style={{ width: videoSize.width, height: videoSize.height }}
            ref={combinedCanvasRef}
          ></canvas>
          <img
            ref={imgRef}
            src="/img/sleep.JPG"
            alt="Alert"
            style={{ display: 'none' }}
          />
        </>
      )}
    </div>
  );
};

export default LocalVideo;