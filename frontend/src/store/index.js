import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import bookdetailsReducer from './reducer/reducer'; // Correctly import the reducer
import authReducer from './reducer/authReducer'; // Correctly import the reducer
import bookReducer from './reducer/bookReducer'

const rootReducer = combineReducers({
  bookdetails: bookdetailsReducer, // Combine your bookdetails reducer
  auth: authReducer,
  books: bookReducer,

});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
