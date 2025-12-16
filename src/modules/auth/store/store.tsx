import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User{
    id: string,
    name: string,
    email: string,
    companyName: string,
    role: "superadmin" | "admin" | "developers"
}

interface AuthState{
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isHydrated:boolean

    login: (user:User,token: string)=>void
    logout:()=>void
    setHydrated:()=>void

}


export const UserAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated() 
      },
    }
  )
)



