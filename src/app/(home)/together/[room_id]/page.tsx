'use client'
import { useParams } from "next/navigation";
export default function Room() {
  const params = useParams();
  const roomId = params?.roomId;
    return (
      <div className="">
        Welcome to Room # {roomId}
      </div>
    );
}
