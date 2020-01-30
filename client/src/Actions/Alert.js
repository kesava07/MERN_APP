import * as actionTypes from './Types';
import uuid from 'uuid';

export const setAlert = (msg, alertType, timeOut = 5000) => (dispatch) => {
    const id = uuid.v4();
    dispatch({
        type: actionTypes.SET_ALERT,
        payload: { id, msg, alertType }
    });
    setTimeout(() => {
        dispatch({
            type: actionTypes.REMOVE_ALERT,
            payload: id
        });
    }, timeOut)
}
