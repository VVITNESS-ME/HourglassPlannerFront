import React, { useEffect, useState } from "react";
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

const UserMenu: React.FC<UserMenuProps> = ({ username}) => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksOn, setTasksOn] = useState<boolean>(false);
  const handleMessageClick = () => {
    setTasksOn(!tasksOn);
  }

  const currentPath = usePathname();
  const { schedules,setSchedules } = useConsoleStore(); // useConsoleStore에서 schedules 상태 사용

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedule/calendar/1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSchedules(data.data.schedules);
        console.log("스케쥴 세팅");
      } else {
        console.error('Failed to fetch schedules');
      }
    } catch (error) {
      console.error('Error fetching schedules', error);
    }
  };
  useEffect(()=>{fetchSchedules()},[])
  
  useEffect(()=>{
    let newTasks: Task[] = [];
    schedules.forEach(schedule => {
      if(schedule.dday <=1) {newTasks.push({text: schedule.description, dday: schedule.dday}); console.log("!!!!");}
    });
    newTasks?.sort((a:Task, b:Task) => a.dday - b.dday);
    console.log(newTasks);
    setTasks(newTasks);
  },[schedules])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <button className="flex" onClick={handleMessageClick}>{tasks?<Image className="" width={30} height={30} src="/img/bellRedDot.svg" alt="alarm"/>:<Image className="" width={30} height={30} src="/img/bell.svg" alt="alarm"/>}</button>
        <Link href="/together"> <Image className="ml-4" width={30} height={30} src="/img/together.svg" alt="together"/> </Link>
        <Link href="/console"> <Image className="ml-4" width={30} height={30} src="/img/todo.svg" alt="todo"/></Link>
        <Link href="/mypage/diary"> <button className="ml-4 w-48 bg-transparent rounded hover:bg-mono-1 text-xl">{username}</button> </Link>
      </div>
      {tasksOn&&(<div className="flex flex-col absolute top-20 w-64 h-24 border rounded-2xl text-balance text-xl bg-sandy-1 items-center justify-center overflow-auto">
        {tasks?.map((task, index)=>
          <div key={index}  className="w-full pl-6 pr-6 flex justify-between items-center">
            <div>{task.text}</div>
            <div className="text-red-500">D - {task.dday}</div>
          </div>)}
      </div>)}

    </div>
  )
}

export default UserMenu;
