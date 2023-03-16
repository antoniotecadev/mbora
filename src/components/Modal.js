import { isNull } from 'lodash';
import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import Maps from './Maps';

const ModalMaps = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinate, setCoordinate] = useState({latlng: {latitude: 0, longitude: 0}, locationGeocode: {}})

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
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <Maps setCoordinate={setCoordinate}/>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>OK</Text>
                </Pressable>
            </View>
        </View> 
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>{coordinate.latlng.latitude == 0 ? 'Adicionar Localização' : 'Alterar Localização'}</Text>
      </Pressable>
      {coordinate.latlng.latitude != 0 && <><Pressable
        style={[styles.button, {backgroundColor: 'green'}]}
        onPress={() => {
            let str = "", locationData = {};
            locationData = {...coordinate['latlng'], ...coordinate['locationGeocode']};
            Object.keys(locationData).forEach(k => {
                if  (!isNull(locationData[k]))  {
                    str += k + ": " + locationData[k] + "\n";
                }
            });
            Alert.alert('Localização Adicionada', str);
        }}>
            <Text style={styles.textStyle}>Ver Localização</Text>
      </Pressable>
      <Pressable
        style={[styles.button, {backgroundColor: 'red'}]}
        onPress={() => setCoordinate({latlng: {latitude: 0, longitude: 0}, locationGeocode: {}})}>
            <Text style={styles.textStyle}>Remover Localização</Text>
      </Pressable></>}
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
    alignItems: 'center',
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
  buttonOpen: {
    backgroundColor: 'orange',
  },
  buttonClose: {
    backgroundColor: 'orange',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ModalMaps;