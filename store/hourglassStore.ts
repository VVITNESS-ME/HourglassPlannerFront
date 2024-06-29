// store/hourglassStore.ts
import { create } from 'zustand';
import Cookies from 'js-cookie';

interface TimeState {
  startTime: Date | null;
  duration: number;
  endTime: Date | null;
  isRunning: boolean;
  setStartTime: (time: Date) => void;
  setDuration: (duration: number) => void;
  setEndTime: (time: Date) => void;
  toggleRunning: () => void;
  handleSetTime: (hours: number, minutes: number, seconds: number) => void;
  stopTimer: () => void;
}

const saveStateToCookies = (state: TimeState) => {
  Cookies.set('timerState', JSON.stringify(state), { expires: 7 });
};

export const useHourglassStore = create<TimeState>((set, get) => ({
  startTime: Cookies.get('timerState') ? new Date(JSON.parse(Cookies.get('timerState')!).startTime) : null,
  duration: Cookies.get('timerState') ? JSON.parse(Cookies.get('timerState')!).duration : 0,
  endTime: Cookies.get('timerState') ? new Date(JSON.parse(Cookies.get('timerState')!).endTime) : null,
  isRunning: Cookies.get('timerState') ? JSON.parse(Cookies.get('timerState')!).isRunning : false,
  setStartTime: (time: Date) => set((state) => {
    const newState = { ...state, startTime: time };
    saveStateToCookies(newState);
    return newState;
  }),
  setDuration: (duration: number) => set((state) => {
    const newState = { ...state, duration };
    saveStateToCookies(newState);
    return newState;
  }),
  setEndTime: (time: Date) => set((state) => {
    const newState = { ...state, endTime: time };
    saveStateToCookies(newState);
    return newState;
  }),
  toggleRunning: () => set((state) => {
    const newState = { ...state, isRunning: !state.isRunning };
    saveStateToCookies(newState);
    return newState;
  }),
  handleSetTime: (hours: number, minutes: number, seconds: number) => {
    const currentTime = new Date();
    const totalDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;
    const newState = {
      startTime: currentTime,
      duration: totalDuration,
      endTime: null,
      isRunning: true,
    };
    set(newState);
    saveStateToCookies(newState);
  },
  stopTimer: () => set((state) => {
    const newState = { ...state, isRunning: false };
    saveStateToCookies(newState);
    return newState;
  }),
}));
