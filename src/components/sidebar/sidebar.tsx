import { usePathname } from "next/navigation";

const Sidebar = () => {
    const currentPath = usePathname();
    if (currentPath == '/login') {
        return (
            <div></div>
        )
    }
}

export default Sidebar