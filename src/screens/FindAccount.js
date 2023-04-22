import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, ErroMessage } from '../components/Form';
import { getAppearenceColor } from '../utils/utilitario';
import { Colors, Text as TextUILIB, View as ViewUILIB, Avatar } from 'react-native-ui-lib';
import { AlertDialog } from '../components/AlertDialog';
import { CartContext } from '../CartContext';

const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };

export const FindAccount = ({navigation})=> {

    const { showDialog, setShowDialog } = useContext(CartContext);

    const findAccount = async(email)=> {
        try {
            let response = await fetch('http://192.168.18.3/mborasystem-admin/public/api/mbora/find/account/user/' + email);
            let rjd = await response.json();
            navigation.navigate('ListAccount', {account: rjd});
        } catch (error) {
          setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
        }
    } 
    return (
      <SafeAreaView style={styles.container}>
        {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
        <View style={{paddingHorizontal: 16}}>
        <TextUILIB textColor text60 marginV-10>Encontra a tua conta</TextUILIB>
        <TextUILIB textColor marginB-20>Insira o seu endereço de e-mail</TextUILIB>
          <Formik
            initialValues={{email: ''}}
            validationSchema={Yup.object({
              email: Yup.string()
                  .email('Email não é válido')              
                  .required('Digite o seu email'),
            })}
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
                    placeholder="E-mail"
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
    const UserPhoto = ()=> {
        return (
            <Avatar 
                source={{uri: user.photo_path}} 
                size={150} 
                animate={true} 
            />
        )
    }

    const enviarCodigo = ()=> {

    }

    return (
            <ViewUILIB bg-bgColor flex padding-16 centerH>
                <UserPhoto/>
                <TextUILIB textColor marginT-8 text70 style={{fontWeight: 'bold'}}>{user.first_name + ' ' + user.last_name}</TextUILIB>
                <TextUILIB textColor marginT-8 text80>Escolhe uma forma para iniciar sessão.</TextUILIB>
                <ViewUILIB marginB-100 style={styles.item}>
                    <TextUILIB textColor text80 color='gray' center>{user.email}</TextUILIB>
                </ViewUILIB>
                <ButtonSubmit onPress={()=> navigation.navigate('ConfirmationAccount', {user: user})} loading={false} textButtonLoading='A ENVIAR...' textButton='ENVIAR CÓDIGO POR E-MAIL'/>
            </ViewUILIB> 
    )
}

export const ConfirmationAccount = ({route, navigation})=> {
    const {user} = route.params;
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState(0);
    return (
            <ViewUILIB bg-bgColor flex padding-16>
                <TextUILIB textColor text60>Confirma a tua conta</TextUILIB>
                <TextUILIB textColor marginV-8 text80>
                    Enviámos um código para o seu e-mail: {user.email}.{'\n'}
                    Insere esse código para confirmar a tua conta.
                </TextUILIB>
                <TextInput
                    autoFocus
                    keyboardType='numeric'
                    onChangeText={text => setCode(text) }
                    value={code}
                    placeholder="Insere o código"
                    placeholderTextColor='gray'
                    style={[styles.input, {marginTop: 8}]}/>
                <ButtonSubmit onPress={()=> navigation.navigate('CreateNewPassword')} loading={loading} textButtonLoading='CONFIRMANDO...' textButton='CONFIRMAR'/>
                <TextUILIB marginT-5 onPress={()=> alert()} textColor text70BO center>Reenviar código</TextUILIB>
            </ViewUILIB> 
    )
}

export const CreateNewPassword = ({navigation})=> {
    
    let comfirmPasswordInput = null;

    const initialValues = { 
        password: null,
        password_confirmation: null,
      }
    
      const [error, setError] = useState(initialValues);

    return (
            <ViewUILIB bg-bgColor flex padding-16>
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
                            navigation.navigate('SignInForm')
                        // userUpdate(values, 3, formikActions.resetForm).then(()=> formikActions.setSubmitting(false));
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
                        <ErroMessage touched={true} errors={error.password_confirmation} />
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
