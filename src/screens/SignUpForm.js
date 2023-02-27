import React from 'react';
import { Text, View, StyleSheet, TextInput, Alert, Button, TouchableOpacity, ActivityIndicator, Image, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default SignUpForm = ()=> {
  let sobrenomeInput = null, emailInput = null, passwordInput = null, comfirmPasswordInput = null;
    return (
      <View style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.viewIcon}>
                <Image style={styles.icon} source={require('../../assets/icon.png')}/>
            </View>
          </TouchableWithoutFeedback>
        <Text style={styles.title}>Criar Conta</Text>
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
                {props.touched.firstName && props.errors.firstName ? (
                  <Text style={styles.error}>{props.errors.firstName}</Text>
                ) : null}
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
                {props.touched.lastName && props.errors.lastName ? (
                  <Text style={styles.error}>{props.errors.lastName}</Text>
                ) : null}
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
                {props.touched.email && props.errors.email ? (
                  <Text style={styles.error}>{props.errors.email}</Text>
                ) : null}
                <TextInput
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  placeholder="Palavra - passe"
                  style={styles.input}
                  onSubmitEditing={() => {
                    comfirmPasswordInput.focus()
                  }}
                  ref={el => passwordInput = el}
                />
                {props.touched.password && props.errors.password ? (
                  <Text style={styles.error}>{props.errors.password}</Text>
                ) : null}
                <TextInput
                  onChangeText={props.handleChange('comfirm_password' )}
                  onBlur={props.handleBlur('comfirm_password')}
                  value={props.values.comfirm_password}
                  placeholder="Confirmar palavra - passe"
                  style={styles.input}
                  ref={el => comfirmPasswordInput = el}
                />
                {props.touched.comfirm_password && props.errors.comfirm_password ? (
                  <Text style={styles.error}>{props.errors.comfirm_password}</Text>
                ) : null}
                <ButtonLogin onPress={props.handleSubmit} loading={props.isSubmitting} />
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

  const ButtonLogin = ({ onPress, loading}) => {
    return (
        <TouchableOpacity
          onPress={onPress}
          disabled={loading}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{loading ? 'A criar...': 'Criar'}</Text>
          {loading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  title: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'orange'
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: 'red',
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
  loadMoreBtn: {
    width: '100%',
    height: 45,
    marginVertical: 8,
    backgroundColor: 'green',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  viewIcon: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginVertical: 16
  },
  icon: {
    width: 60, 
    height: 80, 
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4, 
  }
});
