import axios from '../axios-lists';

import { GET_NOTIFICATION } from './types';

export const getNotification = () => dispatch => {
    let token = localStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    axios
        .get(`/api/notification`, config)
        .then(res =>
            dispatch({
                type: GET_NOTIFICATION,
                payload: res.data
            })
        )
        .catch(err =>
            console.log(err)
        );
};

export const checkNotification = () => dispatch => {
    axios
        .put(`/api/notification/check`)
        .catch(err =>
            console.log(err)
        );
};

export const removeNotification = id => dispatch => {
    axios
        .delete(`/api/notification/${id}`)
        .then(res =>
            dispatch(getNotification())
        )
        .catch(err =>
            console.log(err)
        );
};