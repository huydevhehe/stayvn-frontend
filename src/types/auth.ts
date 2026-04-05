export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    createdAt: string;
    verified: boolean;
    role: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    bankCode?: string;
    isLoyalty: boolean;
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export interface AuthResponse {
    token: string
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    refreshUser: () => Promise<User | undefined>;
}