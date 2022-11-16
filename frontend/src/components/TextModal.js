import { useRef, useState } from 'react';
import '../assets/CSS/Modal.css';

const TextModal = ({exitAction, addAction, refreshAction, placeholder, buttonText, errorText}) => {
    const [showError, setShowError] = useState();

    const textInputRef = useRef();

    const createFormData = async (e) => {
        e.preventDefault();
        if(textInputRef.current.value){

            (addAction(textInputRef.current.value).then(res => {
                refreshAction();

                //Close The Modal
                exitAction(false);
            })).catch(err => {
                setShowError(true);
            });
        } else {
            setShowError(true);
        }
    }

    return(
        <div className='modal-cont' onClick={(e) => {e.target === e.currentTarget ? exitAction(false): console.log()}}>
            <form className="modal-form">
                <input placeholder={placeholder} ref={textInputRef} />
                <button onClick={createFormData} className="orange-outline-btn">{buttonText}</button>
                {showError && <p className="modal-error">{errorText || "Please enter a value"}</p>}
            </form>
        </div>
    )
}

export default TextModal;