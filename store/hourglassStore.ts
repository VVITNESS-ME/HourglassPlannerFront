import { create } from 'zustand';
import Cookies from 'js-cookie';
import {Simulate} from "react-dom/test-utils";
import pause = Simulate.pause;

interface DailyData {
  categoryName: string;
  start: Date;
  end: Date;
  burst: number;
  color: string;
}

interface TimeState {
  timeStart: Date | null;
  timeBurst: number | null;
  timeGoal: number | null;
  timeEnd: Date | null;
  isRunning: boolean;
  bbMode: boolean;
  pause: boolean;
  hId: number | null;
  tId: number | null;
  isInitialized: boolean;
  modalOpen: boolean;
  resultModalOpen: boolean;
  dailyData: DailyData[];
  taskName: string | '';
  checkHourglassInProgress: boolean;
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
  stopTimer: (categoryName: string, rating: number, content: string) => Promise<any[]>;
  stopTimerWithNOAuth: () => void;
  checkAndStopTimer: () => void;
  initialize: () => void;
  setPause: () => void;
  setResume: () => void;
  setTid: (tId: number | null) => void;
  openResultModal: () => void;
  closeResultModal: () => void;
  setDailyData: (dailyData: DailyData[]) => void;
  setTaskName: (taskName: string) => void;
  setCheckHourglassInProgress: (isChecked: boolean) => void;
  fetchHourglassInProgress: () => void;
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
  tId: number | null;
  fetchHourglassInProgress: () => void;
}): Promise<number | null> => {
  const token = getToken();
  if (!token) {
    return null;
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/start${data.tId ? `/${data.tId}` : ''}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        timeStart: data.timeStart,
        timeGoal: data.timeGoal ? Math.floor(data.timeGoal / 1000) : null,
      }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to start timer');
    }
    return responseData.data.hid;
  } catch (error) {
    console.error('Error:', error);
    data.fetchHourglassInProgress();
    return null;
  }
};

const sendTimeDataToServer = async (data: {
  timeEnd: string | undefined;
  hId: any;
  timeStart: string | undefined;
  timeBurst: any;
  rating: number;
  categoryName: string;
  tId: number | null;
  content: string;
}): Promise<any[]> => {
  console.log(data);
  const token = getToken();
  if (token) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/end${data.tId ? `/${data.tId}` : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          timeBurst: data.timeBurst ? Math.floor(data.timeBurst / 1000) : null,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to end timer');
      }
      return responseData.data.todaySummery;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
  return [];
};

