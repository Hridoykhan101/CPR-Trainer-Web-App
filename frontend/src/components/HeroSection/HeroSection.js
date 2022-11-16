import React from 'react';
import '../../App.css';
import '../../assets/CSS/HeroSection.css';
import { Link } from 'react-router-dom';
import { Button } from '../Button/Button';

function HeroSection() {
  return (
    <div className='hero-container'>
       <img className='heroImage' alt='CPR' src={require('../../assets/images/CPR.jpg').default}/>
        <h1>CPR Training Platform</h1>
          <p>Please log in or create an account to continue</p>
            <div className='hero-btns'>
            <Link to='/Login' >

              <Button
                className='btns'
                buttonStyle='btn--outline'
                buttonSize='btn--large'>
                Log In
              </Button>
              </Link>

              <Link to='/SignUp' >
              <Button
                className='btns'
                buttonStyle='btn--primary'
                buttonSize='btn--large'>
                Create Account  <i className='far fa-play-circle' />
              </Button>
              </Link>

            </div>
      </div>
  );
}

export default HeroSection;
