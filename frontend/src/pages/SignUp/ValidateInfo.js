export default function validateInfo(values) {

  let errors = {};

  //Username
  if (!values.username) {
    errors.username = 'Username is required';
  }

  //First name
  if (!values.fName) {
    errors.fName = 'First name is required';
  }
  else if (!/^[A-Za-z]+/.test(values.fName)) {
    errors.fName = 'Last name must only contain letters';
  } 
  /*
  else if (values.fname.length < 2){
    errors.fname = 'First name needs to be 2 characters or more';
  }
  **/

  //Last name
  if (!values.lName) {
    errors.lName = 'Last name is required';
  }
  else if (!/^[A-Za-z]+/.test(values.fName)) {
    errors.fName = 'Last name must only contain letters';
  } 
  /*
  else if (values.lname.length < 2){
    errors.lname = 'Last name needs to be 2 characters or more';
  }
  **/

  //DOB
  if (!values.birthdate) {
    errors.birthdate = 'Birthdate is required'; 
  }
  //
  /*
  else if (!.test(values.birthdate)) {
    errors.email = 'Birth year must be older than 2003';
  }
  **/

  //Email
  if (!values.email) {
    errors.email = 'Email is required';
  } 
  else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }

  //Password 1
  if (!values.password) {
    errors.password = 'Password is required';
  } 
  else if (values.password.length < 6) {
    errors.password = 'Password needs to be 6 characters or more';
  }

  //Password 2
  if (!values.password2) {
    errors.password2 = 'Password confirmation is required';
  } 
  else if (values.password2 !== values.password) {
    errors.password2 = 'Passwords do not match';
  }
  return errors;
}