import React, {useState, useEffect} from 'react';
import Maps from './Maps';
import { isNull } from 'lodash';
import { AntDesign } from "@expo/vector-icons";
import { Button as ButtonUILIB } from 'react-native-ui-lib';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';


const ModalMaps = (props) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [coordinate, setCoordinate] = useState({latlng: {latitude: 0, longitude: 0}, locationGeocode: {}});

  const containsLatLng = props?.clientCoordinate && props.isDetailsEncomenda;
  const clientCoordinate = containsLatLng ? JSON.parse(props.clientCoordinate) : coordinate;
  const notContainsLocation = (clientCoordinate.latlng.latitude == 0) && (clientCoordinate.latlng.longitude == 0);

  useEffect(() => {
    props.setCoordinate({coorLoc: coordinate});
  }, [coordinate])
  
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
        }}>
        <Maps clientName={props.clientName} coordinate={coordinate} setCoordinate={setCoordinate} actionMap={0} companyName={props.companyName} companyCoordinate={props.companyCoordinate}/>
        <Pressable style={styles.centeredView} onPress={()=> setModalVisible(false)}>
            <View style={styles.modalView}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(false)}>
                    <AntDesign name='closecircle' size={30} color='white' onPress={() => setModalVisible(false)}/>
                </Pressable>
            </View>
        </Pressable> 
      </Modal>
      {props.isDetailsEncomenda &&
      (notContainsLocation ? <Text style={{fontSize: 10, padding: 10, color: 'gray'}}>Sem localização</Text>:
      <ButtonUILIB
        disabled={props.isSubmitting}
        backgroundColor='orange'
        style={[styles.button]}
        onPress={() => {
          setCoordinate(clientCoordinate)
          setModalVisible(true);
        }}>
          <Text style={styles.textStyle}>Ver Localização</Text>
      </ButtonUILIB>)}
      {!props.isDetailsEncomenda &&
      <ButtonUILIB
        disabled={props.isSubmitting}
        backgroundColor='orange'
        style={[styles.button]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>{coordinate.latlng.latitude == 0 ? 'Adicionar Localização' : 'Alterar Localização'}</Text>
      </ButtonUILIB>}
      {(coordinate.latlng.latitude != 0) &&
      <ButtonUILIB
        disabled={props.isSubmitting}
        backgroundColor='green'
        style={[styles.button]}
        onPress={() => {
            let str = "", locationData = {};
            locationData = {...coordinate['latlng'], ...coordinate['locationGeocode']};
            Object.keys(locationData).forEach(k => {
                if  (!isNull(locationData[k]))  {
                    str += k + ": " + locationData[k] + "\n";
                }
            });
            Alert.alert('Localização', str);
        }}>
          <Text style={styles.textStyle}>Dados de Localização</Text>
      </ButtonUILIB>}
      {((coordinate.latlng.latitude != 0) && !props.isDetailsEncomenda) &&
      <ButtonUILIB
        disabled={props.isSubmitting}
        backgroundColor='red'
        style={[styles.button]}
        onPress={() => setCoordinate({latlng: {latitude: 0, longitude: 0}, locationGeocode: {}})}>
        <Text style={styles.textStyle}>Remover Localização</Text>
      </ButtonUILIB>}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin:10
  },
  buttonClose: {
    backgroundColor: 'orangered',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
});

export default ModalMaps;