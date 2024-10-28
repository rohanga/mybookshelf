import axios from 'axios';

// Action Types
export const FETCH_CURRENTLY_READING = 'FETCH_CURRENTLY_READING';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';
export const MARK_AS_FINISHED = 'MARK_AS_FINISHED';
export const FETCH_CURRENTLY_READING_SUCCESS = 'FETCH_CURRENTLY_READING_SUCCESS';
export const FETCH_CURRENTLY_READING_FAILURE = 'FETCH_CURRENTLY_READING_FAILURE';

// Action Types
export const FETCH_BOOKS_REQUEST = 'FETCH_BOOKS_REQUEST';
export const FETCH_BOOKS_SUCCESS = 'FETCH_BOOKS_SUCCESS';
export const FETCH_BOOKS_FAILURE = 'FETCH_BOOKS_FAILURE';

export const ADD_BOOK = 'ADD_BOOK';
export const UPDATE_BOOK = 'UPDATE_BOOK';
export const DELETE_BOOK = 'DELETE_BOOK';
export const MARK_AS_CURRENTLY_READING = 'MARK_AS_CURRENTLY_READING';


// Action Types

export const SEARCH_BOOKS = 'SEARCH_BOOKS';
export const ADD_BOOK_REQUEST = 'ADD_BOOK_REQUEST';
export const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';


// Action to fetch currently reading books
export const fetchCurrentlyReadingBooks = (userId) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/books/currentlyreading/${userId}`);
    const filteredData = response.data.filter(item => item.book !== null);
    dispatch({
      type: FETCH_CURRENTLY_READING_SUCCESS,
      payload: filteredData
    });
  } catch (error) {
    dispatch({
      type: FETCH_CURRENTLY_READING_FAILURE,
      payload: error.message
    });
  }
};

// Action to update progress of a book
export const updateProgress = (userId, bookId, progress, comment) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:5000/books/update-progress', { userId, bookId, progress, comment });
    dispatch({
      type: UPDATE_PROGRESS,
      payload: response.data
    });
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

// Action to mark a book as finished
export const markAsFinished = (userId, bookId) => async (dispatch) => {
  try {
    await axios.post('http://localhost:5000/books/mark-as-finished', { userId, bookId });
    dispatch(fetchCurrentlyReadingBooks(userId)); // Fetch books again after marking as finished
  } catch (error) {
    console.error('Error marking book as finished:', error);
  }
};


// Action Creators
export const fetchBooks = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_BOOKS_REQUEST });
  try {
    const response = await axios.get(`http://localhost:5000/books/${userId}`);
    const currentlyReadingResponse = await axios.get(`http://localhost:5000/books/currentlyreading/${userId}`);
    const readingBooksSet = currentlyReadingResponse.data.map((x) => x.book.bookId);
    dispatch({ type: FETCH_BOOKS_SUCCESS, payload: { books: response.data, currentlyReading: readingBooksSet } });
  } catch (error) {
    dispatch({ type: FETCH_BOOKS_FAILURE, error });
  }
};

export const addBook = (book) => ({
  
  type: ADD_BOOK,
  payload: book,
});

export const updateBook = (bookId, updates) => async (dispatch) => {
  try {
    await axios.put(`http://localhost:5000/books/update/${bookId}`, updates);
    dispatch({
      type: UPDATE_BOOK,
      payload: { bookId, updates },
    });
  } catch (error) {
    console.error('Error updating book:', error);
  }
};

export const deleteBook = (bookId) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:5000/books/delete/${bookId}`);
    dispatch({
      type: DELETE_BOOK,
      payload: bookId,
    });
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

export const markAsCurrentlyReading = (userId, bookId) => async (dispatch) => {
  try {
    await axios.post('http://localhost:5000/books/markcurrentlyreading', { userId, bookId });
    dispatch({
      type: MARK_AS_CURRENTLY_READING,
      payload: bookId,
    });
  } catch (error) {
    console.error('Error marking book as currently reading:', error);
  }
};


export const searchBooks = (searchQuery) => async (dispatch) => {
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`);
    const books = response.data.items || []; // Default to an empty array if items is undefined
    dispatch({ type: SEARCH_BOOKS, payload: books });
  } catch (error) {
    console.error('Error searching books:', error);
    dispatch({ type: SET_ERROR_MESSAGE, payload: 'Error searching for books.' });
  }
};

export const addBookRequest = (book, userId) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/books/${userId}`);
    const existingBooks = response.data;
    
    if (existingBooks.some(existingBook => existingBook.bookId === book.id)) {
      dispatch({ type: SET_ERROR_MESSAGE, payload: `${book.volumeInfo.title} is already in your bookshelf.` });
      return;
    }

    const bookData = {
      userId,
      bookId: book.id,
      title: book.volumeInfo.title || "Untitled",
      authors: book.volumeInfo.authors || ["Unknown Author"],
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "path/to/placeholder-image.jpg",
      averageRating: book.volumeInfo.averageRating || 0,
    };

    await axios.post('http://localhost:5000/books/add', bookData);
    dispatch({ type: ADD_BOOK_REQUEST, payload: bookData });
    dispatch({ type: SET_SUCCESS_MESSAGE, payload: `${book.volumeInfo.title} has been added to your bookshelf!` });
  } catch (error) {
    console.error('Error adding book:', error);
  }
};

export const clearMessages = () => {
  return (dispatch) => {
    dispatch({ type: SET_SUCCESS_MESSAGE, payload: '' });
    dispatch({ type: SET_ERROR_MESSAGE, payload: '' });
  };
};
