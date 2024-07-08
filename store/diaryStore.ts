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

interface DiaryStore {
  hourglasses: Hourglass[];
  til: string;
  selectedDate: Date | null;
  selectedHourglass: Hourglass | null;
  description: string;
  setHourglasses: (hourglasses: Hourglass[]) => void;
  setTil: (til: string) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedHourglass: (hourglass: Hourglass | null) => void;
  setDescription: (description: string) => void;
  updateHourglass: (updatedHourglass: Hourglass) => void;
}

const useDiaryStore = create<DiaryStore>((set) => ({
  hourglasses: [],
  til: '',
  selectedDate: null,
  selectedHourglass: null,
  description: '',
  setHourglasses: (hourglasses) => set({ hourglasses }),
  setTil: (til) => set({ til }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedHourglass: (hourglass) => set({ selectedHourglass: hourglass }),
  setDescription: (description) => set({ description }),
  updateHourglass: (updatedHourglass) => set((state) => ({
    hourglasses: state.hourglasses.map((task) =>
      task.hId === updatedHourglass.hId ? updatedHourglass : task
    ),
    selectedHourglass: updatedHourglass,
  })),
}));

export default useDiaryStore;