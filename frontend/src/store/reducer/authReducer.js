// reducers/authReducer.js
const initialState = {
    loading: false,
    userInfo: null, // This could be the signed-up user data (e.g., token, user info)
    error: null,
  };
  
  export  default (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
            
            return { ...state, loading: false, userInfo: action.payload };
        case 'LOGIN_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'LOGOUT':
            return { ...state, userInfo: null };
        case 'SIGNUP_REQUEST':
            return { ...state, loading: true };
        case 'SIGNUP_SUCCESS':
            return { ...state, loading: false, userInfo: action.payload.data };
        case 'SIGNUP_FAILURE':
            return { ...state, loading: false, error: action.payload };
        
        case 'LOGOUT':
                return {
                  ...state,
                  isAuthenticated: false,
                };
        case 'RESET_AUTH_STATE':  // Reset the state after successful login
            return { ...initialState };
        default:
            return state;
    }
  };
  