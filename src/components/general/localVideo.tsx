'use client'
import { useEffect, useRef } from "react";

interface VideoProps {
    stream: MediaStream | null;
}

const LocalVideo: React.FC<VideoProps> = ({stream}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect (() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream])

    return (
        <video className="w-1/3 h-1/3" ref={videoRef} autoPlay playsInline />
    )
}

export default LocalVideo;