import create from 'zustand';

interface Task {
  category: string;
  task: string;
  timeStart: string;
  timeEnd: string;
  satisfaction: number;
}

interface DiaryState {
  tasks: Task[];
  til: string;
  setTasks: (tasks: Task[]) => void;
  setTil: (til: string) => void;
}

const useDiaryState = create<DiaryState>((set) => ({
  tasks: [],
  til: "",
  setTasks: (tasks) => set({ tasks }),
  setTil: (til) => set({ til }),
}));

export default useDiaryState;