// actions/authActions.js
import axios from 'axios';
export const signup = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: 'SIGNUP_REQUEST' });

    const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/signup`, { email, password });
    console.log("&&&&&&&&&&&&&&&&&&&&&&>", response.data)
    dispatch({
      type: 'SIGNUP_SUCCESS',
      payload: JSON.parse(JSON.stringify(response)), // you can adjust this based on your API response
    });

  } catch (error) {
    console.log(error)
    dispatch({
      type: 'SIGNUP_FAILURE',
      payload: error.response.data
    });
  }
};


export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });
    const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/login`, { email, password });

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        token: response.data.token,
        userId: response.data.userId,
      },
    });

    // Save token and userId in localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.userId);

  } catch (error) {
    console.log(error)
    dispatch({
      type: 'LOGIN_FAIL',
      payload: error.response && error.response.data
        ? error.response.data 
        : 'Login failed',
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  dispatch({
    type: 'LOGOUT'
  });
};
