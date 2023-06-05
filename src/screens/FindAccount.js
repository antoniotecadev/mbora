import React, { useState, useContext, useCallback } from 'react';
import { View, StyleSheet, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, BackHandler } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, ErroMessage } from '../components/Form';
import { getAppearenceColor } from '../utils/utilitario';
import { Text as TextUILIB, View as ViewUILIB, Avatar } from 'react-native-ui-lib';
import { AlertDialog } from '../components/AlertDialog';
import { CartContext } from '../CartContext';
import { isEmpty, isInteger } from 'lodash';
import ToastMessage from '../components/ToastMessage';
import * as Constants from 'expo-constants';

const API_URL = Constants.default.manifest.extra.API_URL;
const preview = {uri: "data:image/png;base64,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"};

export const FindAccount = ({navigation})=> {

    const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

    const findAccount = async(email)=> {
        try {
            let response = await fetch(API_URL + 'mbora/find/account/user/' + email);
            let rjd = await response.json();
            if(isEmpty(rjd)) {
                setVisibleToast({visible: true, message: 'Conta não encontrada', backgroundColor: 'orangered'});
            } else {
                navigation.navigate('ListAccount', {account: rjd});
            }
        } catch (error) {
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
        }
    } 
    return (
      <SafeAreaView style={styles.container}>
        {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
        <View style={{paddingHorizontal: 16}}>
        <ToastMessage/> 
        <TextUILIB textColor text60 marginV-10>Encontra a tua conta</TextUILIB>
        <TextUILIB textColor marginB-20>Insira o seu endereço de e-mail ou Telefone</TextUILIB>
          <Formik
            initialValues={{email: ''}}
            validationSchema={Yup.object({
                    email: Yup.string().when('type', { // Email e Telefone
                        is: 'email',
                        then: Yup.string()
                            .email('Email não é válido')
                            .required('Insira o email | telefone'),
                        otherwise: Yup.string()
                            .min(9,'No mínimo 9 dígitos para Telefone')
                            .required('Insira o email | telefone'),
                    }),
                })
            }
            onSubmit={(values, formikActions) => {
              setTimeout(() => {
                findAccount(values.email).then(()=> formikActions.setSubmitting(false));
              }, 500);
            }}>
            {props => (
              <>
                <TextInput
                    autoFocus
                    keyboardType='email-address'
                    onChangeText={props.handleChange('email')}
                    onBlur={props.handleBlur('email')}
                    value={props.values.email}
                    placeholder="E-mail ou Telefone"
                    placeholderTextColor='gray'
                    style={styles.input}
                  />
                  <ErroMessage touched={props.touched.email} errors={props.errors.email} />
                  <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='A PROCURAR...' textButton='ENCONTRAR CONTA'/>
              </>
            )}
          </Formik>
        </View>
        </SafeAreaView>
    );
  }

export const ListAccount = ({route, navigation})=> {

    const { account } = route.params;

    const Item = ({user}) => {
        return <TouchableOpacity key={user.email} onPress={()=> navigation.navigate('SendCode', {user: user})}>
                <TextUILIB textColor text60 marginV-16 marginL-16>Selecciona a tua conta</TextUILIB>
                <ViewUILIB bg-bgColor style={styles.item}>
                  <View style={styles.section}>
                    <Image style={{width: 60, height: 60, borderRadius: 30}} source= {{uri: user.photo_path}} />
                    <TextUILIB style={{maxWidth: '80%', alignSelf: 'center'}} textColor text70 marginL-5>{user.first_name + ' ' + user.last_name}</TextUILIB>
                  </View>
                </ViewUILIB>
              </TouchableOpacity>
    }
    return (
      <ScrollView style={styles.container}>
        {account.map((user)=> <Item key={user.email} user={user}/>)}
      </ScrollView>
    )
}

export const SendCode = ({route, navigation})=> {
    const {user} = route.params;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({email: null});
    const { showDialog, setShowDialog } = useContext(CartContext);

    const UserPhoto =  useCallback(()=> {
        return (
            <Avatar 
                source={user.photo_path ? {uri: user.photo_path} : preview} 
                size={150} 
                animate={false} 
            />
        )
    }, [user.photo_path]);

    const sendCode = async()=> {
        setLoading(true);
        try {
            let response = await fetch(API_URL + 'mbora/send/code/reset/password',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify({email: user.email}),
            });
            let rjd = await response.json();
            if(rjd.success) {
                navigation.navigate('ConfirmationAccount', {email: user.email});
            } else {
                if (rjd.message == 'Erro de validação') {
                    if (rjd.data.message.email != undefined) {
                        setError({email: rjd.data.message.email});
                    }
                } else {
                    setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'})
                }
            }
        } catch (error) {
            setLoading(false);
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
        }
    }

    return (
            <ViewUILIB bg-bgColor flex padding-16 centerH>
                {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
                <UserPhoto/>
                <TextUILIB textColor marginT-8 text70 style={{fontWeight: 'bold'}}>{user.first_name + ' ' + user.last_name}</TextUILIB>
                <TextUILIB textColor marginT-8 text80>Escolhe uma forma para iniciar sessão.</TextUILIB>
                <ViewUILIB marginB-100 style={styles.item}>
                    <TextUILIB textColor text80 color='gray' center>{user.email}</TextUILIB>
                </ViewUILIB>
                <ButtonSubmit onPress={()=> sendCode().then(()=> setLoading(false))} loading={loading} textButtonLoading='A ENVIAR...' textButton='ENVIAR CÓDIGO POR E-MAIL'/>
            </ViewUILIB> 
    )
}

export const ConfirmationAccount = ({route, navigation})=> {
    const {email} = route.params;
    const [code, setCode] = useState("");
    const [error, setError] = useState({code: null});
    const [loading, setLoading] = useState({codeCheck: false, sendCode: false});
    const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

    const codeCheck = async()=> {
        setLoading({codeCheck: true});
        try {
            let response = await fetch(API_URL + 'mbora/code/check/reset',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify({code: code}),
            });
            let rjd = await response.json();
            if(rjd.success) {
                navigation.navigate('CreateNewPassword', {email: email})            
            } else {
                if (rjd.message == 'Erro de validação') {
                    if (rjd.data.message.code != undefined) {
                        setError({code: rjd.data.message.code});
                    }
                } else if (rjd.message == 'Código expirado') {
                    setError({code: rjd.data.message});
                } else {
                    setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'})
                }
            }
        } catch (error) {
            setLoading({codeCheck: false});
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
        }
    }

    const sendCode = async()=> {
        setLoading({sendCode: true});
        try {
            let response = await fetch(API_URL + 'mbora/send/code/reset/password',
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify({email: email}),
            });
            let rjd = await response.json();
            if(rjd.success) {
                setVisibleToast({visible: true, message: rjd.message, backgroundColor: 'green'});
            } else {
                if (rjd.message == 'Erro de validação') {
                    if (rjd.data.message.email != undefined) {
                        setError({email: rjd.data.message.email});
                    }
                } else {
                    setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'})
                }
            }
        } catch (error) {
            setLoading({sendCode: false});
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
        }
    }

    return (
            <ViewUILIB bg-bgColor flex padding-16>
                <ToastMessage/> 
                {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
                <TextUILIB textColor text60>Confirma a tua conta</TextUILIB>
                <TextUILIB textColor marginV-8 text80>
                    Enviámos um código para o seu e-mail: {email}.{'\n'}
                    Insere esse código para confirmar a tua conta.
                </TextUILIB>
                <TextInput
                    autoFocus
                    keyboardType='phone-pad'
                    onChangeText={text => setCode(text) }
                    value={code}
                    placeholder="Insere o código"
                    placeholderTextColor='gray'
                    style={[styles.input, {marginTop: 8}]}/>
                <ErroMessage touched={true} errors={error.code} />
                <ButtonSubmit onPress={()=> isEmpty(code) ? setError({code: 'Insere o código'})  : (isInteger(Number(code)) ? codeCheck().then(()=> setLoading({codeCheck: false})) : setError({code: 'Código inserido não é válido.'})) } loading={loading.codeCheck} textButtonLoading='CONFIRMANDO...' textButton='CONFIRMAR'/>
                {loading.sendCode ?
                    <TextUILIB marginT-5 textColor text70BO center>Reenviando...</TextUILIB> :
                    <TextUILIB marginT-5 onPress={()=> sendCode().then(()=> setLoading({sendCode: false}))} textColor text70BO center>Reenviar código</TextUILIB>}
            </ViewUILIB> 
    )
}

