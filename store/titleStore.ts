import create from 'zustand';

interface Title {
  id: number;
  name: string;
  achieveCondition: string;
  titleColor: string;
}

interface TitleStore {
  achievedTitles: Title[];
  notAchievedTitles: Title[];
  mainTitle: Title | null;
  fetchTitles: () => Promise<void>;
  setMainTitle: (titleId: number) => Promise<void>;
}

const useTitleStore = create<TitleStore>((set) => ({
  achievedTitles: [],
  notAchievedTitles: [],
  mainTitle: null,
  fetchTitles: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      set({
        achievedTitles: data.data.achievedTitleList,
        notAchievedTitles: data.data.notAchievedTitleList,
        mainTitle: data.data.mainTitle,
      });
    } catch (error) {
      console.error('Failed to fetch titles', error);
    }
  },
  setMainTitle: async (titleId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/title/set-main-title/${titleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        set({
          mainTitle: data.data,
        });
      } else {
        console.error('Failed to set main title');
      }
    } catch (error) {
      console.error('Error setting main title', error);
    }
  },
}));

export default useTitleStore;
