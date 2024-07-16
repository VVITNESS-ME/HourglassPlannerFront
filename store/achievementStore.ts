import { create } from 'zustand'; // zustand를 사용하여 상태 관리

interface AchievementEvent {
  type: string;
  first?: boolean;
  duration?: number;
  dday?: number;
  [key: string]: any;
}

interface Achievement {
  title: string;
  condition: (event: AchievementEvent) => boolean;
  achieved: boolean;
  notified: boolean; // 추가된 상태
}

interface AchievementStore {
  achievements: Achievement[];
  checkAchievements: (event: AchievementEvent) => void;
  markAsNotified: (title: string) => void;
}

const useAchievementStore = create<AchievementStore>((set) => ({
  achievements: [
    {
      title: '시작이 반',
      condition: (event: AchievementEvent) => event.type === 'timerEnd' && event.first === true,
      achieved: true,
      notified: false,
    },
    {
      title: '망부석',
      condition: (event: AchievementEvent) => event.type === 'noBreaks' && event.duration !== undefined && event.duration >= 180,
      achieved: false,
      notified: false,
    },
    // 다른 업적들 추가...
  ],
  checkAchievements: (event: AchievementEvent) => set((state) => {
    const updatedAchievements = state.achievements.map((ach) => {
      if (!ach.achieved && ach.condition(event)) {
        return { ...ach, achieved: true };
      }
      return ach;
    });
    return { achievements: updatedAchievements };
  }),
  markAsNotified: (title: string) => set((state) => {
    const updatedAchievements = state.achievements.map((ach) => {
      if (ach.title === title) {
        return { ...ach, notified: true };
      }
      return ach;
    });
    return { achievements: updatedAchievements };
  }),
}));

export default useAchievementStore;
