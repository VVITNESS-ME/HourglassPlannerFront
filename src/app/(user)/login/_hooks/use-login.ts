import { useAuthStore } from "@/store/use-auth-store"
export const useLogin = ()=>{
  const { loginAsync } = useAuthStore()
}