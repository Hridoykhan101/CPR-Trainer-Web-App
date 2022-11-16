import React, { useState } from 'react';
import SignUp from './SignUp';
import FormSuccess from './FormSuccess';
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
        <img className='form-img' alt='heart' src={require('../../assets/images/HeartOnly.jpg').default}/>
        </div>
        {!isSubmitted ? (
          <SignUp submitForm={submitForm}/>
          ) : (<FormSuccess/>)}
      </div>
    </>
  );
};

export default Form;
