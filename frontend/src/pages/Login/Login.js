import React from 'react';
import validate from './ValidateInfo';
import useForm from './useForm';
import { Button } from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import '../../assets/CSS/Form.css';
import '../../assets/CSS/HeroSection.css';

const Login = ({ submitForm }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    validate
);

  return (
    <div className='form-content-right'>
      <form action='' method='POST' onSubmit={handleSubmit} className='form' noValidate>
      <h2 className='formHeading'>
          Log In
        </h2>
        <div className='form-inputs'>
          <label className='form-label'>Email or Username</label>
          <input
            className='form-input'
            type='email'
            name='email'
            placeholder='Enter your email / username'
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Password</label>
          <input
            className='form-input'
            type='password' 
            name='password'
            placeholder='Enter your password'
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div className='hero-btns'>
          <Button
            className='form-input-btn'
            buttonStyle='btn--secondary'
            buttonSize='btn--large'
            type='submit'>
            Log In
          </Button>
          <Link to='/Home' >
            <Button
              className='form-input-btn'
              buttonStyle='btn--cancel'
              buttonSize='btn--large'>
              Cancel 
            </Button>
          </Link>
        </div>
        <span className='form-input-login'>
          Don't have an account? Sign up <a href='/SignUp'>here</a>
        </span>
      </form>
    </div>
  );
};

export default Login;