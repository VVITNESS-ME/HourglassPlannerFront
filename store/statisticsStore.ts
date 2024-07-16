import create from 'zustand';

interface PieData {
  categoryName: string;
  ratio: number;
  color: string;
}

interface DailyData {
  weekDay: string;
  totalBurst: number;
}

interface MonthData {
  date: string;
  totalBurst: number;
}

interface MonthlyData {
  month: number;
  totalBurst: number;
}

interface Grass {
  date: string;
  timeBurst: number;
}

type RangeSelection = 'daily' | 'weekly' | 'monthly';

interface StatisticsStore {
  selectedDate: Date | null;
  pieData: PieData[];
  dailyData: DailyData[];
  weeklyData: MonthData[];
  monthlyData: MonthData[];
  grasses: Grass[];
  rangeSelection: RangeSelection;
  setSelectedDate: (date: Date) => void;
  setPieData: (data: PieData[]) => void;
  setDailyData: (data: DailyData[]) => void;
  setWeeklyData: (data: MonthData[]) => void;
  setMonthlyData: (data: MonthData[]) => void;
  setGrasses: (data: Grass[]) => void;
  setRangeSelection: (range: RangeSelection) => void;
}

const useStatisticsStore = create<StatisticsStore>((set) => ({
  selectedDate: new Date(),
  pieData: [],
  dailyData: [],
  weeklyData: [],
  monthlyData: [],
  grasses: [],
  rangeSelection: 'daily',
  setSelectedDate: (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정
    if (date <= today) {
      set({ selectedDate: date });
    } else {
      console.warn('Cannot set selectedDate to a future date');
    }
  },
  setPieData: (data) => set({ pieData: data }),
  setDailyData: (data) => set({ dailyData: data }),
  setWeeklyData: (data) => set({ weeklyData: data }),
  setMonthlyData: (data) => set({ monthlyData: data }),
  setGrasses: (data) => set({ grasses: data }),
  setRangeSelection: (range) => set({ rangeSelection: range }),
}));

export default useStatisticsStore;

const fetchData = async (url: string, errorMessage: string) => {
  try {
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data: ${errorMessage}`, error);
    throw error;
  }
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
};

export const fetchDailyData = async (state: StatisticsStore) => {
  const formattedDate = formatDate(state.selectedDate!);
  const day = state.selectedDate!.getDay();
  let weekDay = 0
  if (day === 0){
    weekDay = 7;
  }else{
    weekDay = day-1;
  }
  return await fetchData(
    `${process.env.NEXT_PUBLIC_API_URL}/api/statics/statistics-week?date=${formattedDate}&day=${weekDay}`,
    'Failed to fetch dailyStatistics'
  );
};

export const fetchWeeklyData = async (state: StatisticsStore) => {
  const formattedDate = formatDate(state.selectedDate!);
  return await fetchData(
    `${process.env.NEXT_PUBLIC_API_URL}/api/statics/statistics-month?date=${formattedDate}`,
    'Failed to fetch weeklyStatistics'
  );
};

export const fetchMonthlyData = async (state: StatisticsStore) => {
  const formattedDate = formatDate(state.selectedDate!);
  return await fetchData(
    `${process.env.NEXT_PUBLIC_API_URL}/api/statics/statistics-year?date=${formattedDate}`,
    'Failed to fetch monthlyStatistics'
  );
};