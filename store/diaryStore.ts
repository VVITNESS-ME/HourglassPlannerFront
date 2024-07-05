import create from 'zustand';

interface Task {
  hId: string;
  category: string;
  task: string;
  timeStart: string;
  timeEnd: string;
  timeBurst: number;
  satisfaction: number;
}

interface DiaryState {
  tasks: Task[];
  til: string;
  selectedDate: Date | null;
  setTasks: (tasks: Task[]) => void;
  setTil: (til: string) => void;
  setSelectedDate: (date: Date) => void;
}

const useDiaryState = create<DiaryState>((set) => ({
  tasks: [],
  til: '',
  selectedDate: null,
  setTasks: (tasks) => set({ tasks }),
  setTil: (til) => set({ til }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export default useDiaryState;
