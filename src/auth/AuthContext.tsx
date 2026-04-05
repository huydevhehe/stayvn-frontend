import { createContext, useState, useEffect, useContext } from "react"
import axiosClient from "../api/axiosClient"
import type { AuthContextType, User } from "../types/auth"

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const isAuthenticated = !!user;

    const login = async (email: string, password: string) => {
        const res = await axiosClient.post("/auth/login", {
            email,
            password
        })
        localStorage.setItem("token", res.data.token)
        const me = await axiosClient.get("/auth/me")
        const userData = {
            ...me.data,
            isLoyalty: !!me.data.isLoyalty
        }
        setUser(userData)
        return userData
    }

    const register = async (name: string, email: string, password: string) => {
        await axiosClient.post("/auth/register", {
            name,
            email,
            password
        })
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                setLoading(false)
                return
            }
            const res = await axiosClient.get("/auth/me")
            setUser({
                ...res.data,
                isLoyalty: !!res.data.isLoyalty
            })
        } catch {
            logout()
        }
        setLoading(false)
    }

    const refreshUser = async () => {
        try {
            const res = await axiosClient.get("/auth/me")
            const userData = {
                ...res.data,
                isLoyalty: !!res.data.isLoyalty
            }
            setUser(userData)
            return userData
        } catch (err) {
            console.error("Refresh user failed", err)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            register,
            logout,
            loading,
            setUser,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}