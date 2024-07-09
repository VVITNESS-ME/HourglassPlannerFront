'use client'
import { useEffect, useRef, useState, useCallback } from "react";
import FaceLandmarkManager from "../bbmode/FaceLandmarkManager";
import DrawLandmarkCanvas from "../bbmode/DrawLandmarkCanvas";

interface VideoProps {
    stream: MediaStream | null;
}

const LocalVideo: React.FC<VideoProps> = ({stream}) => {
    const lastVideoTimeRef = useRef(-1);
    const requestRef = useRef(0);
    const videoRef = useRef<HTMLVideoElement>(null);

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
        const faceLandmarkManager = FaceLandmarkManager.getInstance();
        faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
        } catch (e) {
        console.log(e);
        }
    }
    requestRef.current = requestAnimationFrame(animate);
    },[]);
    
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
            <DrawLandmarkCanvas
              width={videoSize.width}
              height={videoSize.height}
            />
      )}
    </div>
    )
}

export default LocalVideo;