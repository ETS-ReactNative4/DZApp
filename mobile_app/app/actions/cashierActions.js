//@flow
import * as ActionConstants from "./constants";
import fetchWrapper from "./fetchWrapper";

//ip addres to access localhost from android emulator
const URI = "http://10.0.0.2:8000"

/************ Synchronous Actions ***************/
export const requestLogin = () => {
  return {
    type: ActionConstants.REQUEST_LOGIN,
  }
}

export const loginSuccess = (id:String) => {
  return {
    type: ActionConstants.LOGIN_SUCCESS,
    data: id
  }
}

export const loginError = (error:String) => {
  return {
    type: ActionConstants.LOGIN_ERROR,
    data: error
  }
}

/************ Asynchronous Actions ***************/
//authentication against the API, since we don't want to store sensitive information
//on mobile device
export const login = (userCredentials:{},navigation:{}) => {
  return function(dispatch){

    dispatch(requestLogin());

    return fetchWrapper(2000,
    fetch(ActionConstants.URL + "/customers/login",{
      method:'POST',
      body: JSON.stringify(userCredentials),
      headers: new Headers({
        'Content-Type':'application/json'
      })
    })).then(response => response.json())
    .then(json => {
      if(json.error){
        dispatch(loginError(json.error));
      } else{
        navigation.navigate("EventScreen");
        dispatch(loginSuccess(json.id));
      } 
    })
    .catch(error => dispatch(loginError(error.message)));
  }
}
