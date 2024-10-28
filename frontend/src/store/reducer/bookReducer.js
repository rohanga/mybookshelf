import {
  FETCH_CURRENTLY_READING,
  FETCH_CURRENTLY_READING_SUCCESS,
  FETCH_CURRENTLY_READING_FAILURE,
  UPDATE_PROGRESS,
  MARK_AS_FINISHED,
  FETCH_BOOKS_REQUEST,
  FETCH_BOOKS_SUCCESS,
  FETCH_BOOKS_FAILURE,
  ADD_BOOK,
  UPDATE_BOOK,
  DELETE_BOOK,
  MARK_AS_CURRENTLY_READING,

  SEARCH_BOOKS,
  ADD_BOOK_REQUEST,
  SET_SUCCESS_MESSAGE,
  SET_ERROR_MESSAGE,

} from '../action/bookAction';

const initialState = {
  currentlyReading: [],
  books: [],
  loading: false,
  error: null,
  successMessage: ''
};

const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CURRENTLY_READING:
      return { ...state, loading: true };
    case FETCH_CURRENTLY_READING_SUCCESS:
      return { ...state, loading: false, currentlyReading: action.payload };
    case FETCH_CURRENTLY_READING_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_PROGRESS:
      return { ...state, currentlyReading: action.payload };
    case MARK_AS_FINISHED:
      return { ...state, currentlyReading: action.payload };
    case FETCH_BOOKS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_BOOKS_SUCCESS:
      return {
        ...state,
        loading: false,
        books: action.payload.books,
        currentlyReading: action.payload.currentlyReading,
      };

    case FETCH_BOOKS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case ADD_BOOK:
      console.log("ADDBOOK====>",state)
      return {
        ...state,
        books: [...state?.books, action.payload],
      };

    case UPDATE_BOOK:
      return {
        ...state,
        books: state.books.map((book) =>
          book._id === action.payload.bookId
            ? { ...book, ...action.payload.updates }
            : book
        ),
      };

    case DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter((book) => book._id !== action.payload),
      };

    case MARK_AS_CURRENTLY_READING:
      return {
        ...state,
        currentlyReading: [...state.currentlyReading, action.payload],
      };


    case SEARCH_BOOKS:
      return { ...state, books: action.payload };
    case ADD_BOOK_REQUEST:
      return { ...state, books: [...state.books, action.payload] };
    case SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload };
    case SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload };

    default:
      return state;
  }
};

export default bookReducer;



// src/redux/bookReducer.js
