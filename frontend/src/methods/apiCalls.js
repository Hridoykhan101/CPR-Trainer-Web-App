
//Get Token To Access The API
export const getToken = async () => {
    const login = {
        email : "BestCustomer",
        password : "1234"
    }

    const res = await fetch('http://vps-ae71c440.vps.ovh.ca:3000/Person/Login', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(login)
    });
    const data = await res.json();
    return data;
}

//Get Organisations That This User Has Access To
export const getOrganisations = async () => {
    try{
        const token = await getToken();
        const res = await fetch('http://vps-ae71c440.vps.ovh.ca:3000/Organisation/', {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token.newAccessToken}`
            },
        });
        if(res.status >= 200 && res.status < 300){
            const data = await res.json();
            return data;
        }
    }catch(err){
        console.warn('Error: ', err.message);
        return ([]);
    }

    return ([]);

}

//Get Dummies Specific To This Organisation
export const getDummiesByOrg = async (orgId) => {
    try{
        const token = await getToken();
        const res = await fetch(`http://vps-ae71c440.vps.ovh.ca:3000/dummy/byOrganisation/${orgId}`, {
          method: 'GET',
          headers: {
            'Authorization' : `Bearer ${token.newAccessToken}`
          },
        });
        //If We Found Dummies Then We Show Them
        if(res.status >= 200 && res.status < 300){
          const data = await res.json();
          return data;
        }
    }catch(err){
        return [];
    }

    return [];
}

export const getDummiesByPerson = async () => {
  try{
    const token = await getToken();
    const res = await fetch('http://vps-ae71c440.vps.ovh.ca:3000/organisation/people', {
      method: 'GET',
      headers: {
        'Authorization' : `Bearer ${token.newAccessToken}`
      },
    });

    if(res.status >= 200 && res.status < 300){
      const data = await res.json();
      return data;
    }
  }catch(err){
    console.log('Error: ', err.message);
    return([]);
  }

  return([]);
}

//Get People Specific To This Organisation
export const getPeopleByOrg = async () => {
    try{
        //Get People Under The Organisation From Backend
        const token = await getToken();
        const res = await fetch('http://vps-ae71c440.vps.ovh.ca:3000/organisation/people', {
          method: 'GET',
          headers: {
            'Authorization' : `Bearer ${token.newAccessToken}`
          },
        });
      
        if(res.status >= 200 && res.status < 300){
          const data = await res.json();
          return data;
        }
      }catch(err){
        console.log('Error: ', err.message);
        return [];
      }

      return [];
}

export const getGroups = async () => {
  //Get All Groups
  try{
    const token = await getToken();
    const res = await fetch('http://vps-ae71c440.vps.ovh.ca:3000/group', {
        method: 'GET',
        headers: {
          'Authorization' : `Bearer ${token.newAccessToken}`
        },
    });

    if(res.status >= 200 && res.status < 300){
      const data = await res.json();
      return data;
    }
  }catch(err){
    console.log('Error: ', err.message);
    return([]);
  }

  return([]);
}

export const joinGroup = async(joinCode) => {

  try{
    const token = await getToken();
    await fetch(`http://vps-ae71c440.vps.ovh.ca:3000/group/join/${joinCode}`, {
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${token.newAccessToken}`
        },
    });
  }catch(err){
    console.log('Error: ', err.message);
  }
}

export const getGroupMembers = async (groupId) => {
  //Get Members Of A Single Group
  try{
    const token = await getToken();
    const res = await fetch(`http://vps-ae71c440.vps.ovh.ca:3000/group/users/${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization' : `Bearer ${token.newAccessToken}`
        },
    });

    if(res.status >= 200 && res.status < 300){
      const data = await res.json();
      return data;
    }
  }catch(err){
    console.log('Error: ', err.message);
    return([]);
  }

  return([]);
}

export const getPersonSelf = async () => {
   //Get Inforamtion about the currently logged in user
   try{
    const token = await getToken();
    const res = await fetch('http://vps-ae71c440.vps.ovh.ca:3000/Person', {
        method: 'GET',
        headers: {
          'Authorization' : `Bearer ${token.newAccessToken}`
        },
    });

    if(res.status >= 200 && res.status < 300){
      const data = await res.json();
      return data;
    }
  }catch(err){
    console.log('Error: ', err.message);
    return null;
  }

  return null;
}

export const getPersonRoleById = async ( id ) => {
  //Get Inforamtion about the currently logged in user
  try{
   const token = await getToken();
   const res = await fetch(`http://vps-ae71c440.vps.ovh.ca:3000/role/${id}`, {
       method: 'GET',
       headers: {
         'Authorization' : `Bearer ${token.newAccessToken}`
       },
   });

   if(res.status >= 200 && res.status < 300){
     const data = await res.json();
     return data;
   }
 }catch(err){
   console.log('Error: ', err.message);
   return null;
 }

 return null;
} 


export const getPersonRole = async ( id ) => {
  //Get Inforamtion about the currently logged in user
  try{
   const token = await getToken();
   const res = await fetch(`http://vps-ae71c440.vps.ovh.ca:3000/role`, {
       method: 'GET',
       headers: {
         'Authorization' : `Bearer ${token.newAccessToken}`
       },
   });

   if(res.status >= 200 && res.status < 300){
     const data = await res.json();
     return data;
   }
 }catch(err){
   console.log('Error: ', err.message);
   return null;
 }

 return null;
} 

