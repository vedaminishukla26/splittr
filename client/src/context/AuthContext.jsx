import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if(storedUser && token) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false);
    }, [])

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
    }

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider')   
    }
    return context;
}

