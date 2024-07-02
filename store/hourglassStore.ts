import { create } from 'zustand';
import Cookies from 'js-cookie';

interface TimeState {
  timeStart: Date | null;
  timeBurst: number | null;
  timeGoal: number | null;
  timeEnd: Date | null;
  isRunning: boolean;
  bbMode: boolean;
  pause: boolean;
  hId: bigint | null;
  setTimeStart: (time: Date) => void;
  setTimeBurst: (burst: number) => void;
  setTimeGoal: (goal: number | null) => void;
  toggleRunning: () => void;
  toggleBBMode: () => void;
  togglePause: () => void;
  setTimeEnd: (time: Date) => void;
  handleSetTime: (hours: number, minutes: number, seconds: number) => void;
  incrementTimeBurst: () => void;
  stopTimer: () => void;
  checkAndStopTimer: () => void;
}

const saveStateToCookies = (state: Partial<TimeState>) => {
  Cookies.set('timerState', JSON.stringify(state), { expires: 7 });
};

const removeStateFromCookies = () => {
  Cookies.remove('timerState');
};

const getTokenFromCookies = (): string | undefined => {
  return Cookies.get(process.env.NEXT_ACCESS_TOKEN_KEY);
}

const sendTimeDataToServer = async (data: {
  timeStart: string | undefined;
  timeBurst: number | null;
  timeEnd: string | undefined;
  hId: bigint | null;
}) => {
  try {
    const token = getTokenFromCookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to end timer');
    }

    return responseData;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
const sendPauseSignalToServer = async (data: {
  hId: bigint | null;
  timeBurst: number | null;
})=> {
  const token = getTokenFromCookies();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/pause`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
};

const sendStartDataToServer = async (data: {
  timeStart: string | undefined;
  timeGoal: number | null;
}) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to start timer');
    }

    return responseData.hId; // 서버로부터 hId를 반환
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const useHourglassStore = create<TimeState>((set, get) => ({
  timeStart: Cookies.get('timerState') ? new Date(JSON.parse(Cookies.get('timerState')!).timeStart) : null,
  timeBurst: Cookies.get('timerState') ? JSON.parse(Cookies.get('timerState')!).timeBurst : 0,
  timeGoal: Cookies.get('timerState') ? JSON.parse(Cookies.get('timerState')!).timeGoal : null,
  timeEnd: Cookies.get('timerState') ? new Date(JSON.parse(Cookies.get('timerState')!).timeEnd) : null,
  isRunning: Cookies.get('timerState') ? JSON.parse(Cookies.get('timerState')!).isRunning : false,
  bbMode: Cookies.get('timerState') ? JSON.parse(Cookies.get('timerState')!).bbMode : false,
  pause: Cookies.get('timerState') ? JSON.parse(Cookies.get('timerState')!).pause : false,
  hId: Cookies.get('timerState') ? JSON.parse(Cookies.get('timerState')!).hId : null,
  setTimeStart: (time: Date) => set((state) => {
    const newState = { ...state, timeStart: time };
    saveStateToCookies(newState);
    return newState;
  }),
  setTimeBurst: (burst: number) => set((state) => {
    const newState = { ...state, timeBurst: burst };
    saveStateToCookies(newState);
    return newState;
  }),
  setTimeGoal: (goal: number | null) => set((state) => {
    const newState = { ...state, timeGoal: goal };
    saveStateToCookies(newState);
    return newState;
  }),
  setTimeEnd: (time: Date) => set((state) => {
    const newState = { ...state, timeEnd: time };
    saveStateToCookies(newState);
    return newState;
  }),
  toggleRunning: () => set((state) => {
    const newState = { ...state, isRunning: !state.isRunning };
    saveStateToCookies(newState);
    return newState;
  }),
  toggleBBMode: () => set((state) => {
    const newState = { ...state, bbMode: !state.bbMode };
    saveStateToCookies(newState);
    return newState;
  }),
  togglePause: () => set((state) => {
    const newState = { ...state, pause: !state.pause };
    saveStateToCookies(newState);
    return newState;
  }),
  handleSetTime: async (hours: number, minutes: number, seconds: number) => {
    const currentTime = new Date();
    const totalDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;
    const initialState = {
      timeStart: currentTime,
      timeBurst: 0, // 초기에는 0으로 설정
      timeGoal: totalDuration,
      timeEnd: null,
      isRunning: true,
      bbMode: get().bbMode,
      pause: get().pause,
      hId: null, // 초기에는 null로 설정
    };
    set(initialState);
    saveStateToCookies(initialState);

    const hId = await sendStartDataToServer({
      timeStart: currentTime.toISOString(),
      timeGoal: initialState.timeGoal,
    });

    if (hId) {
      const newState = { ...get(), hId };
      set(newState);
      saveStateToCookies(newState);
    }
  },
  incrementTimeBurst: () => set((state) => {
    const newTimeBurst = state.timeBurst !== null ? state.timeBurst + 1000 : 1000;
    const newState = { ...state, timeBurst: newTimeBurst };
    saveStateToCookies(newState);
    get().checkAndStopTimer(); // 타이머가 완료되었는지 확인
    return newState;
  }),
  stopTimer: () => set((state) => {
    const newState = { ...state, isRunning: false, timeEnd: new Date() };
    removeStateFromCookies();
    sendTimeDataToServer({
      timeStart: state.timeStart?.toISOString(),
      timeBurst: state.timeBurst,
      timeEnd: newState.timeEnd?.toISOString(),
      hId: state.hId,
    });
    return newState;
  }),
  checkAndStopTimer: () => {
    const { timeBurst, timeGoal } = get();
    if (timeGoal !== null && timeBurst !== null && timeBurst >= timeGoal) {
      set((state) => {
        const newState = { ...state, isRunning: false, timeEnd: new Date() };
        saveStateToCookies(newState);
        removeStateFromCookies();
        sendTimeDataToServer({
          timeStart: state.timeStart?.toISOString(),
          timeBurst: state.timeBurst,
          timeEnd: newState.timeEnd?.toISOString(),
          hId: state.hId,
        });
        return newState;
      });
    }
  },
}));
