'use client'
import { useEffect, useRef } from "react";

interface VideoProps {
    stream: MediaStream | null;
}

const Video: React.FC<VideoProps> = ({stream}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect (() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream])

    return (
        <video className="w-1/4 h-1/4" ref={videoRef} autoPlay playsInline />
    )
}

export default Video;