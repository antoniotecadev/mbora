import React from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const LoginForm = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Please enter your email address'),
    password: Yup.string()
      .min(8, 'Password must be 8 characters or longer')
      .required('Please enter your password'),
  });

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        // Make API call to authenticate user
        // setSubmitting(false);
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <Form>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {touched.email && errors.email && <p>{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {touched.password && errors.password && <p>{errors.password}</p>}
            </div>
            </Form>)}
        </Formik>)
}

export const SignInForm = props => (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={values => console.log(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          <Button onPress={handleSubmit} title="Submit" style={styles.button} />
        </View>
      )}
    </Formik>
  );

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    width: '90%',
    backgroundColor: '#1c1c1c',
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});