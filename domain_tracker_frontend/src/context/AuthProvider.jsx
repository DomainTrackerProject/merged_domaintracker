import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import apiClient from "../services/api.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ user: null, token: null });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAuth({ user: decoded, token });
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const login = async (formData) => {
        try {
            const response = await apiClient.request("post", "/token", formData);
            const token = response.access_token;
            localStorage.setItem("token", token);
            const decoded = jwtDecode(token);
            setAuth({ user: decoded, token }); 
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuth({ user: null, token: null });
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;