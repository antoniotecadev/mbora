import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, Button, ScrollView, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, FormHeader, ErroMessage } from '../components/Form';
import { modelName as device_name } from 'expo-device';
import { getAppearenceColor, getValueItemAsync, saveTokenId } from '../utils/utilitario';
import { Colors, Text as TextUILIB } from 'react-native-ui-lib';
import { useServices } from '../services';
import { useStores } from '../stores';
import { AlertDialog } from '../components/AlertDialog';
import { CartContext } from '../CartContext';

export default SignInForm = ()=> {

    const { user } = useStores();
    const { nav } = useServices();
    const { showDialog, setShowDialog } = useContext(CartContext);

    let passwordInput = null;

    const [error, setError] = useState({ 
        email: null,
        password: null,
        emailPass: null
     });

    const loginUser = async (credential)=> {
        try {
            let response = await fetch('http://192.168.18.3/mborasystem-admin/public/api/auth/login',
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
                    user.setUserName(rjd.data.name);
                    user.setUserEmail(rjd.data.email);
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
          setShowDialog({visible: true, title: 'Erro Entrar Conta', message: error.message, color: 'orangered'})
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

    return (
      <SafeAreaView style={styles.container}>
        {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
        <View style={{paddingHorizontal: 16}}>
          <FormHeader title='Mbora' />
          <Formik
            initialValues={{email: '', password: '' }}
            validationSchema={Yup.object({
              email: Yup.string()
                  .email('Email não é válido')              
                  .required('Digite o email'),
              password: Yup.string()
                  .required('Digite a palavra - passe'),
            })}
            onSubmit={(values, formikActions) => {
              setTimeout(() => {
                loginUser({...{device_name}, ...values}).then(()=> formikActions.setSubmitting(false));
              }, 500);
            }}>
            {props => (
              <ScrollView>
                <TextInput
                    keyboardType='email-address'
                    onChangeText={props.handleChange('email')}
                    onBlur={props.handleBlur('email')}
                    value={props.values.email}
                    placeholder="E-mail"
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
                    onBlur={props.handleBlur('password')}
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
                    <TextUILIB textColor style={{ textAlign: 'center', marginVertical: 16 }}>Esqueceu a palavra - passe ?</TextUILIB>
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
