import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <div className="w-full h-50 sticky top-5">
            <div className="container mx-auto px-4 h-full">
                <div className="flex justify-between items-center h-full">
                    <div className="flex flex-row">
                        <Link href="/">
                            <Image src="/img/logo_binary.png" alt="Hourglass Logo" width={50} height={50}></Image>
                        </Link>
                        <Link href="/" className="py-2 ml-2 text-xl">모래시계 플래너</Link>
                    </div>
                    <div>
                        <Link href="/login"> <button className="px-4 py-2 bg-sandy-3 rounded hover:bg-sandy-1">log in</button> </Link>
                        <Link href="/signup"> <button className="px-4 py-2 bg-mono-2 rounded hover:bg-mono-3">signup</button> </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar