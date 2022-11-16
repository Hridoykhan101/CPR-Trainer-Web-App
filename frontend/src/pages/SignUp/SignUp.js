import React from 'react';
import validate from './ValidateInfo';
import useForm from './useForm';
import { Button } from '../../components/Button/Button';
import { Link } from 'react-router-dom';

const SignUp = ({ submitForm }) => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submitForm,
    validate
  );

  return (
    <div className='form-content-right'>
      <form onSubmit={handleSubmit} className='form' noValidate>
      <h2 className='formHeading'>
          Sign Up
        </h2>
        <h1>
          Create an account by entering your
          information below.
        </h1>
        <div className='form-inputs'>
          <label className='form-label'>Username</label>
          <input
            className='form-input'
            type='text'
            name='username'
            placeholder='Enter your username'
            value={values.username}
            onChange={handleChange}
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>First Name</label>
          <input
            className='form-input'
            type='text'
            name='fName'
            placeholder='Enter your first name'

            value={values.fName}
            onChange={handleChange}
          />
          {errors.fName && <p>{errors.fName}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Last Name</label>
          <input
            className='form-input'
            type='text'
            name='lName'
            placeholder='Enter your last name'
            value={values.lName}
            onChange={handleChange}
          />
          {errors.lName && <p>{errors.lName}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Date of Birth</label>
          <input
            className='form-input'
            type='date'
            name='birthdate'
            placeholder='Enter your date of birth'
            value={values.birthdate}
            onChange={handleChange}
          />
          {errors.birthdate && <p>{errors.birthdate}</p>}
        </div>
        <div className='form-inputs'>
          <label className='form-label'>Email</label>
          <input
            className='form-input'
            type='email'
            name='email'
            placeholder='Enter your email'
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
        <div className='form-inputs'>
          <label className='form-label'>Confirm Password</label>
          <input
            className='form-input'
            type='password'
            name='password2'
            placeholder='Confirm your password'
            value={values.password2}
            onChange={handleChange}
          />
          {errors.password2 && <p>{errors.password2}</p>}
        </div>
        <div className='hero-btns'>
          <Button
            buttonStyle='btn--secondary'
            buttonSize='btn--large'
            type='submit'
            className='form-input-btn'>
              Sign Up
          </Button>
          <Link to='/Home' >
            <Button
              buttonStyle='btn--cancel'
              buttonSize='btn--large'
              className='form-input-btn'>
              Cancel
            </Button>
          </Link>
        </div>
        <span className='form-input-login'>
          Already have an account? Login <a href='/Login'>here</a>
        </span>
      </form>
    </div>
  );
};

export default SignUp;