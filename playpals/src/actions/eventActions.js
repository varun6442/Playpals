import axios from '../axios-lists';

import { GET_EVENTS, GET_EVENT, EVENT_LOADING, GET_ERRORS, CLEAR_ERRORS, DELETE_EVENT, GET_NOTIFICATION, CHANGE_SNACKBAR_MESSAGE } from './types';

export const getAllEvents = () => dispatch => {

    let token = localStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    dispatch(setEventLoading());
    dispatch(getNotification());
    axios.get('/api/events/all', config)
        .then(res => {
            dispatch({
                type: GET_EVENTS,
                payload: res.data
            });
        })
        .catch(err =>
            dispatch({
                type: GET_EVENTS,
                payload: {}
            })
        );
};

export const getEvents = sport => dispatch => {
    dispatch(setEventLoading());
    dispatch(getNotification());
    let token = localStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    let url = '/api/events/events';
    if (sport && sport !== 'All Sports') url = `/api/events/events?sport=${sport}`;

    axios.get(url, config)
        .then(res => {
            dispatch({
                type: GET_EVENTS,
                payload: res.data
            });
        })
        .catch(err =>
            dispatch({
                type: GET_EVENTS,
                payload: {}
            })
        );
};

export const getEvent = (id) => dispatch => {
    let token = localStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    dispatch(setEventLoading());
    dispatch(getNotification());
    axios
        .get(`/api/events/${id}`, config)
        .then(res =>
            dispatch({
                type: GET_EVENT,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_EVENT,
                payload: null
            })
        );
};

export const createEvent = (eventData, history) => dispatch => {
    let token = localStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    axios
        .post('/api/events', eventData, config)
        .then(res => history.push('/events'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const addComment = (eventID, commentData, history) => dispatch => {
    let token = localStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    dispatch(clearErrors());
    axios
        .post(`/api/events/${eventID}/comments`, commentData, config)
        .then(res =>
            dispatch({
                type: GET_EVENT,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const deleteEvent = id => dispatch => {
    let token = localStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    axios
        .delete(`/api/events/${id}`, config)
        .then(res =>
            dispatch({
                type: DELETE_EVENT,
                payload: id
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const deleteComment = (eventID, com_id) => dispatch => {
    let token = localStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    axios
        .delete(`/api/events/${eventID}/comments/${com_id}`, config)
        .then(res =>
            dispatch({
                type: GET_EVENT,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const joinEvent = (eventID) => dispatch => {
    let token = localStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    axios
        .put(`/api/events/${eventID}/join`, {},config)
        .then(res => {
            debugger
            dispatch({
                type: CHANGE_SNACKBAR_MESSAGE,
                payload: res.data.join
            });
            dispatch({
                type: GET_EVENT,
                payload: res.data.event
            });
        })
        .catch(err => {
            if (err.response) {
                dispatch({
                    type: CHANGE_SNACKBAR_MESSAGE,
                    payload: err.response.data.error
                })
            }
        });
};

export const flagEvent = (eventID) => dispatch => {
    axios
        .put(`/api/events/${eventID}/flag`)
        .then(res => {
            dispatch({
                type: GET_EVENT,
                payload: res.data.event
            });
        })
};

export const setEventLoading = () => {
    return {
        type: EVENT_LOADING
    };
};

// Clear errors
export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    };
};

export const getNotification = () => dispatch => {
    axios
        .get(`/api/notification`)
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