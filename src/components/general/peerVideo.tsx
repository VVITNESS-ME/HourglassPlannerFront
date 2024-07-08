'use client'
import { useEffect, useRef } from "react";

interface VideoProps {
    stream: MediaStream | null;
}

const PeerVideo: React.FC<VideoProps> = ({stream}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect (() => {
        if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream])

    return (
        <video className="w-1/2 h-1/2" ref={videoRef} autoPlay playsInline />
    )
}

export default PeerVideo;