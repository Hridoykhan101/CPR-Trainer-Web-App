import { useRef, useState } from 'react';
import RequestHelper from '../RequestHelper';
import '../assets/CSS/Modal.css';

const OrgModal = ({exitAction, addAction}) => {
    const [showError, setShowError] = useState();

    const orgNameRef = useRef();
    const postRef = useRef();
    const addrRef = useRef();
    const suburbRef = useRef();

    const createFormData = async (e) => {
        e.preventDefault();
        let data = {};
        if(orgNameRef.current.value && orgNameRef.current.value.length >= 3 && suburbRef.current.value && postRef.current.value && addrRef.current.value){
            
            data = {
                name: orgNameRef.current.value,
                suburb : suburbRef.current.value,
                postCode: postRef.current.value,
                addressLine: addrRef.current.value
            }
            
            try{
                RequestHelper.createRequest('post', '/organisation/create', data).then((prev) => {
                    addAction();
                });
            }catch(err){
                console.log('Error: ', err.message);
            }

            //Close The Modal
            exitAction(false);
        } else {
            setShowError(true);
        }

    }

    return(
        <div className='modal-cont' onClick={(e) => {e.target === e.currentTarget ? exitAction(false): console.log()}}>
            <form className="modal-form">
                <input placeholder="Organisation Name" ref={orgNameRef} />
                <input placeholder="Suburb" ref={suburbRef} />
                <input placeholder="Post Code" maxLength='4' ref={postRef} />
                <input placeholder="Address" ref={addrRef} />
                <button onClick={createFormData} className="orange-outline-btn">Create</button>
                {showError && <p className="modal-error">Please ensure you have input in all fields, and the organisation name is at least 3 characters long</p>}
            </form>
            
        </div>
    )
}

export default OrgModal;