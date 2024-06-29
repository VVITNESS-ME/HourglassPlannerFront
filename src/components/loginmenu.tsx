import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'

const LoginMenu = () => {
    const currentPath = usePathname();
    if (currentPath == '/login') {
        return (
            <div>
                <Link href="/signup"> <button className="px-4 py-2 w-20 bg-mono-2 rounded hover:bg-mono-3">signup</button> </Link>
            </div>
        )
    }
    else if (currentPath == '/signup') {
        return(
            <div>
                <Link href="/login"> <button className="px-4 py-2 w-20 bg-sandy-3 rounded hover:bg-sandy-1">log in</button> </Link>
            </div>
        )
    }
    else {return(
            <div>
                <Link href="/login"> <button className="px-4 py-2 w-20 bg-sandy-3 rounded hover:bg-sandy-1">log in</button> </Link>
                <Link href="/signup"> <button className="ml-2 px-4 py-2 w-20 bg-mono-2 rounded hover:bg-mono-3">signup</button> </Link>
            </div>
        )}
}

export default LoginMenu