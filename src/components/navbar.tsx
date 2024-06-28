import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <div className="w-full h-50 sticky top-5">
            <div className="container mx-auto px-4 h-full">
                <div className="flex justify-between items-center h-full">
                    <div>
                        <Link href="/">
                            <Image src="/img/logo_binary.png" alt="Hourglass Logo" width={50} height={50}></Image>
                            <span className="ml-2 text-xl">모래시계 플래너</span>
                        </Link>
                    </div>
                    <div>
                        <Link href="/login"> <button className="px-4 py-2 bg-orange-300 rounded">log in</button> </Link>
                        <Link href="/signup"> <button className="px-4 py-2 bg-gray-400 rounded">signup</button> </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar