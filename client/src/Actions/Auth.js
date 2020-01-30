import * as actionTypes from './Types';
import Axios from 'axios';
import { setAlert } from './Alert';
import setAuthToken from '../Utils/SetAuthToken';

export const register = ({ name, email, password }) => async (dispatch) => {
    const body = { name, email, password };
    try {
        const response = await Axios.post("/api/users", body);
        dispatch({
            type: actionTypes.REGISTER_SUCCESS,
            payload: response.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 3000)));
        }
        dispatch({
            type: actionTypes.REGISTER_FAIL
        })
    }
}

export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await Axios.get("/api/auth");
        dispatch({
            type: actionTypes.LOADED_USER,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: actionTypes.AUTH_ERROR
        });
    }
}

export const loginUser = ({ email, password }) => async dispatch => {
    const body = { email, password }
    try {
        const response = await Axios.post('/api/auth', body);
        dispatch({
            type: actionTypes.LOGIN_SUCCESS,
            payload: response.data
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 3000)));
        }
        dispatch({
            type: actionTypes.LOGIN_FAIL
        })
    }
}

export const logout = () => dispatch => {
    dispatch({
        type: actionTypes.LOGOUT_USER
    })
}