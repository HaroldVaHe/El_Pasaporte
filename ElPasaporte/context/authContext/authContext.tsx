import { User } from "@/interfaces/common";
import { createContext } from "react";
import { ReactNode, useState } from "react";

interface authContextProps {
    login: (email: string, password: string) => void;
    register: (user: User) => void;
    updateRole: (role: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<authContextProps | null>(null);

export const AuthProvider = ({ children }:any) => {

    const login=(email:string, password:string)=>{

    }
    const register=(user:User)=>{

    }

    const updateRole=(role:string)=>{

    }

    const logout=()=>{

    }

    return (
        <AuthContext.Provider
         value={{

            login,
            register,
            updateRole,
            logout
            }}>
            {children}
        </AuthContext.Provider>
    );
};