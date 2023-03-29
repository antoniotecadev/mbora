import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, ErroMessage } from '../components/Form';
import { Colors, Text as TextUILIB} from 'react-native-ui-lib';
import { getAppearenceColor, getValueItemAsync } from '../utils/utilitario';
import { useStores } from '../stores';
import { AlertDialog } from '../components/AlertDialog';
import { CartContext } from '../CartContext';
import ToastMessage from '../components/ToastMessage';

export default ProfileEdit = ()=> {

  const {user} = useStores();
  const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

  let sobrenomeInput = null, passwordInput = null, comfirmPasswordInput = null;

  const initialValues = { 
    first_name: null,
    last_name: null,
    old_password: null,
    password: null,
    password_confirmation: null,
  }

    const [error, setError] = useState(initialValues);

    const userUpdate = async (us, isName, resetForm)=> {
      try {
        let URL = null;
        if (isName) {
            URL = 'http://192.168.18.3/mborasystem-admin/public/api/mbora/update/user';
        } else {
            URL = 'http://192.168.18.3/mborasystem-admin/public/api/mbora/update/password/user';
        }
        let response = await fetch(URL,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
          },
          body: JSON.stringify(us)
        });

        let rjd = await response.json();
        if(rjd.success) {
            if (isName) {
                user.setUserName(rjd.data.name);
            }
            resetForm();
            setVisibleToast({visible: true, message: rjd.message, backgroundColor: 'green'});
        } else {
            if (rjd.message == 'Erro de validação') {
                let messageError;
                if (rjd.data.message.first_name != undefined) {
                    messageError = rjd.data.message.first_name;
                    setError({ first_name: messageError[0] });
                } else if (rjd.data.message.last_name != undefined) {
                    messageError = rjd.data.message.last_name;
                    setError({ last_name: messageError[0] });
                } else if (rjd.data.message.password != undefined) {
                    messageError = rjd.data.message.password;
                    setError({ password: messageError[0] });
                } else if (rjd.data.message.old_password != undefined) {
                    messageError = rjd.data.message.old_password;
                    setError({ old_password: messageError });
                } else {
                    messageError = rjd.data.message.password_confirmation;
                    setError({ password_confirmation: messageError[0] });
                }
            } else {
                setShowDialog({visible: true, title: 'Erro', message: rjd.data.message, color: 'orangered'})
            }
        }
      } catch (error) {
            setShowDialog({visible: true, title: 'Erro', message: error.message, color: 'orangered'})
      }
    }

    return (
    <SafeAreaView style={styles.container}>
        <ToastMessage />
        <ScrollView style={{paddingHorizontal: 16}}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Formik
          initialValues={{first_name: '', last_name: ''}}
          validationSchema={Yup.object({
            first_name: Yup.string()
                .min(4, 'O nome tem que ter no mínimo 4 caracteres')
                .max(15, 'O nome tem que ter no máximo 15 caracteres')
                .required('Digite seu nome'),
            last_name: Yup.string()
                .min(4, 'O sobrenome tem que ter no mínimo 4 caracteres')
                .max(20, 'O sobrenome tem que ter no máximo 20 caracteres')
                .required('Digite seu sobrenome'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
              userUpdate(values, true, formikActions.resetForm).then(()=> formikActions.setSubmitting(false));
            }, 500);
          }}>
          {props => (
            <>
            {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
                <TextUILIB marginT-10 textColor text50>{user.userName}</TextUILIB>
                <TextUILIB marginT-20 textColor>*Alterar Nome e Sobrenome</TextUILIB>
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
                  ref={el => sobrenomeInput = el}
                />
                <ErroMessage touched={props.touched.last_name} errors={props.errors.last_name} />
                <ErroMessage touched={true} errors={error.last_name} />
                <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>
                <View style={styles.divisor}/>
                <TextInput
                    editable={false}
                    keyboardType='email-address'
                    value={user.userEmail}
                    placeholder="E-mail"
                    style={styles.input}
                />
                <View style={styles.divisor}/>
            </>
          )}
        </Formik>
        <Formik
          initialValues={{old_password: '', password: '', password_confirmation: ''}}
          validationSchema={Yup.object({
            old_password: Yup.string()
                .required('Digite a sua palavra - passe'),
            password: Yup.string()
                .min(8, 'A nova palavra - passe tem que ter no mínimo 8 caracteres')
                .required('Digite a nova palavra - passe'),
            password_confirmation: Yup.string()
                .oneOf([Yup.ref('password')], 'Não coincide com a nova palavra - passe')
                .required('Confirme a nova palavra - passe'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
              userUpdate(values, false, formikActions.resetForm).then(()=> formikActions.setSubmitting(false));
            }, 500);
          }}>
          {props => (
            <>
            {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
                <TextUILIB marginT-20 textColor>*Alterar Palavra - passe</TextUILIB>
                <TextInput
                  keyboardType='visible-password'
                  onChangeText={props.handleChange('old_password')}
                  onBlur={props.handleBlur('old_password')}
                  onFocus={()=> setError({old_password: null})}
                  value={props.values.old_password}
                  placeholder="Palavra - passe"
                  style={styles.input}
                  secureTextEntry={true}
                  onSubmitEditing={() => {
                    passwordInput.focus()
                  }}
                />
                <ErroMessage touched={props.touched.old_password} errors={props.errors.old_password} />
                <ErroMessage touched={true} errors={error.old_password} />
                <TextInput
                  keyboardType='visible-password'
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  placeholder="Nova palavra - passe"
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
                  placeholder="Confirmar nova palavra - passe"
                  style={styles.input}
                  secureTextEntry={true}
                  ref={el => comfirmPasswordInput = el}
                />
                <ErroMessage touched={props.touched.password_confirmation} errors={props.errors.password_confirmation} />
                <ErroMessage touched={true} errors={error.password_confirmation} />
                <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>
            </>
          )}
        </Formik>
        </KeyboardAvoidingView>
        </ScrollView>
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
  }
});
