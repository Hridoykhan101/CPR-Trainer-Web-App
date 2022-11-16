import * as React from "react";
import { useHistory } from "react-router-dom";
import "../../assets/CSS/Dashboard.css";
import { ROLE, roleToName } from "../../constants";
import RequestHelper, { refreshToken } from "../../RequestHelper";
import DialgoueBox from "../DialogueBox";
import OrgJoinModal from "../OrgJoinModal";
import OrgModal from "../OrgModal";

export default function OrganisationTableList() {
  const history = useHistory();

  const [showOrgModal, setShowOrgModal] = React.useState(false);
  const [showOrgJoinModal, setShowOrgJoinModal] = React.useState(false);
  const [showDialogue, setShowDialogue] = React.useState({show: false, index: 0});

  //const [orgData, setOrgData] = React.useState(OrganisationData);
  const [orgData, setOrgData] = React.useState();

  const getOrganisations = () => {
      RequestHelper.createRequest('get', '/organisation', null).then(data => {
      let organisations = data.data;

      organisations.forEach(element => {
        element.roleName = roleToName(element.roleId);
      });

      console.log("Parsed organisations: ", organisations);

      setOrgData(organisations);
    });
  }

  const removeOrg = async (ind) => {
    let organisation = orgData[ind];
    //console.log("About to remove organisation: ", organisation);

    //In order to leave the organisation, you first must try to update your session to be under that organisation
    //This is similar to being an admin and being able to remove their roles
    //But if you're a member, you're only allowed to do this to yourself
    await updateSession(organisation.id, false).then(data => {
      //console.log("Switched organisation response: ", data);
    });

    //Now, try to leave the organisation
    RequestHelper.createRequest('delete', '/role/unassign', {roleId: organisation.roleId, personId: RequestHelper.getPersonId()}).then(data => {
      //It would be better if we could refresh the table instead of removing it from the array. That way we know for sure it's been removed
      setOrgData(orgData.filter(org => org.id != organisation.id));
    });
  }

  const Button = ({ type }) => {
    return <button className={"widgetLgButton" + type}>{type}</button>;
  };

  function updateSession(organisationId, redirect) {
    return RequestHelper.createTokenRequest('/refresh', {refreshToken : refreshToken, organisationId : organisationId}).then(data=> {
      console.log("New token details: ", data);
      //Navigate to the new page
      if (redirect) {
        RequestHelper.createRequest('get', '/organisation/people', null).then(people => {
          console.log("Retrieved data, now forwarding to new page");
          history.push({pathname: "/organisation/users"});
        })
      };
    });
  }

  React.useEffect(() => {
    //Get Organisation Data From Backend
    //Using the helper script
    getOrganisations();
  }, []);

  return !orgData ? (
    null
  ) : (
    <div className="widgetLg">
      {showDialogue.show ? <DialgoueBox msg={'Are you sure you want to leave this organisation?'} yesAction={() => {removeOrg(showDialogue.index);setShowDialogue(false)}}  exitAction={setShowDialogue} /> : null}
      {showOrgModal ? <OrgModal exitAction={setShowOrgModal} addAction={getOrganisations} /> : null}
      {showOrgJoinModal ? <OrgJoinModal exitAction={setShowOrgJoinModal} addAction={getOrganisations} joinedOrganisations={orgData} /> : null}
      <div className="org-title">
        <h3 className="widgetLgTitle">Organisations</h3>
      </div>
      <table className="widgetLgTable">
        <thead>
          <tr className="widgetLgTr" key="-1">
            <th className="widgetLgTh">Organisation Name</th>
            <th className="widgetLgTh">Role</th>
            <th className="widgetLgTh">Address</th>
            <th className="widgetLgTh">Post Code</th>
            <th className="widgetLgTh">Leave</th>
          </tr>
        </thead>
        <tbody>
        {orgData.map((org, index) => {

          //Determine user privileges
          const canEdit = (org.roleId === ROLE.globalAdministrator || org.roleId === ROLE.administrator);
          const canLeave = (org.roleId !== ROLE.globalAdministrator);

          return (
            <tr key={index}
                onClick={canEdit ? () => updateSession(org.id, true) : null}
                className={canEdit ? "widgetLgTrClickable" : "widgetLgTrClickable-disabled"}>
              {/* <Link to={`/organisation/join?name=${org.name}`}> */}
              <td className="widgetLgTh">{org.name}</td>
              <td className="widgetLgDate">{org.roleName}</td>
              <td className="widgetLgDate">{org.addressLine}</td>
              <td className="widgetLgAmount">{org.postcode}</td>
              <td className="widgetLgAmount"><button className={canLeave ? 'unlink-btn' : 'unlink-btn-dis'} onClick={canLeave ? (event) => {setShowDialogue({show: true, index: index}); event.stopPropagation();} : null}>Leave</button></td>
            </tr>
          );
        })}
        </tbody>
      </table>
      <button className="unlink-btn" onClick={() => setShowOrgModal(true)}>Create</button>
      <button className="unlink-btn" onClick={() => setShowOrgJoinModal(true)}>Join</button>
    </div>
  );
}
