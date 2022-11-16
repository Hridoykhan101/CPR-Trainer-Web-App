import { useRef, useState, useEffect } from 'react';
import RequestHelper from '../RequestHelper';
import '../assets/CSS/Modal.css';
import Autosuggest from 'react-autosuggest';

const OrgModal = ({exitAction, addAction, joinedOrganisations}) => {
    const [showError, setShowError] = useState();
    const [suggestions, setSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedSuggestion, setSelectedSuggestion] = useState();
    

    const orgName = useRef();

    const createFormData = (e) => {
        e.preventDefault();
        if(selectedSuggestion){
            try{
                //First, try to get more details about the organisation (we first need to grab the id)
                RequestHelper.createRequest('put', `/role/join/${selectedSuggestion.id}`).then((res) => {
                    console.log(res);

                    //Now, update the list of organisations (the supplied function does this)
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

    // Autosuggest will call this function every time you need to update suggestions
    const onSuggestionsFetchRequested = ({value}) => {
        getSuggestions(value)
    }

    // Used for clearing the suggestions
    const onSuggestionsClearRequested = () => {
        /*console.log("Clearing suggestions");
        setSuggestions([]);
        setInputValue('');*/
    }

    const getSuggestions = async (value) => {
        console.log("getSuggestions: ", value);
        if (value.length < 3) {
            return [];
        } else {
            //But first, let's make sure we're not already part of that organisation
            let res = (await RequestHelper.createRequest('get', `/Organisation/name/${value}`, null).catch(err => {})) || [];
            let organisations = [];
            if (res.data) {
                //We got a response
                organisations = res.data;
            }
            let availableOrganisations = [];
            let hasMatch = false;
            //console.log("Queried organisations: ", organisations);
            //console.log("Joined organisations: ", joinedOrganisations);

            if (joinedOrganisations) {
                for(var i=0; i<organisations.length; i++) {
                    hasMatch = false;
                    for(var j=0; j<joinedOrganisations.length; j++) {
                        if (joinedOrganisations[j].id === organisations[i].id) {
                            //They've already joined this organisation. Let's not list it
                            hasMatch = true;
                            break;
                        }
                    }
                    if (!hasMatch) {
                        //console.log("No match with ", organisations[i]);
                        availableOrganisations.push(organisations[i]);
                    }
                }
            } else {
                availableOrganisations = organisations;
            }
            console.log("availableOrganisations: ", availableOrganisations);
            setSuggestions(availableOrganisations);
            return availableOrganisations;
        }
    }
    
    const getSuggestionValue = suggestion => {
        console.log("getSuggestionValue: ", suggestion.name);
        setSelectedSuggestion(suggestion);
        return suggestion.name;
    }
    
    const renderSuggestion = suggestion => {
        //console.log("Render suggestion: ", suggestion);
        return (<p>
            {suggestion.name}
        </p>);
    }

    const inputProps = {
        placeholder: "Organisation Name",
        value: inputValue,
        onChange: (event, {newValue}) => {
            //If the new value matches with the selected input's name, we will not nulify it. Otherwise do
            if (selectedSuggestion && newValue !== selectedSuggestion.name) {
                setSelectedSuggestion(null);
                console.log("Nullified selected suggestion");
            }
            

            setInputValue(newValue);
        },
        className: selectedSuggestion ? "dropdown-selected" : null
    }

    return(
        <div className='modal-cont' onClick={(e) => {e.target === e.currentTarget && exitAction(false)}}>
            <form className="modal-form">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
                <button onClick={createFormData} className="orange-outline-btn">Join</button>
                {showError && <p className="modal-error">Organisation not found</p>}
            </form>
        </div>
    )
}

export default OrgModal;