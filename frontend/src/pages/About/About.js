import React from 'react';
import Footer from '../../components/Footer/Footer';
import '../../assets/CSS/Dashboard.css';

function About() {
  return (
    <div>
      <div className='page-container'>
        <div className='page-content-left'>
          <img className='SideImageContainer' alt='heart' src={require('../../assets/images/CPR2.jpg').default}/>
        </div>
        <div className='page-content-right'>
        <h1 className="infoHeaders">About</h1>
        <p className="text"> 
            In Australia, around 30,000 people suffer a sudden cardiac arrest each year; 
            on average, only 9-10% of these people survive. These are the lucky few…
            lucky because when they collapse there has been someone nearby who knows how to help.
            However, in a medically advanced country like Australia, luck is not an acceptable strategy!
            </p>
            <p className="text"> 
            We know that the best chance of surviving cardiac arrest occurs when a victim’s care begins immediately 
            – in a community where defibrillators are widespread and accessible and citizens are trained and willing 
            to provide CPR. Take Heart Australia brings together experts from healthcare, academia, community, government
            and the private sector to form a powerful, effective, integrated approach to saving lives.
            
            </p>

            <p className="text"> 
            Our ultimate aim is to make it the norm – rather than the exception – to survive cardiac arrest.
            This web platform can be used as an educational tool to assist with training individuals
            of all ages, regardless of their knowledge in the medical field. Users will be able to create an 
            account, in which their CPR training session results will be displayed in graphs. 
            This will provide a way for people to identify their strengths and weaknesses from their CPR performances. 
            </p>
        </div>
      </div>
    <Footer/>
  </div>

  );
}

export default About
