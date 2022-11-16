import React, { useState } from 'react';
import Login from './Login';
import LoginSuccess from './LoginSuccess';
import '../../assets/CSS/Form.css';

const Form = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submitForm() {
    setIsSubmitted(true);
  }
  return (
    <>
      <div className='form-container'>
        <div className='form-content-left'>
        <img className='form-img' alt='heart' src={require('../../assets/images/Hands.jpg').default}/>
        </div>
        {!isSubmitted ? (
          <Login submitForm={submitForm} />
        ) : (
          <LoginSuccess />
        )}
      </div>
    </>
  );
};

export default Form;
