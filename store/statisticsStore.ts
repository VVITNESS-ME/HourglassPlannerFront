import { create } from 'zustand';

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

interface Activity {
  label: string;
  time: number;
  burst: number;
  color: string;
}

type RangeSelection = 'daily' | 'weekly' | 'monthly';

interface StatisticsStore {
  selectedDate: Date | null;
  pieData: PieData[];
  dailyData: DailyData[];
  weeklyData: MonthData[];
  monthlyData: MonthData[];
  grasses: Grass[];
  activities: Activity[];
  rangeSelection: RangeSelection;
  totalTime: number;
  miaTime: number;
  setSelectedDate: (date: Date) => void;
  fetchDayData: (date: Date | null) => void;
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
  activities: [],
  rangeSelection: 'daily',
  totalTime: 0,
  miaTime: 0,
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
    if (!date) return;

    date.setHours(12);
    const formattedDate = date.toISOString().split('T')[0];

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary/calendar?date=${formattedDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      processDayData(data.data.records, date, set);

    } catch (error) {
      console.error('Error fetching data', error);
      alert('Failed to load data. Please try again later.');
    }
  },
  setDailyData: (data) => set({ dailyData: data }),
  setWeeklyData: (data) => set({ weeklyData: data }),
  setMonthlyData: (data) => set({ monthlyData: data }),
  setGrasses: (data) => set({ grasses: data }),
  setRangeSelection: (range) => set({ rangeSelection: range }),
}));

const processDayData = (records: any[], date: Date, set: any) => {
  const categoryMap: { [key: string]: PieData } = {};
  const categoryTimes: { [key: string]: { time: number; burst: number; color: string } } = {};
  let total_time = 0;
  let mia_time = 0;
  date.setHours(0, 0, 0, 0);
  let last_activity_end = date.getTime();
  let i = 0;
  const activityList: Activity[] = [];

  records.sort((a, b) => new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime());

  records.forEach((record) => {
    updateCategoryMap(categoryMap, record);
    updateCategoryTimes(categoryTimes, record);

    const { startTime, endTime, activeTime, miaTime, unActiveTime } = calculateTimes(record, last_activity_end);
    total_time += activeTime;
    mia_time += miaTime;

    addActivities(activityList, record, unActiveTime, activeTime, i);

    if (categoryMap['졸음/ 자리비움']) {
      categoryMap['졸음/ 자리비움'].ratio += Math.floor(miaTime / 60);
    } else {
      categoryMap['졸음/ 자리비움'] = {
        categoryName: '졸음/ 자리비움',
        ratio: Math.floor(miaTime / 60),
        color: '#eeeeee',
      };
    }

    i++;
    last_activity_end = endTime;
  });

  const pieData = Object.values(categoryMap);
  date.setHours(23, 59, 59, 999);
  addFinalInactiveTime(activityList, last_activity_end, date, i);

  set({ pieData, totalTime: total_time, miaTime: mia_time, activities: activityList });
};

const updateCategoryMap = (categoryMap: { [key: string]: PieData }, record: any) => {
  if (categoryMap[record.categoryName]) {
    categoryMap[record.categoryName].ratio += Math.floor(record.timeBurst / 60);
  } else {
    categoryMap[record.categoryName] = {
      categoryName: record.categoryName,
      ratio: Math.floor(record.timeBurst / 60),
      color: record.color,
    };
  }
};

const updateCategoryTimes = (categoryTimes: { [key: string]: { time: number; burst: number; color: string } }, record: any) => {
  const startTime = new Date(record.timeStart).getTime();
  const endTime = new Date(record.timeEnd).getTime();
  const activeTime = Math.floor((endTime - startTime) / 1000);

  if (!categoryTimes[record.categoryName]) {
    categoryTimes[record.categoryName] = { time: 0, burst: 0, color: record.color };
  }
  categoryTimes[record.categoryName].time += Math.floor(activeTime / 60);
  categoryTimes[record.categoryName].burst += Math.floor(record.timeBurst / 60);
};

const calculateTimes = (record: any, last_activity_end: number) => {
  const startTime = new Date(record.timeStart).getTime();
  const endTime = new Date(record.timeEnd).getTime();
  const activeTime = Math.floor((endTime - startTime) / 1000);
  const miaTime = activeTime - record.timeBurst;
  const unActiveTime = Math.floor((startTime - last_activity_end) / 1000);
  return { startTime, endTime, activeTime, miaTime, unActiveTime };
};

const addActivities = (activityList: Activity[], record: any, unActiveTime: number, activeTime: number, i: number) => {
  activityList.push({
    label: `비활동${i}`,
    time: new Date(record.timeStart).getTime(),
    burst: unActiveTime / 3600,
    color: '#d8d8d8',
  });
  activityList.push({
    label: `${record.categoryName}${i}`,
    time: new Date(record.timeStart).getTime(),
    burst: activeTime / 3600,
    color: record.color,
  });
};

const addFinalInactiveTime = (activityList: Activity[], last_activity_end: number, date: Date, i: number) => {
  const dayEndTime = new Date(date.getTime() + 9 * 3600 * 1000).getTime();
  if (last_activity_end <= dayEndTime) {
    const unActiveTime = Math.floor((dayEndTime - last_activity_end) / 1000) - 9 * 3600;
    activityList.push({
      label: `비활동${i}`,
      time: last_activity_end,
      burst: unActiveTime / 3600,
      color: '#d8d8d8',
    });
  }
};

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
  const currentDate = state.selectedDate
  if (currentDate) {
    currentDate.setHours(12);
    const formattedDate = formatDate(currentDate);
    const day = currentDate.getDay();
    let weekDay = 0
    if (day === 0){
      weekDay = 7;
    }else{
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