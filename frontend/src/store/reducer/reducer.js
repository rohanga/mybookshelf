const initState = {
    books: [], // Array of all books
    selectedBook: null, // The currently selected book
    comments: [] // Comments for the selected book
  };
  
  export default (state = initState, action) => {
    switch (action.type) {
      case "GET_BOOK_BY_ID": {
        return {
          ...state,
          selectedBook: action.payload.book, // Update the selected book
          comments: action.payload.comment // Update the comments
        };
      }
      default: {
        return state;
      }
    }
  };
  