import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, ErroMessage } from '../components/Form';
import { Colors } from 'react-native-ui-lib';
import { modelName as device_name } from 'expo-device';
import { saveTokenId } from '../utils/utilitario';
import { RootNavigator } from '.';

export default SignUpForm = (user)=> {

  let sobrenomeInput = null, emailInput = null, passwordInput = null, comfirmPasswordInput = null;

  const initialValues = { 
    device_name: null,
    first_name: null,
    last_name: null,
    email: null,
    password: null,
    password_confirmation: null,
  }

  const [error, setError] = useState(initialValues);
  const [isSignedIn , setIsSignedIn] = useState(0);

    const createUserAccount = async (user)=> {
      try {
        let response = await fetch('http://192.168.18.3/mborasystem-admin/public/api/auth/register',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        let rjd = await response.json();
        if(rjd.success) {
          saveTokenId('token', rjd.data.token, rjd.data.user_id)
          .then(()=> setIsSignedIn(1))
          .catch((error)=> Alert.alert('Erro ao salvar token', error.message));
        } else {
          if (rjd.message == 'Erro de validação') {
            let messageError;
            if (rjd.data.message.device_name != undefined){
              messageError = rjd.data.message.device_name;
              setError({ device_name: messageError[0] });
            } else if (rjd.data.message.first_name != undefined) {
              messageError = rjd.data.message.first_name;
              setError({ first_name: messageError[0] });
            } else if (rjd.data.message.last_name != undefined) {
              messageError = rjd.data.message.last_name;
              setError({ last_name: messageError[0] });
            } else if (rjd.data.message.email != undefined) {
              messageError = rjd.data.message.email;
              setError({ email: messageError[0] });
            } else if (rjd.data.message.password != undefined) {
              messageError = rjd.data.message.password;
              setError({ password: messageError[0] });
            } else {
              messageError = rjd.data.message.password_confirmation;
              setError({ password_confirmation: messageError[0] });
            }
            // Alert.alert(rjd.message, messageError[0]); // Test
          } else {
            setError({ password_confirmation: rjd.data.message });
            // Alert.alert(rjd.message, rjd.data.message); // Test
          }
        }
        // Alert.alert('Result', JSON.stringify(rjd)); // Test
        // console.log(JSON.stringify(rjd)); // Test
      } catch (error) {
        Alert.alert('Erro', error.message);
      }
    }

    const handleReset = (resetFields)=> {
      resetFields();
      setError(initialValues);
    }

    return (
      <>
      {isSignedIn == 1 ? <RootNavigator isSignedIn={isSignedIn}/> :
      <View style={styles.container}>
        <Formik
          initialValues={{first_name: '', last_name: '', email: '', password: '', password_confirmation: '' }}
          validationSchema={Yup.object({
            first_name: Yup.string()
                .min(4, 'O nome tem que ter no mínimo 4 caracteres')
                .max(15, 'O nome tem que ter no máximo 15 caracteres')
                .required('Digite seu nome'),
            last_name: Yup.string()
                .min(4, 'O sobrenome tem que ter no mínimo 4 caracteres')
                .max(20, 'O sobrenome tem que ter no máximo 20 caracteres')
                .required('Digite seu sobrenome'),
            email: Yup.string()
                .email('Email não é válido')              
                .required('Digite o email'),
            password: Yup.string()
                .min(8, 'A palavra - passe tem que ter no mínimo 8 caracteres')
                .required('Digite a palavra - passe'),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref('password')], 'Palavra - passe não coincide')
                .min(8, 'A palavra - passe tem que ter no mínimo 8 caracteres')
                .required('Confirme a palavra - passe'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
              createUserAccount({...{device_name}, ...values}).then(()=> formikActions.setSubmitting(false));
            }, 500);
          }}>
          {props => (
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center',}}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled keyboardVerticalOffset={100}>
            <ScrollView>
                <TextInput
                  onChangeText={props.handleChange('first_name')}
                  onBlur={props.handleBlur('first_name')}
                  value={props.values.first_name}
                  placeholder="Nome"
                  style={styles.input}
                  onSubmitEditing={() => {
                    sobrenomeInput.focus()
                  }}
                />
                <ErroMessage touched={props.touched.first_name} errors={props.errors.first_name} />
                <ErroMessage touched={true} errors={error.first_name} />
                <TextInput
                  onChangeText={props.handleChange('last_name')}
                  onBlur={props.handleBlur('last_name')}
                  value={props.values.last_name}
                  placeholder="Sobrenome"
                  style={styles.input}
                  onSubmitEditing={() => {
                    emailInput.focus()
                  }}
                  ref={el => sobrenomeInput = el}
                />
                <ErroMessage touched={props.touched.last_name} errors={props.errors.last_name} />
                <ErroMessage touched={true} errors={error.last_name} />
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
                <ErroMessage touched={true} errors={error.email} />
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
                <ErroMessage touched={true} errors={error.password} />
                <TextInput
                  keyboardType='visible-password'
                  onChangeText={props.handleChange('password_confirmation' )}
                  onBlur={props.handleBlur('password_confirmation')}
                  value={props.values.password_confirmation}
                  placeholder="Confirmar palavra - passe"
                  style={styles.input}
                  secureTextEntry={true}
                  ref={el => comfirmPasswordInput = el}
                />
                <ErroMessage touched={props.touched.password_confirmation} errors={props.errors.password_confirmation} />
                <ErroMessage touched={true} errors={error.password_confirmation} />
                <ErroMessage touched={true} errors={error.device_name} />
                <View style={styles.divisor}></View>
                <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='A criar...' textButton='Criar'/>
                <Button
                  color={'orange'}
                  onPress={()=> handleReset(props.handleReset)}
                  disabled={props.isSubmitting}
                  style={{ marginTop: 16 }}
                  title='Limpar'
                  >
                </Button>
                <View style={styles.divisor}></View>
            </ScrollView>
            </KeyboardAvoidingView>
          )}
        </Formik>
      </View>}
      </>
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
