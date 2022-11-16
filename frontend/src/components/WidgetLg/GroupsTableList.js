import {useEffect, useState} from "react";
import { useHistory } from "react-router";
import "../../assets/CSS/Dashboard.css";
import RequestHelper from "../../RequestHelper";
import TextModal from "../TextModal";
import DialgoueBox from "../DialogueBox";

export default function GroupsTableList(props) {
  const [groupsData, setGroupsData] = useState([]);
  const [showJoinGroupModal, setJoinGroupModal] = useState(false);
  const [showCreateGroupModal, setCreateGroupModal] = useState(false);
  const [showDialogue, setShowDialogue] = useState({show: false, joinCode: ''});

  const history = useHistory();

  function fetchGroups() {
    RequestHelper.createRequest('get', '/group', null).then(groups => {
      if (groups.data) {
        setGroupsData(groups.data);
      }
    });
  }

  //Fetch Groups
  useEffect(() => {
    fetchGroups();
  }, []);

  function leaveGroup(joinCode) {
    console.log("Leaving group: ", joinCode);
    RequestHelper.createRequest('delete', `/group/leave/${joinCode}`, null).then(res => {
      //Then query the backend again with the newly joined groups
      console.log("Successfully left the group. Creating a request to view groups")
      fetchGroups();
    });
  }

  function viewGroup(ind) {
    let group = groupsData[ind];

    //Let's query all of the users in this group, and navigate to the users table
    RequestHelper.createRequest('get', `/group/users/${group.id}`, null).then(res => {
      let people = res.data;

      console.log("Got people: ", people);

      history.push('/groups/users', {peopleState: people});
    });
  }

  async function joinGroup(data) {
    return await RequestHelper.createRequest('post', `/group/join/${data}`, null);
  }

  async function createGroup(data) {
    let body = {
      name: data
    };
    return RequestHelper.createRequest('post', '/group', body);
  }

  return (
    <div className="widgetLg">
      {showCreateGroupModal && <TextModal addAction={createGroup} exitAction={setCreateGroupModal} refreshAction={fetchGroups} placeholder="Group name" buttonText="Create"/>}
      {showJoinGroupModal && <TextModal addAction={joinGroup} exitAction={setJoinGroupModal} refreshAction={fetchGroups} placeholder="Join code" buttonText="Join" errorText="Invalid join code"/>}
      {showDialogue.show ? <DialgoueBox msg={'Are you sure you want to leave this group?'} yesAction={() => {leaveGroup(showDialogue.joinCode);setShowDialogue(false)}}  exitAction={setShowDialogue} /> : null}
      <h3 className="widgetLgTitle">Joined groups</h3>
      <table className="widgetLgTable">
        <thead>
          <tr className="widgetLgTr">
            <th className="widgetLgTh">Name</th>
            <th className="widgetLgTh">Join Code</th>
            <th className="widgetLgTh"></th>
          </tr>
        </thead>
        <tbody>
          {groupsData.map((group, ind) => {
            return (
              <tr className="widgetLgTrClickable" key={ind}
                  onClick={() => viewGroup(ind)}>
                <td className="widgetLgTh">{group.name}</td>
                <td className="widgetLgTh-unclickable" onClick={(e) => {e.stopPropagation()}}>{group.joinCode}</td>
                <td
                  className="widgetLgAmount"
                  onClick={(event) => {setShowDialogue({show: true, joinCode: group.joinCode}); event.stopPropagation()}}
                >
                  <button className="unlink-btn">Leave</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="unlink-btn" onClick={() => {setCreateGroupModal(true)}}>Create</button>
      <button className="unlink-btn" onClick={() => {setJoinGroupModal(true)}}>Join</button>
    </div>
  );
};