import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, ErroMessage, FormHeader } from '../components/Form';
import { Colors } from 'react-native-ui-lib';
import { modelName as device_name } from 'expo-device';
import { getAppearenceColor, saveTokenId } from '../utils/utilitario';
import { useStores } from '../stores';
import { AlertDialog } from '../components/AlertDialog';
import { CartContext } from '../CartContext';

export default SignUpForm = ({navigation})=> {

  const {user} = useStores();
  const { showDialog, setShowDialog } = useContext(CartContext);

  let sobrenomeInput = null, telefoneInput = null, emailInput = null, passwordInput = null, comfirmPasswordInput = null;
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const initialValues = { 
    device_name: null,
    first_name: null,
    last_name: null,
    email: null,
    telephone: null,
    password: null,
    password_confirmation: null,
  }

    const [error, setError] = useState(initialValues);

    const createUserAccount = async (us)=> {
      try {
        let response = await fetch('http://192.168.18.3/mborasystem-admin/public/api/auth/register',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(us),
        });

        let rjd = await response.json();
        if(rjd.success) {
          saveTokenId('token', rjd.data.token)
          .then(()=>{
              user.setUserName(rjd.data.name);
              user.setUserTelephone(rjd.data.telephone);
              user.setUserEmail(rjd.data.email);
              user.setAuth(true);
            })
          .catch((error)=> setShowDialog({visible: true, title: 'Erro ao salvar token', message: error.message, color: 'orangered'}));
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
            } else if (rjd.data.message.telephone != undefined) {
              messageError = rjd.data.message.telephone;
              setError({ telephone: messageError[0] });
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
        setShowDialog({visible: true, title: 'Erro Criar Conta', message: error.message, color: 'orangered'})
      }
    }

    const handleReset = (resetFields)=> {
      resetFields();
      setError(initialValues);
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={{paddingHorizontal: 16, flex: 1}}>
        <FormHeader title='Mbora' />
        <Formik
          initialValues={{first_name: '', last_name: '', telephone: '', email: '', password: '', password_confirmation: '' }}
          validationSchema={Yup.object({
            first_name: Yup.string()
                .min(4, 'O nome tem que ter no mínimo 4 caracteres')
                .max(15, 'O nome tem que ter no máximo 15 caracteres')
                .required('Digite seu nome'),
            last_name: Yup.string()
                .min(4, 'O sobrenome tem que ter no mínimo 4 caracteres')
                .max(20, 'O sobrenome tem que ter no máximo 20 caracteres')
                .required('Digite seu sobrenome'),
            telephone: Yup.string()
                .matches(phoneRegExp, 'Número de telefone não é válido')
                .min(9,'No mínimo 9 dígitos')
                .required('Digite seu número de telefone'), 
            email: Yup.string()
                .email('Email não é válido')              
                .required('Digite seu email'),
            password: Yup.string()
                .min(8, 'A palavra - passe tem que ter no mínimo 8 caracteres')
                .required('Digite sua palavra - passe'),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref('password')], 'Palavra - passe não coincide')
                .min(8, 'A palavra - passe tem que ter no mínimo 8 caracteres')
                .required('Confirme sua palavra - passe'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
              createUserAccount({...{device_name}, ...values}).then(()=> formikActions.setSubmitting(false));
            }, 500);
          }}>
          {props => (
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center',}}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled keyboardVerticalOffset={100}>
            {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
            <ScrollView>
                <TextInput
                  onChangeText={props.handleChange('first_name')}
                  onBlur={props.handleBlur('first_name')}
                  value={props.values.first_name}
                  placeholder="Nome"
                  placeholderTextColor='gray'
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
                  placeholderTextColor='gray'
                  style={styles.input}
                  onSubmitEditing={() => {
                    emailInput.focus()
                  }}
                  ref={el => sobrenomeInput = el}
                />
                <ErroMessage touched={props.touched.last_name} errors={props.errors.last_name} />
                <ErroMessage touched={true} errors={error.last_name} />
                <View style={styles.divisor}></View>
                <Text style={{color: 'gray'}}>Usar e-mail válido para receber informações relacionada as suas actividades na App.</Text>
                <TextInput
                  keyboardType='email-address'
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  value={props.values.email}
                  placeholder="E-mail"
                  placeholderTextColor='gray'
                  style={styles.input}
                  onSubmitEditing={() => {
                    telefoneInput.focus()
                  }}
                  ref={el => emailInput = el}
                />
                <ErroMessage touched={props.touched.email} errors={props.errors.email} />
                <ErroMessage touched={true} errors={error.email} />
                <TextInput
                  keyboardType='phone-pad'
                  onChangeText={props.handleChange('telephone')}
                  onBlur={props.handleBlur('telephone')}
                  value={props.values.telephone}
                  placeholder="Telefone"
                  placeholderTextColor='gray'
                  style={styles.input}
                  onSubmitEditing={() => {
                    passwordInput.focus()
                  }}
                  ref={el => telefoneInput = el}
                />
                <ErroMessage touched={props.touched.telephone} errors={props.errors.telephone} />
                <ErroMessage touched={true} errors={error.telephone} />
                <View style={styles.divisor}></View>
                <TextInput
                  keyboardType='visible-password'
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  placeholder="Palavra - passe"
                  placeholderTextColor='gray'
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
                  placeholderTextColor='gray'
                  style={styles.input}
                  secureTextEntry={true}
                  ref={el => comfirmPasswordInput = el}
                />
                <ErroMessage touched={props.touched.password_confirmation} errors={props.errors.password_confirmation} />
                <ErroMessage touched={true} errors={error.password_confirmation} />
                <ErroMessage touched={true} errors={error.device_name} />
                <View style={styles.divisor}></View>
                <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='A CRIAR...' textButton='CRIAR CONTA'/>
                <Button
                  color={'orange'}
                  onPress={()=> handleReset(props.handleReset)}
                  disabled={props.isSubmitting}
                  style={{ marginTop: 16 }}
                  title='Limpar'
                  >
                </Button>
                <View style={styles.divisor}></View>
                <TouchableOpacity style={styles.buttonBack} onPress={()=> navigation.goBack()}>
                    <Text style={styles.btnText}>CANCELAR</Text>
                </TouchableOpacity>
            </ScrollView>
            </KeyboardAvoidingView>
          )}
        </Formik>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getAppearenceColor()
  },
  input: {
    height: 50,
    paddingHorizontal: 8,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: 'whitesmoke',
    borderRadius: 4,
    marginTop: 6
  },
  divisor: {
    borderBottomWidth: 1, 
    borderBottomColor: Colors.$backgroundDisabled, 
    marginTop: 10,
    marginBottom: 5
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonBack: {
    width: '100%',
    height: 45,
    marginVertical: 16,
    backgroundColor: 'royalblue',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
});
