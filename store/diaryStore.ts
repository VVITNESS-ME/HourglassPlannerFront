import { create } from 'zustand';

export interface Hourglass {
  hid: string;
  categoryName: string;
  color: string;
  taskName: string;
  content: string;
  timeStart: string;
  timeEnd: string;
  timeBurst: number;
  rating: number;
}

interface Til {
  title: string | null;
  content: string | null;
}

interface DiaryStore {
  hourglasses: Hourglass[];
  til: Til | null;
  selectedDate: Date | null;
  selectedHourglass: Hourglass | null;
  description: string;
  setHourglasses: (hourglasses: Hourglass[]) => void;
  setTil: (til: Til) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedHourglass: (hourglass: Hourglass | null) => void;
  setDescription: (description: string) => void;
  updateHourglass: (updatedHourglass: Hourglass) => void;
}

const useDiaryStore = create<DiaryStore>((set) => ({
  hourglasses: [],
  til: {
    title: null,
    content: null,
  },
  selectedDate: null,
  selectedHourglass: null,
  description: '',
  setHourglasses: (hourglasses: Hourglass[]) => set({ hourglasses }),
  setTil: (til: Til) => set({ til }),
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
  setSelectedHourglass: (hourglass: Hourglass | null) => set({ selectedHourglass: hourglass }),
  setDescription: (description: string) => set({ description }),
  updateHourglass: (updatedHourglass: Hourglass) => set((state) => ({
    hourglasses: state.hourglasses.map((task) =>
      task.hid === updatedHourglass.hid ? updatedHourglass : task
    ),
    selectedHourglass: updatedHourglass,
  })),
}));

export default useDiaryStore;