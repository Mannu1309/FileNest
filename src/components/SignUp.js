import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './SignUp.css'

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to login page after successful sign-up
    } catch (error) {
      setError('Failed to sign up. Please try again.');
      console.error('Error signing up: ', error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <input
        id='email'
        name='email'
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        id='password'
        name='password'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <p className='sign-up'>
        Already a user?{' '}
        {/*<button onClick={handleSignUpRedirect}>Sign Up</button>*/}
        <a href='/'>Log in</a>
      </p>
    </div>
  );
}

export default SignUp;
