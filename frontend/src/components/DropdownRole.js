import "../assets/CSS/Modal.css"
import {ROLE_NAME} from "../constants"

const DropdownRole = ({user, isListOpen}) => {
    //An array of all role names except the user's role
    //Used for displaying the roles to choose from
    const roleNames = ROLE_NAME.filter(name => {return name !== user.roleName});


    return (
        <div className="react-autosuggest__container">
            <li className="react-autosuggest__input">
                {user.roleName}
            </li>
            <div className="react-autosuggest__suggestions-container--open">
                <div className="react-autosuggest__suggestions-list">
                    {true && roleNames.map((value, ind) => {
                        return (
                            <li className="dropdown-link">
                                {value}
                            </li>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default DropdownRole;