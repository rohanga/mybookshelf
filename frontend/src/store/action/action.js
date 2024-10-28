
  
export const getBook = (bookId) => dispatch => {
    console.log("Fetching book with ID:", bookId);
    return fetch(`http://localhost:5000/books/getbook/${bookId}`)
      .then(res => res.json())
      .then(response => {
        dispatch({
          type: "GET_BOOK_BY_ID",
          payload: response, // Dispatch the entire response (book data)
        });
      })
      .catch(error => console.error('Error fetching book:', error));
  };
  