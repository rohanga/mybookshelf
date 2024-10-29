// reducers/authReducer.js
const initialState = {
    loading: false,
    userInfo: null, // This could be the signed-up user data (e.g., token, user info)
    error: null,
  };
  
  export  default (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return { ...state, loading: true, error: null ,action:action.type};
        case 'LOGIN_SUCCESS':
            
            return { ...state, loading: false, userInfo: action.payload ,action:action.type};
        case 'LOGIN_FAIL':
            return { ...state, loading: false, error: action.payload ,action:action.type};
        case 'LOGOUT':
            return { ...state, userInfo: null ,action:action.type};
        case 'SIGNUP_REQUEST':
            return { ...state, loading: true ,action:action.type};
        case 'SIGNUP_SUCCESS':
            return { ...state, loading: false, userInfo: action.payload.data ,action:action.type};
        case 'SIGNUP_FAILURE':
            return { ...state, loading: false, error: action.payload ,action:action.type};
        
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
  