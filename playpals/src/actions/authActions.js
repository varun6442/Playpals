import jwt_decode from 'jwt-decode';

import axios from '../axios-lists';
import setAuthToken from '../utilis/setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER, SET_AUTH_LOADING, REMOVE_AUTH_LOADING } from './types';

export const registerUser = (userData, history) => dispatch => {
  dispatch(setAuthLoading());

  axios.post('/api/users/register', userData)
    .then(res => {
      const { token, email } = res.data;
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('email', email);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      decoded.email = email;
      dispatch(setCurrentUser(decoded));
      dispatch(removeAuthLoading());
      history.push('/events');
      var templateParams = {
        name: 'Shobhit Srivastava',
        email: 'Check this out!',
        to_name: 'Rishabh',
        message: 'Thanks for signing up for the playpals, see you on field',
        reply_to: email
      };

      emailjs.send('service_321oass', 'template_tazexgm', templateParams, 'r-vt4d8_Lzic8qk83')
        .then(function (response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function (error) {
          console.log('FAILED...', error);
        });
    })
    .catch(err => {
      let errorData;
      if (err.response) errorData = err.response.data;
      else errorData = { servererror: "Something went wrong on the server, Try again later!" };

      dispatch({
        type: GET_ERRORS,
        payload: errorData
      });
      dispatch(removeAuthLoading());
    });
};

export const updateUser = (userData, history) => dispatch => {
  dispatch(setAuthLoading());
  let token = localStorage.getItem('jwtToken');
  const config = {
      headers: {
          Authorization: token
      }
  };
  axios.put('/api/users/register/update', userData, config)
    .then(res => {
      localStorage.removeItem('jwtToken')
      dispatch(removeAuthLoading());
      history.push('/login');
    })
    .catch(err => {
      let errorData;
      if (err.response) errorData = err.response.data;
      else errorData = { servererror: "Something went wrong on the server, Try again later!" };

      dispatch({
        type: GET_ERRORS,
        payload: errorData
      });
    });
};

export const loginUser = (userData) => dispatch => {
  dispatch(setAuthLoading());
  axios.patch('/api/users/login', userData)
    .then(res => {
      const { token, email } = res.data;
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('email', email);
      setAuthToken(token);

      const decoded = jwt_decode(token);
      decoded.email = email;
      dispatch(setCurrentUser(decoded));
      dispatch(removeAuthLoading());
    })
    .catch(err => {
      let errorData;
      if (err.response) errorData = err.response.data;
      else errorData = { servererror: "Something went wrong on the server, Try again later!" }

      dispatch({
        type: GET_ERRORS,
        payload: errorData
      });
      dispatch(removeAuthLoading());
    });
};


export const sendOtp = (userData) => dispatch => {
  axios.post('/api/loginOtp/sendOTP', userData)
    .then(res => {
      const { hash, phone } = res.data;
      localStorage.setItem('hash', hash);
      localStorage.setItem('phone', phone);
    })
    .catch(err => {
      let errorData;
      if (err.response) errorData = err.response.data;
      else errorData = { servererror: "Something went wrong on the server, Try again later!" }

      dispatch({
        type: GET_ERRORS,
        payload: errorData
      });
    });
};

export const verifyOTP = (userData) => dispatch => {
  userData["hash"] = localStorage.getItem('hash');
  userData["phone"] = localStorage.getItem('phone');
  axios.post('/api/loginOtp/verifyOTP', userData)
    .then(res => {
      dispatch(loginUserWithOtp({ phone: userData["phone"] }));

    })
    .catch(err => {
      let errorData;
      if (err.response) errorData = err.response.data;
      else errorData = { servererror: "Something went wrong on the server, Try again later!" }

      dispatch({
        type: GET_ERRORS,
        payload: errorData
      });
    });
};

export const loginUserWithOtp = (userData) => dispatch => {
  dispatch(setAuthLoading());
  axios.patch('/api/users/loginWithOtp', userData)
    .then(res => {
      const { token, email } = res.data;
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('email', email);
      setAuthToken(token);

      const decoded = jwt_decode(token);
      decoded.email = email;
      dispatch(setCurrentUser(decoded));
      dispatch(removeAuthLoading());
    })
    .catch(err => {
      let errorData;
      if (err.response) errorData = err.response.data;
      else errorData = { servererror: "Something went wrong on the server, Try again later!" }

      dispatch({
        type: GET_ERRORS,
        payload: errorData
      });
      dispatch(removeAuthLoading());
    });
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};

const setAuthLoading = () => {
  return {
    type: SET_AUTH_LOADING
  }
}

const removeAuthLoading = () => {
  return {
    type: REMOVE_AUTH_LOADING
  }
}