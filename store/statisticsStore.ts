import create from 'zustand';

interface PieData {
  label: string;
  value: number;
  backgroundColor: string;
}

interface DailyData {
  day: string;
  studyTime: number;
}

interface WeeklyData {
  week: string;
  studyTime: number;
}

interface MonthlyData {
  month: string;
  studyTime: number;
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
  weeklyData: WeeklyData[];
  monthlyData: MonthlyData[];
  grasses: Grass[];
  rangeSelection: RangeSelection;
  setSelectedDate: (date: Date) => void;
  setPieData: (data: PieData[]) => void;
  setDailyData: (data: DailyData[]) => void;
  setWeeklyData: (data: WeeklyData[]) => void;
  setMonthlyData: (data: MonthlyData[]) => void;
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
  return date.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
};

export const fetchDailyData = async (date: Date) => {
  const formattedDate = formatDate(date);
  let day = 0;
  if (date.getDay() === 7){
    day = 0;
  }else {
    day -= 1;
  }
  const responseData = await fetchData(
    `${process.env.NEXT_PUBLIC_API_URL}/api/statistics/daily-statistics?date=${formattedDate}&day=${day}`,
    'Failed to fetch dailyStatistics'
  );
  console.log(responseData);
  const { pieData, dailyStatistics } = responseData;
  return { pieData, dailyStatistics };
};

export const fetchWeeklyData = async (date: Date) => {
  const formattedDate = formatDate(date);
  const responseData = await fetchData(
    `${process.env.NEXT_PUBLIC_API_URL}/api/statistics/weekly-statistics?date=${formattedDate}`,
    'Failed to fetch weeklyStatistics'
  );
  const { pieData, weeklyStatistics } = responseData;
  return { pieData, weeklyStatistics };
};

export const fetchMonthlyData = async (date: Date) => {
  const formattedDate = formatDate(date);
  const responseData = await fetchData(
    `${process.env.NEXT_PUBLIC_API_URL}/api/statistics/monthly-statistics?date=${formattedDate}`,
    'Failed to fetch monthlyStatistics'
  );
  const { pieData, monthlyStatistics } = responseData;
  return { pieData, monthlyStatistics };
};
