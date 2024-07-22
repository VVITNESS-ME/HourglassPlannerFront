'use client'
import React, { useEffect, useState } from "react";
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
    }, []);

    // if (!isInitialized) return null;

    return (
      <div className="w-full pt-8 h-50 top-5 mb-2">
          <div className="container mx-auto px-4 w-full h-full">
              <div className="flex justify-between  items-center h-full">
                  <div className="flex flex-row">
                      <Link href="/">
                          <Image src="/img/logo_binary.png" alt="Hourglass Logo" width={50} height={50} />
                      </Link>
                      <Link href="/" className="py-2 ml-2 text-3xl hidden sm:block">모래시계 플래너</Link>
                  </div>
                  {!isInitialized?null:username === "" ? <LoginMenu /> : <UserMenu username={username}/>}
              </div>
          </div>
      </div>
    );
};

export default Navbar;
