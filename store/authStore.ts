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

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      console.log(data);
      console.log(data.data.authToken);
      Cookies.set("token", data.data.authToken, { expires: 1 }); // 1일 후 만료
      set({ email, token: data.data.authToken, error: null });

    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message || "Login failed" });
      } else {
        set({ error: "An unknown error occurred" });
      }
    }
  },
  logout: () => {
    Cookies.remove("token");
    set({ email: "", token: null, error: null });
  },
  initialize: () => {
    const token = Cookies.get("token");
    if (token) {
      set({ token, email: "", error: null });
    }
  },
}));

export default useAuthStore;
