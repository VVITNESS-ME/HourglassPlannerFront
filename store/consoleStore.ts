import create from 'zustand';

interface Schedule {
  description: string;
  dDay: number;
}

interface ConsoleStore {
  schedules: Schedule[];
  setSchedules: (schedules: Schedule[]) => void;
}

const useConsoleStore = create<ConsoleStore>(set => ({
  schedules: [],
  setSchedules: (schedules) => set({ schedules }),
}));

export default useConsoleStore;