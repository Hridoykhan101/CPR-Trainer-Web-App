import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export let accessToken = cookies.get('accessToken') || "";;
export let refreshToken = cookies.get('refreshToken') || "";
let baseURL = "http://vps-ae71c440.vps.ovh.ca:3000";

let verifyLogin = function () {
    //A better option would be to check whether or not this refresh token is valid, and prompt the user to login again if not
    return refreshToken !== "";
}

let createRequest = async function (method, endpoint, body) {
    var requestConfig = {
        headers : {authorization: 'Bearer ' + accessToken},
        responseType : 'json',
        baseURL : baseURL,
        url : endpoint,
        method : method, //Ex. 'get', 'post', 'delete', etc...
        data : body
    };

    let res = undefined;
    try {
        res = await axios.request(requestConfig);
    } catch (error) {
        console.error("An error with the helper script has occured", error);
        if (error.response && error.response.status === 401) {
            //Access token has expired. Let's perform a token refresh and try this request again
            if (refreshToken !== "") {
                try {
                    //Repeat this request
                    try {
                        // Wait for the token request to complete
                        if (accessToken === "") {
                            console.warn("Access token not found. If this is the first time logging into the website, you can ignore this warning");
                        } else {
                            console.log("Access token has expired. Refreshing...");
                        }
                        await createTokenRequest("/refresh", { refreshToken: refreshToken })

                        res = await createRequest(method, endpoint, body);
                    } catch {
                        res = undefined;
                        throw new Error(error);
                    }
                } catch {
                    res = undefined;
                    throw new Error(error);
                }
            } else {
                throw new Error(error);
            }
        } else {
            throw new Error(error);
        }
    }
    
    return res;
}

let createTokenRequest = async function (endpoint, body) {
    var requestConfig = {
        responseType : 'json',
        baseURL : baseURL,
        url : endpoint,
        method : 'post',
        data : body
    };
    let res = undefined;
    try {
        res = await axios.request(requestConfig);
        console.log(res);
        accessToken = res.data.newAccessToken;
        refreshToken = res.data.newRefreshToken;
        cookies.set('accessToken', accessToken, { path: '/' });
        cookies.set('refreshToken', refreshToken, { path: '/' });
    } catch (error) {
        accessToken = "";
        refreshToken = "";
        cookies.set('accessToken', accessToken, { path: '/' });
        cookies.set('refreshToken', refreshToken, { path: '/' });
        res = error;
        throw new Error(error);
    }

    return res;
}

const RequestHelper = {
    createRequest,
    createTokenRequest,
    verifyLogin,
    getRoleId : () => {
        if (accessToken === "") {
            return null;
        }
        var accessTokenRaw = JSON.parse(Buffer.from(accessToken.split(".")[1], 'base64').toString());
        return accessTokenRaw.roleId || null;
    },
    getPersonId : () => {
        if (accessToken === "") {
            return null;
        }
        var accessTokenRaw = JSON.parse(Buffer.from(accessToken.split(".")[1], 'base64').toString());
        return accessTokenRaw.personId || null;
    },
    doLogoutRequest : (response) => {
        createRequest('delete', '/person/logout', {refreshToken});
        refreshToken = "";
        accessToken = "";
        cookies.set('refreshToken', refreshToken, {path: '/'}); //update cookie also
    }
}

export default RequestHelper;
