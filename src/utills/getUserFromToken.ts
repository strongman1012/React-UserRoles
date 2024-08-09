import { jwtDecode } from 'jwt-decode';
import { logout } from 'src/reducers/auth/authSlice';

interface DecodedToken {
    user: any;
    exp: number;
}

const getUserFromToken = (token: string | null): any => {
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp * 1000 < Date.now()) {
        // Token has expired
        logout();
        return null;
    }
    return decoded.user;
};

export default getUserFromToken;
