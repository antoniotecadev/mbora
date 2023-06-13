import React, { useState, useContext, useEffect, useMemo } from 'react';
import { StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ButtonSubmit, ErroMessage } from '../components/Form';
import { Colors, Text as TextUILIB, ActionSheet } from 'react-native-ui-lib';
import { getAppearenceColor, getValueItemAsync } from '../utils/utilitario';
import { AlertDialog } from '../components/AlertDialog';
import { CartContext } from '../CartContext';
import { AntDesign } from "@expo/vector-icons";
import ToastMessage from '../components/ToastMessage';
import * as Constants from 'expo-constants';

export default CompanyProfileEdit = ({route, navigation})=> {

    const { first_name, last_name, company, description, email, phone, alternative_phone, province, district, street } = route.params;
    const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

    let nomeInput = null, sobrenomeInput = null, phoneInput = null, alternativephoneInput = null, provinceInput = null, districtInput = null, streetInput = null;
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const initialValues = { 
      first_name: null,
      last_name: null,
      company: null,
      description: null,
      email: null,
      phone: null,
      alternative_phone: null,
      province_name: null, 
      district: null, 
      street: null
    }

    const [show, setShow] = useState(false);
    const [valuesCompany, setValuesCompany] = useState({});
    const [error, setError] = useState(initialValues);
    const [nameProvince, setNameProvince] = useState(province);
    const [focus, setFocus] = useState({name: false, company: false, description: false, email: false, telefone: false, location: false})

    const companyUpdate = async (data, action)=> {
      try {
            let API_URL = Constants.default.manifest.extra.API_URL + 'empresa/mbora/update';
            let response = await fetch(API_URL,
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                },
                body: JSON.stringify({...data, ...{action: action}})
            });
            let rjd = await response.json();
            if(rjd.success) {
              setValuesCompany({...valuesCompany, ...data});
              setVisibleToast({visible: true, message: rjd.message, backgroundColor: 'green'});
            } else {
                if (rjd.message == 'Erro de validação') {
                    let messageError;
                    if (rjd.data.message.empresa != undefined) {
                        messageError = rjd.data.message.empresa;
                        setError({ company: messageError });
                    } else if (rjd.data.message.email != undefined) {
                        messageError = rjd.data.message.email;
                        setError({ email: messageError });
                    } else if (rjd.data.message.phone != undefined) {
                        messageError = rjd.data.message.phone;
                        setError({ phone: messageError });
                    } else if (rjd.data.message.alternative_phone != undefined) {
                        messageError = rjd.data.message.alternative_phone;
                        setError({ alternative_phone: messageError });
                    } else if (rjd.data.message.provincia_id != undefined) {
                        messageError = rjd.data.message.provincia_id;
                        setError({ province_name: messageError });
                    } else if (rjd.data.message.district != undefined) {
                        messageError = rjd.data.message.district;
                        setError({ district: messageError });
                    } else if (rjd.data.message.street != undefined) {
                        messageError = rjd.data.message.street;
                        setError({ street: messageError });
                    } 
                } else {
                    setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'})
                }
            }
        } catch (error) {
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
        }
    }

    const provincesList = useMemo(() => 
      [
        {name: 'Bengo'}, {name: 'Benguela'}, {name: 'Bié'}, {name: 'Cabinda'}, {name: 'Cuando Cubango'}, {name: 'Cunene'},
        {name: 'Huambo'}, {name: 'Huíla'}, {name: 'Kwanza Sul'}, {name: 'Kwanza Norte'}, {name: 'Luanda'}, {name: 'Lunda Norte'},
        {name: 'Lunda Sul'}, {name: 'Malanje'}, {name: 'Moxico'}, {name: 'Namibe'}, {name: 'Uíge'}, {name: 'Zaire'}
      ]
    ,[]);

    const ProvinceActionSheet = useMemo(() => {
        return <ActionSheet
                title={'Províncias'}
                cancelButtonIndex={provincesList.length}
                useNativeIOS
                options={[
                  ...provincesList.map(p => ({
                    label: p.name,
                    onPress: ()=> {
                      setNameProvince(p.name);
                    },
                  })),
                  {
                    label: 'Cancelar',
                  },
                ]}
                visible={show}
                onDismiss={() => setShow(false)}
              />
      },[show]);

    useEffect(() => {
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
    }, []);

    const backAction = () => {
      navigation.navigate({
        name: 'CompanyProfile',
        params: {valuesCompany: valuesCompany},
        merge: true,
      });
    }

    useEffect(()=> {
      navigation.setOptions({
          headerLeft: () => (
              <TouchableOpacity style={{right: 10, paddingRight: 10, paddingVertical: 10}} onPress={() => backAction()}>
                <AntDesign name='left' color={'orange'} size={24}/>
              </TouchableOpacity>
          ),
      })
    }, [valuesCompany]);

    return (
    <SafeAreaView style={styles.container}>
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      <KeyboardAvoidingView style={{ flex: 1, paddingHorizontal: 16, flexDirection: 'column', justifyContent: 'center',}}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled keyboardVerticalOffset={100}>
        <ToastMessage />
        <ScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{first_name: first_name || '', last_name: last_name || ''}}
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
                companyUpdate(values, 0).then(()=> { 
                formikActions.setSubmitting(false)
                formikActions.setValues({first_name: values.first_name, last_name: values.last_name})
            });
            }, 500);
          }}>
          {props => (
            <>
                <TextUILIB marginT-20 textColor style={{fontWeight: 'bold'}}>Nome e Sobrenome</TextUILIB>
                <TextInput
                    editable={false}
                    onFocus={()=> setFocus({name: true})}
                    onChangeText={props.handleChange('first_name')}
                    onBlur={()=> {
                        if(first_name == props.values.first_name) {
                            if(!sobrenomeInput.isFocused()) {
                                setFocus({name: false})
                            }
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
                    ref={el => nomeInput = el}
                />
                <ErroMessage touched={props.touched.first_name} errors={props.errors.first_name} />
                <ErroMessage touched={true} errors={error.first_name} />
                <TextInput
                    editable={false}
                    onFocus={()=> setFocus({name: true})}
                    onChangeText={props.handleChange('last_name')}
                    onBlur={()=> {
                        if(last_name == props.values.last_name) {
                        if(!nomeInput.isFocused()) {
                            setFocus({name: false})
                        }                    }
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
                {/* {focus.name && <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>} */}
            </>
          )}
        </Formik>
        <Formik
          initialValues={{empresa: company || ''}}
          validationSchema={Yup.object({
            empresa: Yup.string()
                .min(4, 'O nome tem que ter no mínimo 4 caracteres')
                .max(20, 'O nome tem que ter no máximo 20 caracteres')
                .required('Digite o nome da empresa'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
                companyUpdate(values, 1).then(()=> {
                formikActions.setSubmitting(false)
                formikActions.setValues({empresa: values.empresa})
              });
            }, 500);
          }}>
          {props => (
            <>
                <TextUILIB marginT-20 textColor style={{fontWeight: 'bold'}}>Empresa</TextUILIB>
                <TextInput
                    onFocus={()=> setFocus({company: true})}
                    onChangeText={props.handleChange('empresa')}
                    onBlur={()=> {
                        if(company == props.values.empresa) {
                            setFocus({company: false})
                        }
                        props.handleBlur('empresa')
                    }}
                    value={props.values.empresa}
                    placeholder="Empresa"
                    placeholderTextColor='gray'
                    style={styles.input}/>
                <ErroMessage touched={props.touched.empresa} errors={props.errors.empresa} />
                <ErroMessage touched={true} errors={error.company} />
                {focus.company && <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>}
            </>
          )}
        </Formik>
        <Formik
          initialValues={{description: description || ''}}
          validationSchema={Yup.object({
            description: Yup.string()
                .max(30, 'Tem que ter no máximo 30 caracteres')
                .required('Digite a descrição da empresa'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
                companyUpdate(values, 2).then(()=> {
                formikActions.setSubmitting(false)
                formikActions.setValues({description: values.description})
              });
            }, 500);
          }}>
          {props => (
            <>
                <TextUILIB marginT-20 textColor style={{fontWeight: 'bold'}}>Descrição</TextUILIB>
                <TextInput
                    onFocus={()=> setFocus({description: true})}
                    onChangeText={props.handleChange('description')}
                    onBlur={()=> {
                        if(description == props.values.description) {
                            setFocus({description: false})
                        }
                        props.handleBlur('description')
                    }}
                    value={props.values.description}
                    placeholder="Descrição"
                    placeholderTextColor='gray'
                    style={styles.input}/>
                <ErroMessage touched={props.touched.description} errors={props.errors.description} />
                <ErroMessage touched={true} errors={error.description} />
                {focus.description && <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>}
            </>
          )}
        </Formik>
        <Formik
          initialValues={{email: email || ''}}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Email não é válido')              
              .required('Digite o email')
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
                companyUpdate(values, 3).then(()=> {
                formikActions.setSubmitting(false)
                formikActions.setValues({email: values.email})
              });
            }, 500);
          }}>
          {props => (
            <>
                <TextUILIB marginT-20 textColor style={{fontWeight: 'bold'}}>E-mail</TextUILIB>
                <TextUILIB style={{color: 'gray', fontSize: 10}}>Usar e-mail válido para receber informações relacionada as suas actividades na Aplicação, como as encomendas dos clientes e outras.</TextUILIB>
                <TextInput
                    onFocus={()=> setFocus({email: true})}
                    keyboardType='email-address'
                    onChangeText={props.handleChange('email')}
                    onBlur={()=> {
                        if(email == props.values.email) {
                            setFocus({email: false})
                        }
                        props.handleBlur('email')
                    }}
                    value={props.values.email}
                    placeholder="E-mail"
                    placeholderTextColor='gray'
                    style={styles.input} />
                <ErroMessage touched={props.touched.email} errors={props.errors.email} />
                <ErroMessage touched={true} errors={error.email} />
                {focus.email && <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>}
            </>
          )}
        </Formik>
        <Formik
          initialValues={{phone: phone || '', alternative_phone: alternative_phone || ''}}
          validationSchema={Yup.object({
            phone: Yup.string()
                .matches(phoneRegExp, 'Número de telefone não é válido')
                .min(9,'No mínimo 9 dígitos')
                .required('Digite o número de telefone'),
            alternative_phone: Yup.string()
                .matches(phoneRegExp, 'Número de telefone não é válido')
                .min(9,'No mínimo 9 dígitos')
                .required('Digite o número de telefone'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
                companyUpdate(values, 4).then(()=> { 
                formikActions.setSubmitting(false)
                formikActions.setValues({phone: values.phone, alternative_phone: values.alternative_phone})
            });
            }, 500);
          }}>
          {props => (
            <>
                <TextUILIB marginT-20 textColor style={{fontWeight: 'bold'}}>Telefone</TextUILIB>
                <TextInput
                    keyboardType='phone-pad'
                    onFocus={()=> setFocus({telefone: true})}
                    onChangeText={props.handleChange('phone')}
                    onBlur={()=> {
                        if(phone == props.values.phone) {
                            if(!phoneInput.isFocused()) {
                                setFocus({telefone: false})
                            }
                        }
                        props.handleBlur('phone')
                    }}
                    value={props.values.phone}
                    placeholder="Telefone 1"
                    placeholderTextColor='gray'
                    style={styles.input}
                    onSubmitEditing={() => {
                        alternativephoneInput.focus()
                    }}
                    ref={el => phoneInput = el}
                />
                <ErroMessage touched={props.touched.phone} errors={props.errors.phone} />
                <ErroMessage touched={true} errors={error.phone} />
                <TextInput
                    keyboardType='phone-pad'
                    onFocus={()=> setFocus({telefone: true})}
                    onChangeText={props.handleChange('alternative_phone')}
                    onBlur={()=> {
                        if(alternative_phone == props.values.alternative_phone) {
                        if(!alternativephoneInput.isFocused()) {
                            setFocus({telefone: false})
                        }                    }
                        props.handleBlur('alternative_phone')
                    }}
                    value={props.values.alternative_phone}
                    placeholder="Telefone 2"
                    placeholderTextColor='gray'
                    style={styles.input}
                    ref={el => alternativephoneInput = el}
                />
                <ErroMessage touched={props.touched.alternative_phone} errors={props.errors.alternative_phone} />
                <ErroMessage touched={true} errors={error.alternative_phone} />
                {focus.telefone && <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>}
            </>
          )}
        </Formik>
        <Formik
          initialValues={{nomeProvincia: nameProvince || '', district: district || '', street: street || ''}}
          validationSchema={Yup.object({
            nomeProvincia: Yup.string()
                .max(20,'No máximo 20 caracteres')
                .required('Digite a província'),
            district: Yup.string()
                .max(20,'No máximo 20 caracteres')
                .required('Digite o bairro'),
            street: Yup.string()
                .max(20,'No máximo 20 caracteres')
                .required('Digite a rua'),
          })}
          onSubmit={(values, formikActions) => {
            setTimeout(() => {
              companyUpdate({...values, ...{nomeProvincia: nameProvince}}, 5).then(()=> { 
                formikActions.setSubmitting(false)
                formikActions.setValues({nomeProvincia: values.nomeProvincia, district: values.district, street: values.street})
              });
            }, 500);
          }}>
          {props => (
            <>
              <TextUILIB marginT-20 textColor style={{fontWeight: 'bold'}}>Localização da empresa</TextUILIB>
              <TextInput
                editable={false}
                onPressIn={() => setShow(true)}
                onPressOut={()=> setFocus({location: true})}
                onFocus={()=> setFocus({location: true})}
                onChangeText={props.handleChange('nomeProvincia')}
                value={nameProvince}
                placeholder="Provincia"
                placeholderTextColor='gray'
                style={styles.input}
                onSubmitEditing={() => {
                  districtInput.focus()
                }}
                ref={el => provinceInput = el}
              />
              {ProvinceActionSheet}
              <ErroMessage touched={props.touched.nomeProvincia} errors={props.errors.nomeProvincia} />
              <ErroMessage touched={true} errors={error.province_name} />
              <TextInput
                  onFocus={()=> setFocus({location: true})}
                  onChangeText={props.handleChange('district')}
                  onBlur={()=> {
                      if(district == props.values.district) {
                          if(!districtInput.isFocused()) {
                            setFocus({location: false})
                          }
                      }
                      props.handleBlur('district')
                  }}
                  value={props.values.district}
                  placeholder="Bairro"
                  placeholderTextColor='gray'
                  style={styles.input}
                  onSubmitEditing={() => {
                    streetInput.focus()
                  }}
                  ref={el => districtInput = el}
              />
              <ErroMessage touched={props.touched.district} errors={props.errors.district} />
              <ErroMessage touched={true} errors={error.district} />
              <TextInput
                  onFocus={()=> setFocus({location: true})}
                  onChangeText={props.handleChange('street')}
                  onBlur={()=> {
                      if(street == props.values.street) {
                      if(!streetInput.isFocused()) {
                          setFocus({location: false})
                      }                    }
                      props.handleBlur('street')
                  }}
                  value={props.values.street}
                  placeholder="Rua"
                  placeholderTextColor='gray'
                  style={styles.input}
                  ref={el => streetInput = el}
              />
              <ErroMessage touched={props.touched.street} errors={props.errors.street} />
              <ErroMessage touched={true} errors={error.street} />
              {focus.location && <ButtonSubmit onPress={props.handleSubmit} loading={props.isSubmitting} textButtonLoading='Guardando...' textButton='Guardar'/>}
            </>
          )}
        </Formik>
        </ScrollView>
        </KeyboardAvoidingView>
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
