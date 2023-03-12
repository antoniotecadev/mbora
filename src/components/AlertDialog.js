import React from 'react';
import {StyleSheet, TextInput, ScrollView} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button as ButtonUILIB, Constants, Dialog, Text as TextUILIB, View as ViewUILIB, Colors } from 'react-native-ui-lib';
import { ErroMessage } from './Form';
import { getAppearenceColor } from '../utils/utilitario';

export const AlertDialog = ({showDialog, setShowDialog, titulo, mensagem, cor, isEncomenda = false, onPress})=> {

    let addressInput = null, informationInput = null;
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const renderPannableHeader = props => {
        const {title} = props;
        return (
          <ViewUILIB>
            <ViewUILIB margin-15 >
              <TextUILIB text65 textColor>{title}</TextUILIB>
            </ViewUILIB>
            <ViewUILIB height={2} bg-grey70/>
          </ViewUILIB>
        )
    }

    return (
    <Formik
      initialValues={{address: '', telephone: '', information: '' }}
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
          onPress(values);
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
          <ScrollView>
          <TextUILIB $textDefault margin-15 color = {cor}>{mensagem}</TextUILIB>
          {isEncomenda && 
          <>
            <TextUILIB marginH-20 textColor>*Telefone</TextUILIB>
            <TextInput
              editable={!props.isSubmitting}
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
            <TextUILIB textColor marginH-20>*Endereço</TextUILIB>
            <TextInput
              editable={!props.isSubmitting}
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
            <TextUILIB textColor marginH-20>Informações adicionais</TextUILIB>
            <TextInput
              editable={!props.isSubmitting}
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
            <ButtonUILIB label={props.isSubmitting ? 'A encomendar...' : 'Encomendar'} backgroundColor = {cor} size={ButtonUILIB.sizes.medium} disabled={props.isSubmitting} onPress={props.handleSubmit}/>
            :
            <ButtonUILIB label={'OK'} backgroundColor = {cor} size={ButtonUILIB.sizes.medium} onPress={()=> setShowDialog({visible: false})}/>}
          </ViewUILIB>
          </ScrollView>
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
});