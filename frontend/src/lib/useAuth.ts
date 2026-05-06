import { createContext, useContext } from "react";

export interface AuthContextType {
    user: { isLoading: boolean; user: User | null };
    logOut: () => void;
    login: (user: User) => void;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    active: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: { isLoading: false, user: null },
    logOut: () => { },
    login: () => { },
});

export const useAuth = () => useContext(AuthContext);