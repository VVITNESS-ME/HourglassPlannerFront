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
        <video ref={videoRef} autoPlay playsInline />
    )
}

export default Video;