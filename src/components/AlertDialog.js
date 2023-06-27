import React, {useState, useCallback} from 'react';
import {StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, View} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button as ButtonUILIB, Constants, Dialog, Text as TextUILIB, View as ViewUILIB } from 'react-native-ui-lib';
import { ErroMessage } from './Form';
import { getAppearenceColor } from '../utils/utilitario';
import ModalMaps from './Modal';
import {Image as ImageCache} from 'react-native-expo-image-cache';

export const AlertDialog = ({showDialog, setShowDialog, titulo, mensagem, cor, isEncomenda = false, clientName, userTelephone = null, clientAddress = null, moreDetails = null, isDetailsEncomenda = false, clientCoordinate, clientOrcompanyPhoto = null, companyName, companyCoordinate, onPress})=> {
    let addressInput = null, informationInput = null;
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    
    const [coordinate, setCoordinate] = useState({latitude: 0, longitude: 0});
    
    const renderPannableHeader = useCallback((props) => {
      const {title} = props;
      return (
          <ViewUILIB>
            <ViewUILIB margin-15 >
              <TextUILIB text65 textColor>{title}</TextUILIB>
            </ViewUILIB>
            <ViewUILIB height={2} bg-grey70/>
          </ViewUILIB>
        )
    }, [titulo]);

    const ClientCompanyPhoto = ()=> {
      const preview = { uri: "data:image/png;base64,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" };
      return (
        <ViewUILIB center margin-15 style={styles.containerPhoto}>
          <ImageCache style={[styles.image, styles.imageShadow]} {...{preview, uri: clientOrcompanyPhoto}}/>
        </ViewUILIB>
      )
    }

    return (
    <Formik
      initialValues={{address: clientAddress || '', telephone: userTelephone || '', information: moreDetails || ''}}
      validationSchema={Yup.object({
        address: Yup.string()
            .max(50,'No máximo 50 caracteres')
            .required('Digite o seu endereço'),                            
        telephone: Yup.string()
            .matches(phoneRegExp, 'Número de telefone não é válido')
            .min(9,'No mínimo 9 dígitos')
            .required('Digite o seu número do telefone'),              
        information: Yup.string()
            .max(50,'No máximo 50 caracteres'),              
      })}
      onSubmit={(values, formikActions) => {
        setTimeout(() => {
          // formikActions.setSubmitting(false);
          onPress({...values,...coordinate});
        }, 500);
      }}>
      {props => (
        <Dialog
          panDirection='up'
          containerStyle={[styles.dialog, {backgroundColor: getAppearenceColor()}]}
          visible={showDialog}
          onDismiss={()=> isEncomenda ? setShowDialog(false) : setShowDialog({visible: false})}
          renderPannableHeader={renderPannableHeader}
          pannableHeaderProps={{title: titulo}}
          supportedOrientations={['portrait', 'landscape']}>
        <KeyboardAvoidingView style={{flexDirection: 'column', justifyContent: 'center' }}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled keyboardVerticalOffset={100}>
          <ScrollView>
          {clientOrcompanyPhoto && <ClientCompanyPhoto />}
          <TextUILIB $textDefault marginH-15 color = {cor}>{mensagem}</TextUILIB>
          {isEncomenda && 
          <>
            {props.values.information && Platform.OS === 'ios' && <TextUILIB marginB-20 marginH-15 style={{color: 'gray'}}>Informação adicional: {props.values.information}</TextUILIB>}
            <TextUILIB marginH-20 textColor>{isDetailsEncomenda ? 'Telefone de cliente' : '*Telefone'}</TextUILIB>
            <TextInput
              color={props.isSubmitting ? 'gray' : 'black'}
              editable={!props.isSubmitting && !isDetailsEncomenda}
              keyboardType='phone-pad'
              onChangeText={props.handleChange('telephone')}
              onBlur={props.handleBlur('telephone')}
              value={props.values.telephone}
              placeholder="Número de telefone"
              style={styles.input}
              onSubmitEditing={() => addressInput.focus()}/>
            <ViewUILIB marginL-12>
              <ErroMessage touched={props.touched.telephone} errors={props.errors.telephone}/>
            </ViewUILIB>
            <TextUILIB textColor marginH-20>{isDetailsEncomenda ? 'Endereço de cliente' : '*Endereço'}</TextUILIB>
            <TextInput
              color={props.isSubmitting ? 'gray' : 'black'}
              editable={!props.isSubmitting && !isDetailsEncomenda}
              onChangeText={props.handleChange('address')}
              onBlur={props.handleBlur('address')}
              value={props.values.address}
              placeholder="Bairro, Rua, N° Casa..."
              style={styles.input}
              onSubmitEditing={() => informationInput.focus()}
              ref={el => addressInput = el}
              />
            <ViewUILIB marginL-12>
              <ErroMessage touched={props.touched.address} errors={props.errors.address}/>
            </ViewUILIB>
            <TextUILIB textColor marginH-20>Localização no Mapa</TextUILIB>
            <ModalMaps clientName={clientName} clientCoordinate={clientCoordinate} setCoordinate={setCoordinate} companyName={companyName} companyCoordinate={JSON.parse(companyCoordinate)} isSubmitting={props.isSubmitting} isDetailsEncomenda={isDetailsEncomenda} />
            <TextUILIB textColor marginH-20>Informações adicionais</TextUILIB>
            <TextInput
              color={props.isSubmitting ? 'gray' : 'black'}
              editable={!props.isSubmitting && !isDetailsEncomenda}
              placeholder="Mais detalhes..."
              style={styles.input}
              onChangeText={props.handleChange('information')}
              onBlur={props.handleBlur('information')}
              value={props.values.information} 
              ref={el => informationInput = el}
              />
            <ViewUILIB marginL-12>
              <ErroMessage touched={props.touched.information} errors={props.errors.information}/>
            </ViewUILIB>
          </>}
          <ViewUILIB marginB-10 marginR-20 right>
            {isEncomenda ?
            (isDetailsEncomenda ? 
            <ButtonUILIB label={'Fechar'} backgroundColor = {'orangered'} size={ButtonUILIB.sizes.medium} onPress={()=> setShowDialog(false)}/>
            :
            <ButtonUILIB label={props.isSubmitting ? 'A encomendar...' : 'Encomendar'} backgroundColor = {cor} size={ButtonUILIB.sizes.medium} disabled={props.isSubmitting} onPress={props.handleSubmit}/>
            ):
            <ButtonUILIB label={'OK'} backgroundColor = {cor} size={ButtonUILIB.sizes.medium} onPress={()=> setShowDialog({visible: false})}/>}
          </ViewUILIB>
          </ScrollView>
          </KeyboardAvoidingView>
      </Dialog>)}
    </Formik>
    );
}

const styles = StyleSheet.create({
    dialog: {
      marginBottom: Constants.isIphoneX ? 0 : 20,
      borderRadius: 12
    },
    input: {
      width: '90%',
      height: 50,
      backgroundColor: 'whitesmoke',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 12,
      marginHorizontal: 15,
      marginVertical: 10,
      padding: 10
    },
    containerPhoto: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    image: { 
      width: 150,
      height: 150, 
    },
    imageShadow: {
      elevation: 5, // Elevação da imagem (altere o valor conforme necessário)
      shadowColor: '#000', // Cor da sombra
      shadowOpacity: 0.5, // Opacidade da sombra
      shadowRadius: 5, // Raio da sombra
      shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra (opcional)
    },
});