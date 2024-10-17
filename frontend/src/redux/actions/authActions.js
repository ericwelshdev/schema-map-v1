import api from '../../utils/axiosConfig';
import jwtDecode from 'jwt-decode';

// Register User
export const register = (userData) => async (dispatch) => {
  try {
    const res = await api.post('/auth/register', userData);
    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: 'REGISTER_FAIL',
      payload: error.response?.data?.message || 'Registration Failed',
    });
  }
};

// Login User
export const login = (credentials) => async (dispatch) => {
  try {
    const res = await api.post('/auth/login', credentials);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAIL',
      payload: error.response?.data?.message || 'Login Failed',
    });
  }
};

// Load User
export const loadUser = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    dispatch({
      type: 'USER_LOADED',
      payload: decoded.user,
    });
  } else {
    dispatch({
      type: 'AUTH_ERROR',
    });
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: 'LOGOUT' });
};
