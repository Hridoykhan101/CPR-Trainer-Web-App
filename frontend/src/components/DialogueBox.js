import React from 'react';
import '../assets/CSS/Modal.css';

const DialgoueBox = ({msg, yesAction, exitAction}) => {
    return(
        <div className='modal-cont' onClick={(e) => {e.target === e.currentTarget ? exitAction(false): console.log()}}>
            <div className="dialogue-box">
                <p>{msg}</p>
                <div className="dialogue-btns">
                    <button className="orange-outline-btn" onClick={yesAction}>Yes</button>
                    <button className="orange-outline-btn" onClick={() => exitAction(false)}>No</button>
                </div>
            </div>
        </div>
    )
}

export default DialgoueBox;