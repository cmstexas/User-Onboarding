import React, { useState, useEffect } from 'react';
import { Form, Field, withFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
// import './App.css';

const UserForm = ({ errors, touched, values, handleSubmit, status }) => {
    const [users, setUsers] = useState([{Name:'Bob', Email:'b@gmail.com', Password:'pw', tos:false, id: Date.now()}]);
    console.log(status);
    console.log(users)

    useEffect(() => {
        if (status) {
          setUsers([...users, status]);
        }
      }, [status]);

    return (
        <div className="user-form">
      <h1>User Onboarding Form</h1>
      <Form>
        <Field type="text" name="Name" placeholder="Name" />
        {touched.Name && errors.Name && (
          <p className="error">{errors.Name}</p>
        )}

        <Field type="text" name="Email" placeholder="Email" />
        {touched.Email && errors.Email && (
        <p className="error">{errors.Email}</p>
        )}

        <Field type="text" name="Password" placeholder="Password" />
        {touched.Password && errors.Password && <p className="error">{errors.Password}</p>
        }

        <label className="checkbox-container">
          Agree to Terms of Service?
         <Field type="checkbox" name="tos" checked={values.tos} />
         <span className="checkmark" />
        </label>

        <button type="submit">Submit New User!</button>
      </Form>

      {users.map(user => {
        return <p key={user.id}>{user.Name}</p>
      })}
    </div>
  );
};

// Higher Order Component - HOC
// Hard to share component / stateful logic (custom hooks)
// Function that takes in a component, extends some logic onto that component,
// returns a _new_ component (copy of the passed in component with the extended logic)

const FormikUserForm = withFormik({
  mapPropsToValues({ Name, Email, Password, tos }) {
    return {
      Name: Name || '',
      Email: Email || '',
      Password: Password || '',
      tos: tos || false
    };
  },

  validationSchema: Yup.object().shape({
    Name: Yup.string().required(),
    Email: Yup.string().required(),
    Password: Yup.string(),
    tos: Yup.boolean().oneOf([true], 'Please accept Terms and Condutions'),
  }),

  handleSubmit(values, { setStatus, resetForm }) {
    axios
      .post('https://reqres.in/api/users/', values)
      .then(res => {
         return setStatus(res.data);
      })
      .catch(err => console.log(err.response));
    resetForm()
  }
})(UserForm); // currying functions in Javascript

export default FormikUserForm;
