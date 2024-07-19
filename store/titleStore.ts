import create from 'zustand';
import { decodeJwt } from "./(auth)/jwtDecode";
import Cookies from "js-cookie";

interface Title {
  id: number;
  name: string;
  achieveCondition: string;
  titleColor: string;
}

interface TitleStore {
  achievedTitles: Title[];
  notAchievedTitles: Title[];
  userName: string;
  mainTitle: Title | null;
  fetchTitles: () => Promise<void>;
  setMainTitle: (titleId: number) => Promise<void>;
}

const useTitleStore = create<TitleStore>((set) => ({
  achievedTitles: [],
  notAchievedTitles: [],
  userName: '',
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
      const token = Cookies.get(process.env.NEXT_ACCESS_TOKEN_KEY || 'token') || '';
      const decoded = decodeJwt(token);
      set({
        achievedTitles: data.data.achievedTitleList,
        notAchievedTitles: data.data.notAchievedTitleList,
        mainTitle: data.data.mainTitle,
        userName: decoded.sub,
      });
      console.log(decoded.sub);
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
