import create from "zustand";

type AuthState = {
  email: string;
  token: string | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  email: "",
  token: null,
  error: null,
  login: async (email, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
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
      set({ email, token: data.token, error: null });
    } catch (error) {
      set({ error: error.message || "Login failed" });
    }
  },
  logout: () => set({ email: "", token: null, error: null }),
}));

export default useAuthStore;