export const CreateNewPassword = ({route, navigation})=> {
    
    let comfirmPasswordInput = null;
    const initialValues = { 
        password: null,
        password_confirmation: null,
    }

    const {email} = route.params;
    const [error, setError] = useState(initialValues);
    const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

    const resetPassword = async (value)=> {
        try {
            let response = await fetch(API_URL + 'mbora/reset/password',
            {
                method: 'PUT',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(value)
            });
    
            let rjd = await response.json();
            if(rjd.success) {
                setVisibleToast({visible: true, message: rjd.message, backgroundColor: 'green'});
                navigation.navigate('SignInForm');
            } else {
                if (rjd.message == 'Erro de validação') {
                    if (rjd.data.message.password != undefined) {
                        setError({password: rjd.data.message.password});
                    }
                } else {
                    setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'})
                }
            }
        } catch (error) {
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
        }
    }

    const backAction = ()=> {
        Alert.alert(
            'Cancelar a recuperação da conta?',
            'Tens certeza de que queres cancelar a recuperação de conta? Esta acção vai descartar as informações que inseriste até agora.',
            [
                {text: 'Sim, cancelar', style: 'destructive', onPress: ()=> navigation.goBack()},
                {text: 'Não, voltar', style: 'cancel', onPress: ()=> {}},
            ]
        )
    }

    React.useEffect(()=> {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => backAction()}>
                    <TextUILIB style={{color: 'orangered', fontWeight: 'bold'}}>CANCELAR</TextUILIB>
                </TouchableOpacity>
            ),
        })
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, [navigation]);

    return (
            <ViewUILIB bg-bgColor flex padding-16>
                {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
                <TextUILIB textColor text60>Criar uma palavra - passe nova</TextUILIB>
                <TextUILIB textColor marginV-8 text80>
                    Criar uma palavra - passe com, pelo menos 8 caracteres.{'\n'}
                    Vais precisar desta palavra - passe para iniciar sessão na tua conta.
                </TextUILIB>
                <Formik
                    initialValues={{password: '', password_confirmation: ''}}
                    validationSchema={Yup.object({
                        password: Yup.string()
                            .min(8, 'A nova palavra - passe tem que ter no mínimo 8 caracteres')
                            .required('Digite a nova palavra - passe'),
                        password_confirmation: Yup.string()
                            .oneOf([Yup.ref('password')], 'Não coincide com a nova palavra - passe')
                            .required('Confirme a nova palavra - passe'),
                    })}
                    onSubmit={(values, formikActions) => {
                        setTimeout(() => {
                            resetPassword({...values, ...{email: email}}).then(()=> formikActions.setSubmitting(false));
                        }, 500);
                    }}>
                    {props => (
                    <>
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
                        />
                        <ErroMessage touched={props.touched.password} errors={props.errors.password} />
                        <ErroMessage touched={true} errors={error.password} />
                        <TextInput
                            keyboardType='visible-password'
                            onChangeText={props.handleChange('password_confirmation' )}
                            onBlur={props.handleBlur('password_confirmation')}
                            value={props.values.password_confirmation}
                            placeholder="Confirmar nova palavra - passe"
                            placeholderTextColor='gray'
                            style={styles.input}
                            secureTextEntry={true}
                            ref={el => comfirmPasswordInput = el}
                        />
                        <ErroMessage touched={props.touched.password_confirmation} errors={props.errors.password_confirmation} />
                        <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='GUARDANDO...' textButton='GUARDAR'/>
                    </>
                )}
                </Formik>
            </ViewUILIB> 
    )
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
    marginBottom: 10
  },
  item: {
    marginRight: 16,
    marginLeft: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }
});
