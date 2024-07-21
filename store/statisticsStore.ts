import { create } from 'zustand';
import { format } from 'date-fns';

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

interface Grass {
  date: string;
  timeBurst: number;
}

type RangeSelection = 'daily' | 'weekly' | 'monthly';

interface StatisticsStore {
  totalTime: number;
  miaTime: number;
  selectedDate: Date | null;
  pieData: PieData[];
  dailyData: DailyData[];
  weeklyData: MonthData[];
  monthlyData: MonthData[];
  grasses: Grass[];
  rangeSelection: RangeSelection;
  fetchDayData: (date: Date | null) => void;
  setSelectedDate: (date: Date) => void;
  setPieData: (data: PieData[]) => void;
  setDailyData: (data: DailyData[]) => void;
  setWeeklyData: (data: MonthData[]) => void;
  setMonthlyData: (data: MonthData[]) => void;
  setGrasses: (data: Grass[]) => void;
  setRangeSelection: (range: RangeSelection) => void;
}

const useStatisticsStore = create<StatisticsStore>((set) => ({
  totalTime: 0,
  miaTime: 0,
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
  fetchDayData: async (date: Date | null) => {
    if (date) {
      date.setHours(12);
      const formattedDate = format(date, 'yyyy-MM-dd');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary/calendar?date=${formattedDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const records = data.data.records;
        const categoryMap: { [key: string]: PieData } = {};
        let total_time = 0;
        let mia_time = 0;

        records.forEach((record: any) => {
          if (categoryMap[record.categoryName]) {
            categoryMap[record.categoryName].ratio += Math.floor(record.timeBurst / 60);
          } else {
            categoryMap[record.categoryName] = {
              categoryName: record.categoryName,
              ratio: Math.floor(record.timeBurst / 60),
              color: record.color,
            };
          }
          const startTime = new Date(record.timeStart).getTime();
          const endTime = new Date(record.timeEnd).getTime();
          const activeTime = Math.floor((endTime - startTime) / 1000);
          const miaTime = activeTime - record.timeBurst;

          total_time += activeTime;
          mia_time += miaTime;

          if (categoryMap['졸음/ 자리비움']) {
            categoryMap['졸음/ 자리비움'].ratio += Math.floor(miaTime / 60);
          } else {
            categoryMap['졸음/ 자리비움'] = {
              categoryName: '졸음/ 자리비움',
              ratio: Math.floor(miaTime / 60),
              color: "#eeeeee",
            };
          }
        });

        const pieData = Object.values(categoryMap);

        set({ pieData, totalTime: total_time, miaTime: mia_time });
        console.log({ pieData, totalTime: total_time, miaTime: mia_time });
      } catch (error) {
        console.error('Error fetching data', error);
        // 데이터 로딩 실패 시 사용자에게 알림 (옵션)
        alert('Failed to load data. Please try again later.');
      }
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
  const currentDate = state.selectedDate;
  if (currentDate) {
    currentDate.setHours(12);
    const formattedDate = formatDate(currentDate);
    const day = currentDate.getDay();
    let weekDay = 0;
    if (day === 0) {
      weekDay = 7;
    } else {
      weekDay = day;
    }
    return await fetchData(
      `${process.env.NEXT_PUBLIC_API_URL}/api/statics/statistics-week?date=${formattedDate}&day=${weekDay}`,
      'Failed to fetch dailyStatistics'
    );
  }
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
