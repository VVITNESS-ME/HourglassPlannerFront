import {create} from "zustand";
import Cookies from "js-cookie";

type AuthState = {
  email: string;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  email: "",
  token: null,
  error: null,
  login: async (email, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
<<<<<<< HEAD
      let token = data.token;

      if (token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      // 환경변수에서 만료일을 가져와 설정 (기본값은 1일)
      const expires = parseInt(process.env.NEXT_ACCESS_TOKEN_EXPIRES || '1');

      Cookies.set(process.env.NEXT_ACCESS_TOKEN_KEY || 'token', token, { expires }); // 만료일을 설정하여 쿠키 저장
      set({ email, token, error: null });
=======

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      console.log(data);
      console.log(data.data.authToken);
      Cookies.set("token", data.data.authToken, { expires: 1 }); // 1일 후 만료
      set({ email, token: data.data.authToken, error: null });

>>>>>>> main
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message || "Login failed" });
      } else {
        set({ error: "An unknown error occurred" });
      }
    }
  },
  logout: () => {
    Cookies.remove(process.env.NEXT_ACCESS_TOKEN_KEY);
    set({ email: "", token: null, error: null });
  },
  initialize: () => {
    const token = Cookies.get(process.env.NEXT_ACCESS_TOKEN_KEY);
    if (token) {
      set({ token, email: "", error: null });
    }
  },
}));

export default useAuthStore;
