export default function validateInfo(values) {
  let errors = {};

  //email
  //The user may choose to sign in with their email instead
  /*
  if (!values.email) {
    errors.email = 'Email required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }
  */

  if (!values.email) {
    errors.email = 'You need to specify an email / username';
  }

  //password 1
  //Since the mobile app has no password verification for registration, it's only fair the login has the same requirement.
  /*
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password needs to be 6 characters or more';
  }
  */

  if (!values.password) {
    errors.password = 'Password is required'
  }
  
  return errors;
}