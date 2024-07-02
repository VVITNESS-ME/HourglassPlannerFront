import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import Image from "next/image";

const UserMenu = () => {
    return (
        <div className="flex flex-row">
            <Link href="/together"> <Image className="" width={30} height={30} src="/img/together.svg" alt="together"></Image> </Link>
            <Link href="/todo"> <Image className="ml-4" width={30} height={30} src="/img/todo.svg" alt="todo"></Image></Link>
            <Link href="/mypage"> <button className="ml-4 w-48 bg-transparent rounded hover:bg-mono-1 text-xl">sandglassmaster</button> </Link>
        </div>
    )
}

export default UserMenu