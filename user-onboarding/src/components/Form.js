import React, { useState, useEffect } from 'react';
import { Form, Field, withFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
// import './App.css';

const UserForm = ({ errors, touched, values, handleSubmit, status }) => {
    const [users, setUsers] = useState([{name:'', email:'', password:'', tos:false}]);
    console.log(users);

    useEffect(() => {
        if (status) {
          setUsers([...users, status]);
        }
      }, [status, users]);

    return (
        <div className="user-form">
      <h1>User Onboarding Form</h1>
      <Form>
        <Field type="text" name="Name" placeholder="Name" />
        {touched.name && errors.name && (
          <p className="error">{errors.name}</p>
        )}

        <Field type="text" name="Email" placeholder="Email" />
        {touched.email && errors.email && (
        <p className="error">{errors.email}</p>
        )}

        <Field type="text" name="Password" placeholder="Password" />
        {touched.password && errors.password && <p className="error">{errors.password}</p>
        }

        <label className="checkbox-container">
          Terms of Service
         <Field type="checkbox" name="tos" checked={values.tos} />
         <span className="checkmark" />
        </label>

        <button type="submit">Submit New User!</button>
      </Form>

      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
};

// Higher Order Component - HOC
// Hard to share component / stateful logic (custom hooks)
// Function that takes in a component, extends some logic onto that component,
// returns a _new_ component (copy of the passed in component with the extended logic)

const FormikUserForm = withFormik({
  mapPropsToValues({ name, email, password, tos }) {
    return {
      name: values.name || '',
      email: email || '',
      password: password || '',
      tos: tos || false
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string(),
    tos: Yup.boolean().oneOf([true], 'Please accept Terms and Condutions'),
  }),

  handleSubmit(values, { setStatus }) {
    axios
      .post('https://reqres.in/api/users/', values)
      .then(res => {
          setStatus(res.data);
      })
      .catch(err => console.log(err.response));
  }
})(UserForm); // currying functions in Javascript

export default FormikUserForm;
