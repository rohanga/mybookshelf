import React, { useState } from 'react';
import axios from 'axios';
import "./booksearch.css";

function SearchBooks({ userId,onAddBook }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Error message for duplicate book

  const searchBooks = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key='AIzaSyDeT5IqFA72X3H8ixLfC3xZMSuyiQyQJw4'`
      );
      setBooks(response.data.items);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const checkBookExists = async (bookId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/books/${userId}`);
      const existingBooks = response.data;
      console.log("existingBooks====>",existingBooks)
      return existingBooks.some(book => book.bookId === bookId);
    } catch (error) {
      console.error('Error checking existing bookshelf:', error);
      return false;
    }
  };

  const addBook = async (book) => {
    try {
      const userId = localStorage.getItem("userId");

      // Check if the book is already present in the bookshelf
      const bookExists = await checkBookExists(book.id);
      console.log("bookExists===========>",bookExists)
      if (bookExists) {
        setErrorMessage(`${book.volumeInfo.title} is already in your bookshelf.`);
        setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
        return;
      }

      const bookData = {
        userId: userId,
        bookId: book.id,
        title: book.volumeInfo.title || "Untitled",
        authors: book.volumeInfo.authors || ["Unknown Author"],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || "path/to/placeholder-image.jpg",
        averageRating: book.volumeInfo.averageRating || 0,
      };

      await axios.post(`${process.env.REACT_APP_HOST_URL}/books/add`, bookData);
      console.log("bookData===========>",bookData)
      onAddBook(bookData);

      setSuccessMessage(`${book.volumeInfo.title} has been added to your bookshelf!`);

      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className="book-search">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for books"
        className="search-input"
      />
      <button onClick={searchBooks} className="search-button">Search</button>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Flex container for book items */}
      <div className="book-grid">
        {books.map((book) => (
          <div key={book.id} className="book-item">
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || "path/to/placeholder-image.jpg"}
              alt={book.volumeInfo.title || "No Title"}
              className="book-thumbnail"
            />
            <h3 className="book-title">{book.volumeInfo.title || "Untitled"}</h3>
            <p className="book-author">Author: {book.volumeInfo.authors?.join(', ') || "Unknown Author"}</p>
            <button onClick={() => addBook(book)} className="add-button">
              Add to Bookshelf
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBooks;
