import React from "react";
import Link from "next/link";
import Image from "next/image";
import useAuthStore from "../../store/authStore";
import { useRouter } from "next/router";

const RightMenu = (isLoggedIn: boolean) => {
    const router = useRouter();
    const currentPath = router.pathname;
    return (
        <div>
            <Link href="/login" className={currentPath === '/login'? }> <button className="px-4 py-2 w-20 bg-sandy-3 rounded hover:bg-sandy-1">log in</button> </Link>
            <Link href="/signup"> <button className="px-4 py-2 w-20 bg-mono-2 rounded hover:bg-mono-3">signup</button> </Link>
        </div>
    )
}

export default RightMenu