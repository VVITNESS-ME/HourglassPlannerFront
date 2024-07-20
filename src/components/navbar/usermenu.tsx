import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import useConsoleStore from '../../../store/consoleStore'; // useConsoleStore 훅 임포트
import Image from "next/image";

interface Task {
  text: string;
  dday: number;
}

type UserMenuProps = {
  username: string;
};


let tasks:Task[]

const UserMenu: React.FC<UserMenuProps> = ({ username}) => {
  const [tasksOn, setTasksOn] = useState<boolean>(false);
  const handleMessageClick = () => {
    setTasksOn(!tasksOn);
  }

  const currentPath = usePathname();
  const { schedules } = useConsoleStore(); // useConsoleStore에서 schedules 상태 사용
  schedules.forEach(schedule => {
    if(schedule.dday <=1) tasks.push({text: schedule.description, dday: schedule.dday})
  });
  tasks.sort((a:Task, b:Task) => a.dday - b.dday)

  return (
    <div>
      <div className="flex flex-row">
        <button className="flex" onClick={handleMessageClick}>{tasks.length?<Image className="" width={30} height={30} src="/img/bell.svg" alt="alarm"/>:null}</button>
        <Link href="/together"> <Image className="ml-4" width={30} height={30} src="/img/together.svg" alt="together"/> </Link>
        <Link href="/console"> <Image className="ml-4" width={30} height={30} src="/img/todo.svg" alt="todo"/></Link>
        <Link href="/mypage/diary"> <button className="ml-4 w-48 bg-transparent rounded hover:bg-mono-1 text-xl">{username}</button> </Link>
      </div>
      {tasksOn&&(<div className="flex absolute right-40 top-24 w-72 h-20 border rounded-2xl text-balance text-xl bg-sandy-1 items-center justify-center">
        <ul>
          {tasks.map((task:Task, index:number)=>
           <li key={index} className="flex justify-between items-center mb-2 whitespace-nowrap pr-4">
           <span>{task.text}</span>
           <span className="text-red-500">{task.dday}</span></li>)}
        </ul>
      </div>)}

    </div>
  )
}

export default UserMenu;
