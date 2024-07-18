import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import Image from "next/image";

type UserMenuProps = {
  username: string;
};

const handleMessageClick = () => {

}

const UserMenu: React.FC<UserMenuProps> = ({ username }) => {
  return (
    <div className="flex flex-row">
      <button className="flex" onClick={handleMessageClick}><Image className="" width={30} height={30} src="/img/bell.svg" alt="alarm"/></button>
      <div className="flex absolute right-40 top-24 w-72 h-20 border rounded-2xl text-balance text-xl bg-sandy-1 items-center justify-center"><p>오늘 예정된 일정이 있습니다</p></div>
      <Link href="/together"> <Image className="ml-4" width={30} height={30} src="/img/together.svg" alt="together"/> </Link>
      <Link href="/console"> <Image className="ml-4" width={30} height={30} src="/img/todo.svg" alt="todo"/></Link>
      <Link href="/mypage/diary"> <button className="ml-4 w-48 bg-transparent rounded hover:bg-mono-1 text-xl">{username}</button> </Link>
    </div>
  )
}

export default UserMenu;
