import { useEffect } from 'react';
import axiosAuth from '../services/authService.jsx';
import useAuth from '../context/useAuth.jsx';

const useAxiosPrivate = () => {
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosAuth.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept);
        };
    }, [auth]);

    return axiosAuth;
};

export default useAxiosPrivate;