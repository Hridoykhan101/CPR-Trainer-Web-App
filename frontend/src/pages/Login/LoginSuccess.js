import React, { Component } from 'react';
import '../../assets/CSS/Form.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LoginSuccess = () => {
  return (
    <div className='form-content-right'>
      <h1 className='form-success'>Log in successful!</h1>
      <Link to='/Dashboard' >
      <button className='form-account-btn' type='submit' >
        Go to Account
      </button>
      </Link>
    </div>

  );
};

/*
componentDidMount(){
  axios.get('http://vps-ae71c440.vps.ovh.ca:3000/Person/Login').then(
    response => {
      console.log(response);
    },
    error => {
      console.log(error)
    }
  )
}
**/
export default LoginSuccess;