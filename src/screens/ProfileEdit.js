import React, { useState, useContext, useEffect } from 'react';
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

export default ProfileEdit = ({navigation})=> {

  const {user} = useStores();
  const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

  let sobrenomeInput = null, passwordEmailInput=null, passwordInput = null, comfirmPasswordInput = null;

  const initialValues = { 
    first_name: null,
    last_name: null,
    email: null,
    password_verify_email: null,
    old_password: null,
    password: null,
    password_confirmation: null,
  }

  const [focus, setFocus] = useState({name: false, email: false, password: false})
  const [error, setError] = useState(initialValues);

  const userUpdate = async (us, action, resetForm)=> {
      try {
        let URL = null;
        if (action == 0) {
            URL = 'http://192.168.18.3/mborasystem-admin/public/api/mbora/update/user';
        } else if(action == 1) {
            URL = 'http://192.168.18.3/mborasystem-admin/public/api/mbora/update/email/user';
        } else if(action == 3) {
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
            if (action == 0) {
              navigation.setOptions({title: us.first_name + ' ' + us.last_name})
              user.setUserFirstName(rjd.data.first_name);
              user.setUserLastName(rjd.data.last_name);
            } else if(action == 1) {
              user.setUserEmail(us.email);
            }
            resetForm();
            setVisibleToast({visible: true, message: rjd.message, backgroundColor: 'green'});
        } else {
            if (rjd.message == 'Erro de validação') {
                let messageError;
                if (rjd.data.message.first_name != undefined) {
                    messageError = rjd.data.message.first_name;
                    setError({ first_name: messageError });
                } else if (rjd.data.message.last_name != undefined) {
                    messageError = rjd.data.message.last_name;
                    setError({ last_name: messageError });
                } else if (rjd.data.message.email != undefined) {
                    messageError = rjd.data.message.email;
                    setError({ email: messageError });
                } else if (rjd.data.message.password_verify_email != undefined) {
                    messageError = rjd.data.message.password_verify_email;
                    setError({ password_verify_email: messageError });
                } else if (rjd.data.message.password != undefined) {
                    messageError = rjd.data.message.password;
                    setError({ password: messageError });
                } else if (rjd.data.message.old_password != undefined) {
                    messageError = rjd.data.message.old_password;
                    setError({ old_password: messageError });
                } else if(rjd.data.message.password_confirmation != undefined) {
                    messageError = rjd.data.message.password_confirmation;
                    setError({ password_confirmation: messageError });
                }
            } else {
                setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'})
            }
        }
      } catch (error) {
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
      }
    }

    useEffect(() => {
      navigation.setOptions({title: user.userFirstName + ' ' + user.userLastName})
      navigation.getParent()?.setOptions({
        tabBarStyle: {
            display: "none"
        }
      });
      return ()=> {
        navigation.getParent()?.setOptions({
          tabBarStyle: 'flex'
        });
      }
      // navigation.setOptions({
      //   headerRight: () => (
      //     <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
      //       <Text style={{color: 'orange', fontWeight: 'bold'}}>OK</Text>
      //     </TouchableOpacity>
      //   ),
      // });
    }, [])

    return (
    <SafeAreaView style={styles.container}>
        <View style={{paddingHorizontal: 16, flex: 1}}>
        <ToastMessage />
        <Formik
          initialValues={{first_name: user.userFirstName || '', last_name: user.userLastName || ''}}
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
              userUpdate(values, 0, formikActions.resetForm).then(()=> { 
                formikActions.setSubmitting(false)
                formikActions.setValues({first_name: values.first_name, last_name: values.last_name})
            });
            }, 500);
          }}>
          {props => (
            <>
            {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
                <TextUILIB marginT-20 textColor>Alterar Nome e Sobrenome</TextUILIB>
                <TextInput
                  onFocus={()=> setFocus({name: true})}
                  onChangeText={props.handleChange('first_name')}
                  onBlur={()=> {
                    if(user.userFirstName == props.values.first_name) {
                      setFocus({name: false})
                    }
                    props.handleBlur('first_name')
                  }}
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
                  onFocus={()=> setFocus({name: true})}
                  onChangeText={props.handleChange('last_name')}
                  onBlur={()=> {
                    if(user.userLastName == props.values.last_name) {
                      setFocus({name: false})
                    }
                    props.handleBlur('last_name')
                  }}
                  value={props.values.last_name}
                  placeholder="Sobrenome"
                  placeholderTextColor='gray'
                  style={styles.input}
                  ref={el => sobrenomeInput = el}
                />
                <ErroMessage touched={props.touched.last_name} errors={props.errors.last_name} />
                <ErroMessage touched={true} errors={error.last_name} />
                {focus.name && <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>}
            </>
          )}
        </Formik>
        <Formik
          initialValues={{email: user.userEmail || '', password_verify_email: ''}}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Email não é válido')              
              .required('Digite seu email'),
            password_verify_email: Yup.string()
              .required('Digite a sua palavra - passe'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
              userUpdate(values, 1, formikActions.resetForm).then(()=> {
                formikActions.setSubmitting(false)
                formikActions.setValues({email: values.email})
              });
            }, 500);
          }}>
          {props => (
            <>
            {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
                <TextUILIB marginT-20 textColor>Alterar e-mail</TextUILIB>
                <TextUILIB style={{color: 'gray', fontSize: 10}}>Usar e-mail válido para receber informações relacionada as suas actividades na App.</TextUILIB>
                <TextInput
                  onFocus={()=> setFocus({email: true})}
                  keyboardType='email-address'
                  onChangeText={props.handleChange('email')}
                  onBlur={()=> {
                    if(user.userEmail == props.values.email) {
                      setFocus({email: false})
                    }
                    props.handleBlur('email')
                  }}
                  value={props.values.email}
                  placeholder="E-mail"
                  placeholderTextColor='gray'
                  style={styles.input}
                  onSubmitEditing={() => {
                    passwordEmailInput.focus()
                  }}
                  />
                <ErroMessage touched={props.touched.email} errors={props.errors.email} />
                <ErroMessage touched={true} errors={error.email} />
                {focus.email && <>
                <TextInput
                  keyboardType='visible-password'
                  onChangeText={props.handleChange('password_verify_email')}
                  onBlur={props.handleBlur('password_verify_email')}
                  onFocus={()=> setError({password_verify_email: null})}
                  value={props.values.password_verify_email}
                  placeholder="Palavra - passe"
                  placeholderTextColor='gray'
                  style={styles.input}
                  secureTextEntry={true}
                  ref={el => passwordEmailInput = el}
                />
                <ErroMessage touched={props.touched.password_verify_email} errors={props.errors.password_verify_email} />
                <ErroMessage touched={true} errors={error.password_verify_email} />
                <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/></>}
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
              userUpdate(values, 3, formikActions.resetForm).then(()=> formikActions.setSubmitting(false));
            }, 500);
          }}>
          {props => (
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center',}}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled keyboardVerticalOffset={100}>
            {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
              <ScrollView>
                <TextUILIB marginT-20 textColor>Alterar Palavra - passe</TextUILIB>
                <TextInput
                  keyboardType='visible-password'
                  onChangeText={props.handleChange('old_password')}
                  onBlur={props.handleBlur('old_password')}
                  onFocus={()=> setError({old_password: null})}
                  value={props.values.old_password}
                  placeholder="Palavra - passe"
                  placeholderTextColor='gray'
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
                  onFocus={()=> setFocus({password: true})}
                  keyboardType='visible-password'
                  onChangeText={props.handleChange('password_confirmation' )}
                  onBlur={()=> {
                    if(props.values.password_confirmation == ''){
                      setFocus({password: false})
                    }
                    props.handleBlur('password_confirmation')
                  }}
                  value={props.values.password_confirmation}
                  placeholder="Confirmar nova palavra - passe"
                  placeholderTextColor='gray'
                  style={styles.input}
                  secureTextEntry={true}
                  ref={el => comfirmPasswordInput = el}
                />
                <ErroMessage touched={props.touched.password_confirmation} errors={props.errors.password_confirmation} />
                <ErroMessage touched={true} errors={error.password_confirmation} />
                {focus.password && <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>}
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
  }
});
