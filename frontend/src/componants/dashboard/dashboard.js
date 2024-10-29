import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentlyReadingBooks, updateProgress, markAsFinished } from '../../store/action/bookAction';
import './dashboard.css';
import { PuffLoader } from 'react-spinners'; // Import the spinner

const bannerImage = "https://t4.ftcdn.net/jpg/06/88/66/31/360_F_688663136_CYDZXf10utvUG7QScsByISc5AaEDf68F.jpg";

const Dashboard = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  // const { currentlyReading, loading, error } = useSelector((state) => state.books);
  const userstate=useSelector((state) => state.books);
 const  currentlyReading=userstate.currentlyReading
 const loading=userstate.loading
 const error=userstate.error
 const action=userstate.action

  console.log(useSelector((state) => state.books))
  const [comments, setComments] = useState({}); // State to hold comments for each book

  useEffect(() => {
    if (userId) {
      dispatch(fetchCurrentlyReadingBooks(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    // Initialize comments from currently reading books
    const initialComments = {};
    currentlyReading.forEach(item => {
      if (item.comment) {
        initialComments[item.book._id] = item.comment;
      }
    });
    setComments(initialComments);
  }, [currentlyReading]);

  const handleUpdateProgress = (bookId, progress, comment) => {
    dispatch(updateProgress(userId, bookId, progress, comment));
  };

  const debouncedUpdateProgress = useCallback(
    debounce((bookId, progress, comment) => {
      handleUpdateProgress(bookId, progress, comment);
    }, 500), // Adjust the delay as needed
    []
  );

  const handleMarkAsFinished = (bookId) => {
    dispatch(markAsFinished(userId, bookId));
  };
  console.log(currentlyReading)
  if (action!="FETCH_CURRENTLY_READING_SUCCESS") {
    return (
    <div className="loading-container">
      <PuffLoader color="#007bff"  size={50} />
      <p>Loading Your reading books dashboard...</p>
    </div>
  );
}
  return (
    <div className="dashboard">
      <div className="banner">
        <img src={bannerImage} alt="Bookshelf Banner" className="banner-image" />
        <div className="banner-text">
          <p>Manage Your Book Collection and Track Your Reading Progress!</p>
        </div>
      </div>

      <h2>Currently Reading</h2>
      {loading ? (
        <p></p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : currentlyReading.length === 0 ? (
        <p>No books currently being read.</p>
      ) : (
        currentlyReading.map((item) => (
          item.book && (
            <div className="book-card" key={item.book._id}>
              <div className="book-image-container">
                {item.book.thumbnail ? (
                  <img className="book-thumbnail" src={item.book.thumbnail} alt={item.book.title} />
                ) : (
                  <p>No thumbnail available</p>
                )}
              </div>
              <div className="book-details">
                <h3 className="book-title">{item.book.title}</h3>
                <p className="book-author">Author: {item.book.authors.join(', ')}</p>

                <div className="progress-container">
                  <label>Progress: {item.progress}%</label>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>

                <div className="comment-section">
                  <label>Comment: </label>
                  <textarea
                    placeholder="Add a comment"
                    value={comments[item.book._id] || ""}
                    onChange={(e) => setComments((prev) => ({ ...prev, [item.book._id]: e.target.value }))}
                    onBlur={() => debouncedUpdateProgress(item.book._id, item.progress, comments[item.book._id])}
                  ></textarea>
                </div>

                <button className="finish-button" onClick={() => handleMarkAsFinished(item.book._id)}>
                  I've finished
                </button>

                <div className="update-progress">
                  <label>Update Progress: </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.progress}
                    onChange={(e) => {
                      const newProgress = e.target.value;
                      debouncedUpdateProgress(item.book._id, newProgress, comments[item.book._id]);
                    }}
                  />
                </div>
              </div>
            </div>
          )
        ))
      )}
    </div>
  );
};

// Debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default Dashboard;
