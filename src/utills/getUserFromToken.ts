import { jwtDecode } from 'jwt-decode';
import { logout } from 'src/reducers/auth/authSlice';
import { AppDispatch } from 'src/store/store';

export interface DecodedToken {
    user: any;
    exp: number;
}

const getUserFromToken = (token: string | null, dispatch: AppDispatch): any => {
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp * 1000 < Date.now()) {
        // Token has expired
        dispatch(logout());
        return null;
    }
    return decoded.user;
};

export default getUserFromToken;
