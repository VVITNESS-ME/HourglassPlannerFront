'use client'
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useAuthStore from "../../../store/(auth)/authStore";
import LoginMenu from "./loginmenu";
import UserMenu from "./usermenu";

const Navbar = () => {
    const { username, isInitialized, initialize } = useAuthStore(state => ({
        username: state.username,
        isInitialized: state.isInitialized,
        initialize: state.initialize,
    }));

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (!isInitialized) return null;

    return (
      <div className="w-full h-20 fixed top-0 left-0 bg-white z-50 shadow-md">
          <div className="container mx-auto px-4 h-full">
              <div className="flex justify-between items-center h-full">
                  <div className="flex flex-row">
                      <Link href="/">
                          <Image src="/img/logo_binary.png" alt="Hourglass Logo" width={50} height={50} />
                      </Link>
                      <Link href="/" className="py-2 ml-2 text-xl hidden sm:block">모래시계 플래너</Link>
                  </div>
                  {username === "" ? <LoginMenu /> : <UserMenu username={username} />}
              </div>
          </div>
      </div>
    );
};

export default Navbar;
