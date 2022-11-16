import React from 'react';
import '../../assets/CSS/Form.css';
import { Link } from 'react-router-dom';

const FormSuccess = () => {
  return (
    <div className='form-content-right'>
      <h1 className='form-success'>You have successfully signed up!</h1>
      <Link to='/Dashboard' >
      <button className='form-account-btn' type='submit' >
        Go to Account
      </button>
      </Link>
    </div>

  );
};

export default FormSuccess;