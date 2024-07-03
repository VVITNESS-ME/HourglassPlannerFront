'use client'
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useAuthStore from "../../store/authStore";
import LoginMenu from "./loginmenu";
import UserMenu from "./usermenu";

const Navbar = () => {
    const { email, isInitialized, initialize } = useAuthStore(state => ({
        email: state.email,
        isInitialized: state.isInitialized,
        initialize: state.initialize,
    }));

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
      <div className="w-full mt-8 h-50 absolute top-5">
          <div className="container mx-auto px-4 h-full">
              <div className="flex justify-between items-center h-full">
                  <div className="flex flex-row">
                      <Link href="/">
                          <Image src="/img/logo_binary.png" alt="Hourglass Logo" width={50} height={50}></Image>
                      </Link>
                      <Link href="/" className="py-2 ml-2 text-xl hidden sm:block">모래시계 플래너</Link>
                  </div>
                  {isInitialized ? (email === "" ? <LoginMenu /> : <UserMenu />) : null}
              </div>
          </div>
      </div>
    );
};

export default Navbar;
