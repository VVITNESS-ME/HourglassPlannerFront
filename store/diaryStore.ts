import create from 'zustand';

export interface Hourglass {
  hId: string;
  category: string;
  categoryColor: string;
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
  selectedHourglass: Hourglass | null;
  description: string;
  setHourglass: (hourglass: Hourglass[]) => void;
  setTil: (til: string) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedHourglass: (hourglass: Hourglass | null) => void;
  setDescription: (description: string) => void;
  updateHourglass: (updatedHourglass: Hourglass) => void;
}

const useDiaryState = create<DiaryState>((set) => ({
  hourglass: [],
  til: '',
  selectedDate: null,
  selectedHourglass: null,
  description: '',
  setHourglass: (hourglass) => set({ hourglass }),
  setTil: (til) => set({ til }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedHourglass: (hourglass) => set({ selectedHourglass: hourglass }),
  setDescription: (description) => set({ description }),
  updateHourglass: (updatedHourglass) => set((state) => ({
    hourglass: state.hourglass.map((task) =>
      task.hId === updatedHourglass.hId ? updatedHourglass : task
    ),
    selectedHourglass: updatedHourglass,
  })),
}));

export default useDiaryState;
