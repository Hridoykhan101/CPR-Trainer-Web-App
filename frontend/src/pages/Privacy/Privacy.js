import React from 'react';
import Footer from '../../components/Footer/Footer';
import '../../assets/CSS/Dashboard.css';

function Privacy() {
  return (
    <div>
      <div className='page-container'>
        <div className='page-content-left'>
          <img className='SideImageContainer' alt='heart' src={require('../../assets/images/CPR4.jpg').default}/>
        </div>
        <div className='page-content-right'>
        <h1 className="infoHeaders">Privacy</h1>
        <p className="text"> 
            Add information about privacy here
            </p>
        </div>
      </div>
    <Footer/>
  </div>

  );
}

export default Privacy
