import React from 'react';
import { View, StyleSheet, TextInput, Alert, Button, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, FormHeader, ErroMessage } from '../components/Form';
import { Colors } from 'react-native-ui-lib';

export default SignUpForm = ()=> {
  let sobrenomeInput = null, emailInput = null, passwordInput = null, comfirmPasswordInput = null;
    return (
      <View style={styles.container}>
        <FormHeader title='Criar Conta' />
        <Formik
          initialValues={{firstName: '', lastName: '', email: '', password: '', comfirm_password: '' }}
          validationSchema={Yup.object({
            firstName: Yup.string()
                .min(4, 'O nome tem que ter no mínimo 4 caracteres')
                .max(15, 'O nome tem que ter no máximo 15 caracteres')
                .required('Digite seu nome'),
            lastName: Yup.string()
                .min(4, 'O sobrenome tem que ter no mínimo 4 caracteres')
                .max(20, 'O sobrenome tem que ter no máximo 20 caracteres')
                .required('Digite seu sobrenome'),
            email: Yup.string()
                .email('Email não é válido')              
                .required('Digite o email'),
            password: Yup.string()
                .min(8, 'A palavra - passe tem que ter no mínimo 8 caracteres')
                .required('Digite a palavra - passe'),
            comfirm_password: Yup.string()
                .min(8, 'A palavra - passe tem que ter no mínimo 8 caracteres')
                .required('Confirme a palavra - passe'),
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
                <View style={styles.divisor}></View>
                <TextInput
                  onChangeText={props.handleChange('firstName')}
                  onBlur={props.handleBlur('firstName')}
                  value={props.values.firstName}
                  placeholder="Nome"
                  style={styles.input}
                  onSubmitEditing={() => {
                    sobrenomeInput.focus()
                  }}
                />
                <ErroMessage touched={props.touched.firstName} errors={props.errors.firstName} />
                <TextInput
                  onChangeText={props.handleChange('lastName')}
                  onBlur={props.handleBlur('lastName')}
                  value={props.values.lastName}
                  placeholder="Sobrenome"
                  style={styles.input}
                  onSubmitEditing={() => {
                    emailInput.focus()
                  }}
                  ref={el => sobrenomeInput = el}
                />
                <ErroMessage touched={props.touched.lastName} errors={props.errors.lastName} />
                <View style={styles.divisor}></View>
                <TextInput
                  keyboardType='email-address'
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
                <View style={styles.divisor}></View>
                <TextInput
                  keyboardType='visible-password'
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  placeholder="Palavra - passe"
                  style={styles.input}
                  secureTextEntry={true}
                  onSubmitEditing={() => {
                    comfirmPasswordInput.focus()
                  }}
                  ref={el => passwordInput = el}
                />
                <ErroMessage touched={props.touched.password} errors={props.errors.password} />
                <TextInput
                  keyboardType='visible-password'
                  onChangeText={props.handleChange('comfirm_password' )}
                  onBlur={props.handleBlur('comfirm_password')}
                  value={props.values.comfirm_password}
                  placeholder="Confirmar palavra - passe"
                  style={styles.input}
                  secureTextEntry={true}
                  ref={el => comfirmPasswordInput = el}
                />
                <ErroMessage touched={props.touched.comfirm_password} errors={props.errors.comfirm_password} />
                <View style={styles.divisor}></View>
                <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='A criar...' textButton='Criar'/>
                <Button
                  color={'orange'}
                  onPress={props.handleReset}
                  disabled={props.isSubmitting}
                  style={{ marginTop: 16 }}
                  title='Limpar'
                  >
                </Button>
                <View style={styles.divisor}></View>
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
  divisor: {
    borderBottomWidth: 1, 
    borderBottomColor: Colors.$backgroundDisabled, 
    marginTop: 10,
    marginBottom: 5
  }, 
});
