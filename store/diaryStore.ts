import create from 'zustand';

interface Hourglass {
  hId: string;
  category: string;
  task: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  timeBurst: number;
  satisfaction: number;
}

interface DiaryState {
  hourglass: Hourglass[];
  til: string;
  selectedDate: Date | null;
  setHourglass: (hourglass: Hourglass[]) => void;
  setTil: (til: string) => void;
  setSelectedDate: (date: Date) => void;
}

const useDiaryState = create<DiaryState>((set) => ({
  hourglass: [],
  til: '',
  selectedDate: null,
  setHourglass: (hourglass) => set({ hourglass }),
  setTil: (til) => set({ til }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export default useDiaryState;