const sendPauseSignalToServer = async (data: {
  timeStart: string | undefined;
  timeGoal: number | null;
  hId: number | null;
  timeBurst: number | null;
}) => {
  const token = getToken();
  if (!token) return null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/pause`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...data,
        timeGoal: data.timeGoal ? Math.floor(data.timeGoal / 1000) : null,
        timeBurst: data.timeBurst ? Math.floor(data.timeBurst / 1000) : null,
      }),
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
  hId: number | null;
  timeBurst: number | null;
}) => {
  const token = getToken();
  if (token) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/restart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          timeGoal: data.timeGoal ? Math.floor(data.timeGoal / 1000) : null,
          timeBurst: data.timeBurst ? Math.floor(data.timeBurst / 1000) : null,
        }),
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
  tId: null,
  isInitialized: false,
  resultModalOpen: false,
  dailyData: [],
  taskName: '',
  checkHourglassInProgress: false,
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
  popUpModal: () => set((state) => {
    const newState = { ...state, modalOpen: true, timeGoal: 60 * 60 * 800 * 1000 };
    saveStateToCookies(newState);
    return newState;
  }),
  closeModal: () => set((state) => {
    const newState = { ...state, modalOpen: false };
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

  setPause: async () => {
    const token = getToken();
    if (token) {
      set((state) => {
        if (!state.pause) {
          const pauseState = { ...state, pause: true };
          saveStateToCookies(pauseState);
          return pauseState;
        }
        return state;
      });

      const state = get();
      const hId = await sendPauseSignalToServer({
        timeStart: state.timeStart?.toISOString(),
        timeGoal: state.timeGoal,
        hId: state.hId,
        timeBurst: state.timeBurst,
      });

      if (hId) {
        set((state) => {
          const newState = { ...state, hId };
          saveStateToCookies(newState);
          return newState;
        });
      }
    }
  },

  setResume: async () => {
    const token = getToken();
    if (token) {
      set((state) => {
        if (state.pause) {
          const resumeState = { ...state, pause: false };
          saveStateToCookies(resumeState);
          return resumeState;
        }
        return state;
      });

      const state = get();
      const hId = await sendResumeSignalToServer({
        timeStart: state.timeStart?.toISOString(),
        timeGoal: state.timeGoal,
        hId: state.hId,
        timeBurst: state.timeBurst,
      });

      if (hId) {
        set((state) => {
          const newState = { ...state, hId };
          saveStateToCookies(newState);
          return newState;
        });
      }
    }
  },

  togglePause: async () => {
    const token = getToken();
    const state = get();
    if (token) {
      const newState = { ...state, pause: !state.pause };
      set(newState);
      saveStateToCookies(newState);
      if (!state.pause) {
        const hId = await sendPauseSignalToServer({
          timeStart: state.timeStart?.toISOString(),
          timeGoal: state.timeGoal,
          hId: state.hId,
          timeBurst: state.timeBurst,
        });
        if (hId) {
          const newState = { ...state, hId };
          set(newState);
          saveStateToCookies(newState);
        }
      } else {
        const hId = await sendResumeSignalToServer({
          timeStart: state.timeStart?.toISOString(),
          timeGoal: state.timeGoal,
          hId: state.hId,
          timeBurst: state.timeBurst,
        });
        if (hId) {
          const newState = { ...state, hId };
          set(newState);
          saveStateToCookies(newState);
        }
      }
    } else {
      const newState = { ...state, pause: !state.pause };
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
      tId: get().tId,
    };
    set(initialState);
    saveStateToCookies(initialState);
    const token = getToken();
    if (token) {
      const hId = await sendStartDataToServer({
        timeStart: currentTime.toISOString(),
        timeGoal: initialState.timeGoal,
        tId: initialState.tId,
        fetchHourglassInProgress: get().fetchHourglassInProgress,
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
  stopTimerWithNOAuth: () => set((state) => {
    const newState = { ...state, isRunning: false, timeEnd: new Date(), modalOpen: false };
    removeStateFromCookies();
    return newState;
  }),
  stopTimer: async (categoryName: string, rating: number, content: string): Promise<any[]> => {
    const state = get();
    const newState = { ...state, isRunning: false, timeEnd: new Date(), modalOpen: false };
    set(newState);
    removeStateFromCookies();
    const token = getToken();
    let studyResult: any[] = [];
    if (token) {
      studyResult = await sendTimeDataToServer({
        timeStart: state.timeStart?.toISOString(),
        timeBurst: state.timeBurst,
        timeEnd: newState.timeEnd?.toISOString(),
        hId: state.hId,
        tId: state.tId,
        categoryName,
        rating,
        content,
      });
    }
    return studyResult;
  },
  checkAndStopTimer: () => {
    const { timeBurst, timeGoal } = get();
    if (timeGoal !== null && timeBurst !== null && timeBurst >= timeGoal) {
      get().openResultModal(); // 결과 모달을 열도록 설정
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
        tId: parsedState.tId || null,
        pause: parsedState.pause || false,
        hId: parsedState.hId || null,
        modalOpen: parsedState.modalOpen || false,
        isInitialized: true,
        resultModalOpen: false,
        dailyData: [],
        taskName: parsedState.taskName || '',
        checkHourglassInProgress: parsedState.taskName || false,
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
        tId: null,
        modalOpen: false,
        isInitialized: true,
        resultModalOpen: false,
        dailyData: [],
        taskName: '',
        checkHourglassInProgress: false,
      });
    }
  },
  setTid: (tId: number | null) => set((state) => {
    const newState = { ...state, tId };
    saveStateToCookies(newState);
    return newState;
  }),
  openResultModal: () => set((state) => {
    const newState = { ...state, resultModalOpen: true };
    saveStateToCookies(newState);
    return newState;
  }),
  closeResultModal: () => set((state) => {
    const newState = { ...state, resultModalOpen: false };
    saveStateToCookies(newState);
    return newState;
  }),
  setDailyData: (dailyData: DailyData[]) => set((state) => {
    const newState = { ...state, dailyData: dailyData };
    saveStateToCookies(newState);
    return newState;
  }),
  setTaskName: (taskName: string) => set((state) => {
    const newState = { ...state, taskName: taskName };
    saveStateToCookies(newState);
    return newState;
  }),
  setCheckHourglassInProgress: (isChecked: boolean) => set((state) => {
    const newState = { ...state, checkHourglassInProgress: isChecked };
    saveStateToCookies(newState);
    return newState;
  }),
  fetchHourglassInProgress: async () => {
    const token = Cookies.get(process.env.NEXT_ACCESS_TOKEN_KEY || 'token')
    if(token){
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/timer/progress`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.hid !== null) {
            let timeDifference = 0;
            if (data.data.timeBurst !== null) {
              timeDifference = data.data.timeBurst
            } else {
              if (data.data.timeResume !== null) {
                const resumeTime = new Date(data.data.timeResume);
                const nowTime = new Date();
                timeDifference = Math.abs(nowTime.getTime() - resumeTime.getTime());
              } else {
                const startTime = new Date(data.data.timeStart);
                const nowTime = new Date();
                timeDifference = Math.abs(nowTime.getTime() - startTime.getTime());
              }
            }
            set((state) => ({
              ...state,
              hId: data.data.hid,
              tId: data.data.tId,
              timeGoal: data.data.timeGaol * 1000,
              timeStart: new Date(data.data.timeStart),
              timeBurst: timeDifference,
              isRunning: true,
              isInitialized: true,
            }));
            console.log(get());// Log the current state
          }
          else {
            set({
              timeStart: null,
              timeBurst: null,
              timeGoal: null,
              timeEnd: null,
              isRunning: false,
              bbMode: false,
              pause: false,
              hId: null,
              tId: null,
              modalOpen: false,
              isInitialized: true,
              resultModalOpen: false,
              dailyData: [],
              taskName: '',
              checkHourglassInProgress: false,
            });
          }
        } else {
          console.error('Failed to fetch hourglass progress');
        }
      } catch (error) {
        console.error('Error fetching hourglass progress', error);
      }
    }else{
      set({
        timeStart: null,
        timeBurst: null,
        timeGoal: null,
        timeEnd: null,
        isRunning: false,
        bbMode: false,
        pause: false,
        hId: null,
        tId: null,
        modalOpen: false,
        isInitialized: true,
        resultModalOpen: false,
        dailyData: [],
        taskName: '',
        checkHourglassInProgress: false,
      });
    }
  },
}));
