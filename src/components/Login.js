import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/upload'); // Redirect to the upload page after successful login
    } catch (error) {
      setError('Failed to log in. Please check your email and password.');
      console.error('Error logging in: ', error);
    }
  };

  // const handleSignUpRedirect = () => {
  //     navigate('/signup'); // Redirect to the sign-up page
  // };

  return (
    <div className="login_form">
      <h2>Login</h2>
      <div className='input_box'>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      </div>
      <div className='input_box'>
      <input className='password_title'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <p className='sign-up'>
        Don't have an account?{' '}
        {/*<button onClick={handleSignUpRedirect}>Sign Up</button>*/}
        <a href='/signup'>Sign Up</a>
      </p>
    </div>
  );
}

export default Login;
