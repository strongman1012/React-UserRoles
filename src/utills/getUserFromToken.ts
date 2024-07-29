import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    user: any;
    exp: number;
}

const getUserFromToken = (token: string | null): any => {
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 < Date.now()) {
            // Token has expired
            localStorage.removeItem('token');
            return null;
        }
        return decoded.user;
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        return null;
    }
};

export default getUserFromToken;
