import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/action/authAction';
import './login.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authState = useSelector(state => state.auth);
  const loginError = authState.error;
  const loading = authState.loading;
  const userInfo = authState.userInfo;

  useEffect(() => {
    if (userInfo) {
      console.log("Is authenticated==========>",authState)
      if(authState.action=="LOGIN_SUCCESS"){
      // Set isAuthenticated to true after successful login
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
      }
    }
  }, [userInfo, navigate, setIsAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <section className='loginsection'>
      <div className="login">
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Email Address'
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Password'
            />
          </div>
          {loginError && <p className="error-message">{loginError}</p>}
          {loading && <p>Loading...</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <h6>
          Not Have An Account? <a href='/signup'>Create account</a>
        </h6>
      </div>
    </section>
  );
};

export default Login;
