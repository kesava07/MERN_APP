import * as actionTypes from '../Actions/Types';

const initialState = {
    token: localStorage.getItem("token"),
    user: null,
    isAuthenticated: null,
    loading: true
}

export default function AuthReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case actionTypes.LOADED_USER:
            return {
                ...state,
                user: payload,
                isAuthenticated: true,
                loading: false
            }
        case actionTypes.REGISTER_SUCCESS:
        case actionTypes.LOGIN_SUCCESS:
            localStorage.setItem("token", payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case actionTypes.REGISTER_FAIL:
        case actionTypes.AUTH_ERROR:
        case actionTypes.LOGIN_FAIL:
        case actionTypes.LOGOUT_USER:
            localStorage.removeItem('token');
            return {
                ...state,
                isAuthenticated: null,
                loading: false,
                token: null,
                user: null
            }
        default: return state
    }
} 