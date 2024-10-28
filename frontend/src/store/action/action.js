
  
export const getBook = (bookId) => dispatch => {
    console.log("Fetching book with ID:", bookId);
    return fetch(`${process.env.REACT_APP_HOST_URL}/books/getbook/${bookId}`)
      .then(res => res.json())
      .then(response => {
        dispatch({
          type: "GET_BOOK_BY_ID",
          payload: response, // Dispatch the entire response (book data)
        });
      })
      .catch(error => console.error('Error fetching book:', error));
  };
  