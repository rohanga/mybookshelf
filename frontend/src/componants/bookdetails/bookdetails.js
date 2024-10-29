import React, { useEffect, useState, useRef, memo } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getBook } from "../../store/action/action";
import './bookdetails.css';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { PuffLoader } from 'react-spinners'; // Import the spinner

const socket = io(process.env.REACT_APP_HOST_URL);


const BookDetailPage = memo(() => {
  const { bookId } = useParams();
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const loggedInUserId = localStorage.getItem("userId");

  const { selectedBook, comments } = useSelector(state => state.bookdetails, shallowEqual);
  const dispatch = useDispatch();
  const commentsEndRef = useRef(null); // Create a ref for the comments container

  useEffect(() => {
    if (!selectedBook) {
      dispatch(getBook(bookId));
    }

    // Listen for new comments in real-time
    socket.on('newComment', ({ bookId: _id, user, comment }) => {
      if (_id === bookId) {
        setCommentsList(prevComments => [...prevComments, comment]);
      }
    });

    return () => {
      socket.off('newComment');
    };
  }, [dispatch, selectedBook, bookId]);

  const handleAddComment = async () => {
    const commentData = { userId: loggedInUserId, content: newComment };

    try {
      await axios.post(`${process.env.REACT_APP_HOST_URL}/comment/${bookId}/comments`, commentData);
      setNewComment(''); // Clear input after submitting
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  useEffect(() => {
    if (comments) {
      setCommentsList(comments);
    }
  }, [comments]);

  useEffect(() => {
    // Scroll to the bottom of the comments list whenever comments change
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentsList]);

  if (!selectedBook) return (
    <div className="loading-container">
      <PuffLoader color="#007bff"  size={50} />
      <p>Loading book details...</p>
    </div>
  );


  return (
    <div className="book-detail-container">
      <div className="book-info">
        <img src={selectedBook.thumbnail} alt={selectedBook.title} className="book-image" />
        <div className="book-meta">
          <h1 className="book-title">{selectedBook.title}</h1>
          <p className="book-author">by {selectedBook.authors.join(",")}</p>
          <p className="book-rating">Rating: {selectedBook.averageRating}</p>
      
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        <div className="comments-list">
          {commentsList.map((comment, index) => (
            <div key={index} className={`comment ${comment.userId === loggedInUserId ? 'my-comment' : ''}`}>
              <h4 className="comment-author">{comment.email}</h4>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))}
          <div ref={commentsEndRef} /> {/* This empty div will be the target for scrolling */}
        </div>
        <div className="comment-input">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Post Comment</button>
        </div>
      </div>
    </div>
  );
});

export default BookDetailPage;
