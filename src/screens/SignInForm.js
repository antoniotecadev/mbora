import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView, Text, TouchableOpacity, Image, SafeAreaView, Platform, Alert  } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, FormHeader, ErroMessage } from '../components/Form';
import { modelName as device_name, isDevice } from 'expo-device';
import { getAppearenceColor, getValueItemAsync, saveTokenId } from '../utils/utilitario';
import { Colors, Text as TextUILIB } from 'react-native-ui-lib';
import { useServices } from '../services';
import { useStores } from '../stores';
import { AlertDialog } from '../components/AlertDialog';
import { CartContext } from '../CartContext';
import ToastMessage from '../components/ToastMessage';
import { isEmpty } from 'lodash';
import * as Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

export default SignInForm = ()=> {

    const { user } = useStores();
    const { nav } = useServices();
    const { showDialog, setShowDialog } = useContext(CartContext);

    let passwordInput = null;

    const [error, setError] = useState({ 
        email: null, // Email ou Telefone
        password: null,
        emailPass: null
     });

    const loginUser = async (credential)=> {
        try {
            let response = await fetch(Constants.default.manifest.extra.API_URL + 'auth/login',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                    },
                body: JSON.stringify(credential),
            });
            let rjd = await response.json();
            if(rjd.success) {
                saveTokenId('token', rjd.data.token)
                .then(()=>{
                    user.setUserFirstName(rjd.data.first_name);
                    user.setUserLastName(rjd.data.last_name);
                    user.setUserTelephone(rjd.data.telephone);
                    user.setUserEmail(rjd.data.email);
                    user.setIMEI(rjd.data.imei);
                    user.setAccountAdmin(rjd.data.account_admin);
                    user.setAuth(true);
                  })
                .catch((error)=> setShowDialog({visible: true, title: 'Erro ao salvar token', message: error.message, color: 'orangered'}));
            } else {
                if(rjd.message == 'Erro de validação') {
                    let messageError;
                    if(rjd.data.message.email != undefined) {
                        messageError = rjd.data.message.email;
                        setError({ email: messageError[0] });
                    } else if (rjd.data.message.password != undefined) {
                        messageError = rjd.data.message.password;
                        setError({ password: messageError[0] });
                    } 
                    // Alert.alert(rjd.message, messageError[0]); // For test
                } else {
                    setError({ emailPass: rjd.data.message });
                    // Alert.alert(rjd.message, rjd.data.message); // For test
                }
            }
            // Alert.alert('Result', JSON.stringify(rjd)); // For test
            // console.log(JSON.stringify(rjd)); // For test
        } catch (error) {
          setShowDialog({visible: true, title: 'Entrar Conta', message: error.message, color: 'orangered'})
        }
    } 

    const handleReset = (resetFields)=>{
        resetFields();
        setError({ 
            email: null,
            password: null,
            emailPass: null
         });
    }

    async function registerForPushNotificationsAsync() {
      let token;
      if (isDevice) { // Você deve verificar se o aplicativo está sendo executado em um dispositivo físico, pois as notificações por push não funcionam em um emulador/simulador.
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        // Isso fornece o ExpoPushToken.
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }
      // No Android, você precisa especificar um canal.
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      return token;
    }

    return (
      <SafeAreaView style={styles.container}>
        {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
        <View style={{paddingHorizontal: 16}}>
        <ToastMessage/> 
          <FormHeader title='Mbora' />
          <Formik
            initialValues={{email: '', password: '' }}
            validationSchema={Yup.object({
              email: Yup.string().when('type', { // Email e Telefone
                is: 'email',
                then: Yup.string().required('Digite o email | telefone'),
                otherwise: Yup.string().required('Digite o email | telefone'),
              }),
              password: Yup.string()
                  .required('Digite a palavra - passe'),
            })}
            onSubmit={(values, formikActions) => {
              setTimeout(() => {
                registerForPushNotificationsAsync().then(token => {
                  loginUser({...{exponentPushToken: token, device_name}, ...values}).then(()=> formikActions.setSubmitting(false));
                  formikActions.setSubmitting(false);
                }).catch((error)=> {
                  formikActions.setSubmitting(false);
                  Alert.alert('Ocorreu um erro', error.message)
                });
              }, 500);
            }}>
            {props => (
              <ScrollView showsVerticalScrollIndicator={false}>
                  <TextInput
                    keyboardType='email-address'
                    onChangeText={props.handleChange('email')}
                    onBlur={()=> {
                        if(!isEmpty(props.values.email)){
                          return props.handleBlur('email')
                        }
                      }
                    }
                    value={props.values.email}
                    placeholder="E-mail ou Telefone"
                    placeholderTextColor='gray'
                    style={styles.input}
                    onSubmitEditing={() => {
                      passwordInput.focus()
                    }}
                  />
                  <ErroMessage touched={props.touched.email} errors={props.errors.email} />
                  <ErroMessage touched={true} errors={error.email} />
                  <TextInput
                    keyboardType='default'
                    onChangeText={props.handleChange('password')}
                    onBlur={()=> {
                        if(!isEmpty(props.values.password)){
                          return props.handleBlur('password')
                        }
                      }
                    }
                    value={props.values.password}
                    placeholder="Palavra - passe"
                    placeholderTextColor='gray'
                    style={styles.input}
                    secureTextEntry={true}
                    ref={el => passwordInput = el}
                  />
                  <ErroMessage touched={props.touched.password} errors={props.errors.password} />
                  <ErroMessage touched={true} errors={error.password} />
                  <ErroMessage touched={true} errors={error.emailPass} />
                  <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='A ENTRAR...' textButton='ENTRAR'/>
                  <Button
                    color={'orange'}
                    onPress={()=> handleReset(props.handleReset)}
                    disabled={props.isSubmitting}
                    title='LIMPAR'
                    >
                  </Button>
                  <TouchableOpacity>
                    <TextUILIB textColor style={{ textAlign: 'center', marginVertical: 16 }} onPress={()=> nav.show('FindAccount')} >Esqueceu a palavra - passe ?</TextUILIB>
                  </TouchableOpacity>
                  <View style={styles.divisor}></View>
                  <TouchableOpacity style={styles.buttonCreate} onPress={()=> nav.show('SignUpForm')}>
                    <Text style={styles.btnText}>CRIAR NOVA CONTA</Text>
                  </TouchableOpacity>
              </ScrollView>
            )}
          </Formik>
          <View style={styles.viewImage}>
              <Image style={styles.image} source={require('../../assets/logotipo-yoga-original-removebg.png')}/>
          </View>
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
    marginVertical: 6 
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  buttonCreate: {
    width: '100%',
    height: 45,
    marginVertical: 16,
    backgroundColor: 'royalblue',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewImage: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  image: {
    width: 100, 
    height: 50,
  },
});
