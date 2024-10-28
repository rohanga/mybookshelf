import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../../store/action/authAction'; // Import the signup action
import './signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State to control popup visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authState = useSelector(state => state.auth); 
  const signupError  = authState.error;
  const loading = authState.loading;
  const userInfo = authState.userInfo;

  // Redirect to login on successful signup
  if (userInfo && userInfo.userId && !showSuccessPopup) {
    setShowSuccessPopup(true); // Show the success popup when user is created
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!email || !password) {
      setError('Please fill all fields.');
      return;
    }

    // Dispatch the signup action
    dispatch(signup(email, password));
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <section className="signupsection">
      <div className="signup">
        <h2>Create An Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            /><br/>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            /><br/>

            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p>{error}</p>}
          {signupError && <p>{signupError}</p>}
          {loading && <p>Loading...</p>} {/* Show loading indicator */}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <span>
            <h6>Already Have An Account? <a href="/login">Sign in</a></h6>
          </span>
        </form>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="success-popup">
            <div className="popup-content">
              <h3>Account Created Successfully!</h3>
              <p>Your account has been created. Click the button below to log in.</p>
              <button onClick={handleLoginRedirect}>Login</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Signup;
