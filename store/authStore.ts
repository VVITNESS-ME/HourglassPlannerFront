import { create } from 'zustand';
import Cookies from 'js-cookie';

type AuthState = {
  email: string;
  token: string | null;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
};

const useAuthStore = create<AuthState>((set, get) => ({
  email: "",
  token: null,
  error: null,
  isInitialized: false,  // 초기화 상태 추가
  login: async (email, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      let token = data.data.authToken;
      console.log(data);
      console.log(token);

      const expires = parseInt(process.env.NEXT_ACCESS_TOKEN_EXPIRES || '1', 10);

      Cookies.set(process.env.NEXT_ACCESS_TOKEN_KEY || 'token', token, { expires }); // 만료일을 설정하여 쿠키 저장
      set({ email, token, error: null });
      const state = get();
      Cookies.set('authState', JSON.stringify(state), { expires });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message || "Login failed" });
      } else {
        set({ error: "An unknown error occurred" });
      }
    }
  },
  logout: () => {
    Cookies.remove(process.env.NEXT_ACCESS_TOKEN_KEY || 'token'); // 기본값 'token' 설정
    set({ email: "", token: null, error: null });
    Cookies.remove('authState');
  },
  initialize: () => {
    const authState = Cookies.get('authState');
    if (authState) {
      const parsedState = JSON.parse(authState);
      set({
        email: parsedState.email || "",
        token: parsedState.token || null,
        error: parsedState.error || null,
        isInitialized: true,  // 초기화 완료
      });
    } else {
      set({
        email: "",
        token: null,
        error: null,
        isInitialized: true,  // 초기화 완료
      });
    }
  },
}));

export default useAuthStore;
