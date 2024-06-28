import Image from "next/image";
import Link from "next/link";
export default function Login(){
  return(
    <div className="flex flex-col justify-center items-center">
      <div className="py-10">
        <Image src="/img/logo_binary.svg" alt="Hourglass Logo" width={300} height={300}></Image>
        <div className="flex flex-row">
          <div className="flex flex-col">
            <input className="my-2" type="email" name="email" id="" />
            <input className="" type="password" name="password" id="" />
          </div>
          <button className="login-text px-4 bg-orange-200 rounded">로그인</button>
        </div>
      </div>
    </div>
  )
}