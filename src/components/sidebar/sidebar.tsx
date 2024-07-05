'use client'
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const currentPath = usePathname();
    return(
        <div className="flex-col justify-self-start">
            SIDEBAR HERE
        </div>
    )
}

export default Sidebar