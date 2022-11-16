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

      console.log("Supplied values: ", values);
      RequestHelper.createTokenRequest('/Person/register', values).then(data=> {
        //There was a good response. Let's go to the next page
        console.log(data);
        setIsSubmitting(true);
      }).catch(err => {
        let thisErr = {email: "The email or username is already being used"};
        console.log("Errors found in request");
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
