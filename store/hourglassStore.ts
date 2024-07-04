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
  isInitialized: boolean;
  modalOpen: boolean;
  setTimeStart: (time: Date) => void;
  setTimeBurst: (burst: number) => void;
  setTimeGoal: (goal: number | null) => void;
  popUpModal: () => void;
  closeModal: () => void;
  toggleRunning: () => void;
  toggleBBMode: () => void;
  togglePause: () => void;
  setTimeEnd: (time: Date) => void;
  handleSetTime: (hours: number, minutes: number, seconds: number) => void;
  incrementTimeBurst: () => void;
  stopTimer: () => void;
  checkAndStopTimer: () => void;
  initialize: () => void;
}

const saveStateToCookies = (state: Partial<TimeState>) => {
  Cookies.set('timerState', JSON.stringify(state), { expires: 7 });
};

const removeStateFromCookies = () => {
  Cookies.remove('timerState');
};

const getToken = (): string | undefined => {
  return Cookies.get(process.env.NEXT_ACCESS_TOKEN_KEY || 'token');
};

const sendStartDataToServer = async (data: {
  timeStart: string | undefined;
  timeGoal: number | null;
}): Promise<bigint | null> => {
  try {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to start timer');
    }

    return responseData.hId;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const sendTimeDataToServer = async (data: {
  timeStart: string | undefined;
  timeBurst: number | null;
  timeEnd: string | undefined;
  hId: bigint | null;
}) => {
  try {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
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
  timeStart: string | undefined;
  timeGoal: number | null;
  hId: bigint | null;
  timeBurst: number | null;
}) => {
  try {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/pause`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to pause timer');
    }
    return responseData.hId;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

const sendResumeSignalToServer = async (data: {
  timeStart: string | undefined;
  timeGoal: number | null;
  hId: bigint | null;
  timeBurst: number | null;
}) => {
  try {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to resume timer');
    }

    return responseData.hId;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

export const useHourglassStore = create<TimeState>((set, get) => ({
  timeStart: null,
  timeBurst: null,
  timeGoal: null,
  timeEnd: null,
  isRunning: false,
  bbMode: false,
  pause: false,
  modalOpen: false,
  hId: null,
  isInitialized: false,
  setTimeStart: (time: Date) => set((state) => {
    const newState = { ...state, timeStart: time};
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
  popUpModal: () => set((state) => {
    const newState = { ...state, modalOpen: true, timeGoal: 60 * 60 * 800 * 1000 };
    saveStateToCookies(newState);
    return newState;
  }),
  closeModal: () => set((state) => {
    const newState = { ...state, modalOpen: false};
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
  togglePause: async () => {
    const token = getToken();
    const state = get();
    if (token) {
      const newState = { ...state, pause: !state.pause};
      set(newState);
      saveStateToCookies(newState);
      if (!state.pause) {
        const hId = await sendPauseSignalToServer({
          timeStart: state.timeStart?.toISOString(),
          timeGoal: state.timeGoal,
          hId: state.hId,
          timeBurst: state.timeBurst
        });
        if (hId) {
          const newState = { ...state, hId};
          set(newState);
          saveStateToCookies(newState);
        }
      } else {
        const hId = await sendResumeSignalToServer({
          timeStart: state.timeStart?.toISOString(),
          timeGoal: state.timeGoal,
          hId: state.hId,
          timeBurst: state.timeBurst
        });
        if (hId) {
          const newState = { ...state, hId};
          set(newState);
          saveStateToCookies(newState);
        }
      }
    }else{
      const newState = { ...state, pause: !state.pause};
      set(newState);
      saveStateToCookies(newState);
    }
  },
  handleSetTime: async (hours: number, minutes: number, seconds: number) => {
    const currentTime = new Date();
    const totalDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;
    const initialState = {
      timeStart: currentTime,
      timeBurst: 0,
      timeGoal: totalDuration,
      timeEnd: null,
      isRunning: true,
      bbMode: get().bbMode,
      pause: false,
      hId: null,
    };
    set(initialState);
    saveStateToCookies(initialState);
    const token = getToken();
    if (token) {
      const hId = await sendStartDataToServer({
        timeStart: currentTime.toISOString(),
        timeGoal: initialState.timeGoal,
      });
      if (hId) {
        const newState = { ...get(), hId };
        set(newState);
        saveStateToCookies(newState);
      }
    }
  },
  incrementTimeBurst: () => set((state) => {
    const newTimeBurst = state.timeBurst !== null ? state.timeBurst + 1000 : 1000;
    const newState = { ...state, timeBurst: newTimeBurst };
    saveStateToCookies(newState);
    get().checkAndStopTimer();
    return newState;
  }),
  stopTimer: () => set((state) => {
    const newState = { ...state, isRunning: false, timeEnd: new Date(), modalOpen: false };
    removeStateFromCookies();
    const token = getToken();
    if (token) {
      sendTimeDataToServer({
        timeStart: state.timeStart?.toISOString(),
        timeBurst: state.timeBurst,
        timeEnd: newState.timeEnd?.toISOString(),
        hId: state.hId,
      });
    }
    return newState;
  }),
  checkAndStopTimer: () => {
    const { timeBurst, timeGoal } = get();
    if (timeGoal !== null && timeBurst !== null && timeBurst >= timeGoal) {
      get().popUpModal();
    }
  },
  initialize: () => {
    const timerState = Cookies.get('timerState');
    if (timerState) {
      const parsedState = JSON.parse(timerState);
      set({
        timeStart: parsedState.timeStart ? new Date(parsedState.timeStart) : null,
        timeBurst: parsedState.timeBurst || 0,
        timeGoal: parsedState.timeGoal || null,
        timeEnd: parsedState.timeEnd ? new Date(parsedState.timeEnd) : null,
        isRunning: parsedState.isRunning || false,
        bbMode: parsedState.bbMode || false,
        pause: parsedState.pause || false,
        hId: parsedState.hId || null,
        modalOpen: parsedState.modalOpen || false,
        isInitialized: true,
      });
    } else {
      set({
        timeStart: null,
        timeBurst: null,
        timeGoal: null,
        timeEnd: null,
        isRunning: false,
        bbMode: false,
        pause: false,
        hId: null,
        modalOpen: false,
        isInitialized: true,
      });
    }
  },
}));
