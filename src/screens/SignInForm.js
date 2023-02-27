import React from 'react';
import { View, StyleSheet, TextInput, Alert, Button, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, FormHeader, ErroMessage } from '../components/Form';

export default SignInForm = ()=> {
    let passwordInput = null;
    return (
      <View style={styles.container}>
        <FormHeader title='Entrar na Conta' />
        <Formik
          initialValues={{email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
                .email('Email não é válido')              
                .required('Digite o email'),
            password: Yup.string()
                .min(8, 'A palavra - passe tem que ter no mínimo 8 caracteres')
                .required('Digite a palavra - passe'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
              Alert.alert(JSON.stringify(values));
              // Important: Make sure to setSubmitting to false so our loading indicator
              // goes away.
              formikActions.setSubmitting(false);
            }, 500);
          }}>
          {props => (
            <ScrollView>
              <TextInput
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  value={props.values.email}
                  placeholder="E-mail"
                  style={styles.input}
                  onSubmitEditing={() => {
                    passwordInput.focus()
                  }}
                  ref={el => emailInput = el}
                />
                <ErroMessage touched={props.touched.email} errors={props.errors.email} />
                <TextInput
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  placeholder="Palavra - passe"
                  style={styles.input}
                  ref={el => passwordInput = el}
                />
                <ErroMessage touched={props.touched.password} errors={props.errors.password} />
                <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='A entrar...' textButton='Entrar'/>
                <Button
                  color={'orange'}
                  onPress={props.handleReset}
                  disabled={props.isSubmitting}
                  style={{ marginTop: 16 }}
                  title='Limpar'
                  >
                </Button>
            </ScrollView>
          )}
        </Formik>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  input: {
    height: 50,
    paddingHorizontal: 8,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: 6
  },
});
