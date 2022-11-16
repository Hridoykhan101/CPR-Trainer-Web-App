import axios from 'axios';
import { useState, useEffect } from 'react';
import RequestHelper from '../../RequestHelper';

const useForm = (callback, validate) => {
  const [values, setValues] = useState({
    username:'',
    fName: '',
    lName: '',
    birthdate: '',
    email: '',
    password: '',
    password2:'',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    let validateResult = validate(values);

    setErrors(validateResult);
    console.log("validateResult: ", validateResult);

    if (Object.keys(validateResult).length === 0) {

      RequestHelper.createTokenRequest("/Person/login", values).then(data => {
        //There was a good response. Let's go to the next page
        console.log(data);
        setIsSubmitting(true);
        setErrors(validateResult);  //Kinda bad. This just triggers the 'useEffect'
      }).catch(err => {
        let thisErr = {email: "Either the username/email or password is incorrect"};
        console.log("Errors found");
        setErrors(thisErr);
      });
    }
  };

  useEffect(
    () => {
      if (Object.keys(errors).length === 0 && isSubmitting) {
        callback();
      }
    },
    [errors, isSubmitting]
  );

  return { handleChange, handleSubmit, values, errors };
};

export default useForm;