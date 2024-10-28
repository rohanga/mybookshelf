import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BookSearch from '../booksearch/bookssearch';
import './bookshelf.css';
import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
  markAsCurrentlyReading,
} from '../../store/action/bookAction';

// Banner image URL
const bannerImage = 'https://png.pngtree.com/thumb_back/fw800/background/20230615/pngtree-collection-of-books-on-a-shelf-image_2908926.jpg';

function Bookshelf() {
  const userId = localStorage.getItem('userId'); // Get user ID from local storage
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { books, currentlyReading, loading, error } = useSelector((state) => state.books);
  const [currentRating, setCurrentRating] = useState({});
  const [reviewDraft, setReviewDraft] = useState({});

  // Fetch books when component mounts
  useEffect(() => {
    if (userId) {
      dispatch(fetchBooks(userId));
    } else {
      // Handle case when userId is not found (e.g., redirect to login)
      navigate('/login');
    }
  }, [dispatch, userId, navigate]);

  // Function to add a book to the bookshelf
  const addBookToBookshelf = (book) => {
    dispatch(addBook(book));
  };

  // Function to update book details
  const updateBookDetails = async (bookId, updates) => {
    await dispatch(updateBook(bookId, updates));
    dispatch(fetchBooks(userId)); // Re-fetch books after update
  };

  // Debounced function to update book details
  const debouncedUpdateBookDetails = useCallback(
    debounce((bookId, updates) => {
      updateBookDetails(bookId, updates);
    }, 500),
    []
  );

  // Handle review text change
  const handleReviewChange = (bookId, value) => {
    setReviewDraft((prev) => ({ ...prev, [bookId]: value }));
  };

  // Function to handle blur event on the review textarea
  const handleReviewBlur = (bookId) => {
    const review = reviewDraft[bookId] || "";
    debouncedUpdateBookDetails(bookId, { userReview: review });
  };

  // Function to delete a book from the shelf
  const deleteBookFromShelf = async (bookId) => {
    await dispatch(deleteBook(bookId));
    dispatch(fetchBooks(userId)); // Re-fetch books after deletion
  };

  // Function to mark a book as currently reading
  const markAsReading = (bookId) => {
    dispatch(markAsCurrentlyReading(userId, bookId));
    dispatch(fetchBooks(userId)); // Re-fetch books after marking
  };

  // Navigate to book details page
  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  // Handle rating for a book
  const handleRating = (bookId, rating) => {
    setCurrentRating((prev) => ({ ...prev, [bookId]: rating }));
    updateBookDetails(bookId, { userRating: rating });
  };

  // Check if a book is currently being read
  const isCurrentlyReading = (bookId) => {
    return currentlyReading.includes(bookId);
  };

  // Display loading or error messages
  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error loading books: {error.message}</p>;

  // Ensure books is an array
  const booksToDisplay = books || [];

  return (
    <div className="bookshelf">
      {/* Book Animation Banner */}
      <div className="banner">
        <img src={bannerImage} alt="Bookshelf Banner" className="banner-image" />
        <div className="banner-text">
          <h1>Welcome to Your Bookshelf</h1>
          <p>Add and manage your favorite books here!</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <BookSearch userId={userId} onAddBook={addBookToBookshelf} />
      </div>

      {/* Check if books exist */}
      {booksToDisplay.length === 0 ? (
        <div className="no-books-message">
          <h3>No books available, please search for something!</h3>
        </div>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {booksToDisplay.map((book) => (
              <tr key={book._id}>
                <td>
                  <img src={book.thumbnail} alt={book.title} className="book-cover" />
                </td>
                <td className="pointer"onClick={() => handleBookClick(book.bookId)}>{book.title}</td>
                <td>{(book.authors || ['Unknown Author']).join(", ")}</td>

                <td>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= (currentRating[book._id] || book.userRating) ? "star filled" : "star"}
                        onClick={() => handleRating(book._id, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <textarea
                    value={reviewDraft[book._id] || book.userReview || ""}
                    onChange={(e) => handleReviewChange(book._id, e.target.value)}
                    onBlur={() => handleReviewBlur(book._id)}
                    className="review-textarea"
                  />
                </td>
                <td>
                  {isCurrentlyReading(book.bookId) ? (
                    <span className="currently-reading-text">Currently Reading</span>
                  ) : (
                    <button onClick={() => markAsReading(book._id)} className="action-button">
                      Mark as Currently Reading
                    </button>
                  )}
                  <button onClick={() => deleteBookFromShelf(book._id)} className="action-button remove">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Helper function for debouncing
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default Bookshelf;
