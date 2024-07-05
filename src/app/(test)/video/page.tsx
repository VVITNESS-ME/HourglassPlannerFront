'use client'

import Video from "@/components/general/video";
import { useState, useEffect } from "react";
export default function VideoPage() {
  const [local, setLocal] = useState<MediaStream | null> (null)

  useEffect (() => {
      const startMedia = async () =>{
        try {
          const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
          setLocal(stream);
        }
        catch {console.error("STN WRG")}
      }

      startMedia();
  },[])


  return (
    <div className="flex">
    <Video stream={local}/>
    </div>
    );
}