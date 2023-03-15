import React, { useState, useEffect } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Image, Alert, Text } from 'react-native';
import * as Location from 'expo-location';
import { isEmpty } from 'lodash';
import { RadioButton, RadioGroup } from 'react-native-ui-lib';

export default function Maps(props) {

let mapView = null;

const [mapType, setMapType] = useState('standard');
const [coordinate, setCoordinate] = useState({latitude: 0, longitude: 0})
const [region, setRegion] = useState(null);
const [location, setLocation] = useState(null);
const [errorMsg, setErrorMsg] = useState(null);
const [drag, setDrag] = useState(false);

    useEffect(() => {
    (async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            let locationGeocode = await Location.reverseGeocodeAsync({latitude: location.coords.latitude, longitude: location.coords.longitude, altitude: location.coords.altitude, accuracy: location.coords.accuracy});
            setLocation(locationGeocode);
            setCoordinate({latitude: location.coords.latitude, longitude: location.coords.longitude});
            props.setCoordinate({latlng: {latitude: location.coords.latitude, longitude: location.coords.longitude}, locationGeocode: locationGeocode[0]});
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    })();

    }, []);

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (!isEmpty(location)) {
        text = JSON.stringify(location, null, 2);
    }

    const getLocationGeocode = async (latlng)=> {
        return await Location.reverseGeocodeAsync(latlng);
    }

    const onRegionChange = (region) => {
        setRegion(region);
    }

    const animateRegionAndMarker = async (latlng)=> {
        let lctGc = await getLocationGeocode(latlng);
        mapView.animateToRegion(regionContainingPoints([latlng]), 1000);
        setTimeout(() => {
            setCoordinate(latlng);
            props.setCoordinate({latlng: latlng, locationGeocode: lctGc[0]});
        }, 1000);
    }

  return (
    <View style={styles.container}>
        <MapView style={styles.map}
            ref={mv => mapView = mv} // Para animar
            provider='google' //Android & IOS: usar somente o mapa do Google
            mapType={mapType}
            region={regionContainingPoints([coordinate])} //Ltd, Lgd, LtdD, LgdD
            // onRegionChangeComplete={onRegionChange} // chamado uma vez quando a região é alterada, como quando o usuário termina de mover o mapa.
            zoomControlEnabled // Only: Android
            showsUserLocation // Mostrar a localização do usuário no mapa
            showsMyLocationButton // Button para mover o mapa até a localização do usuário
            showsCompass // Mostarr bússola
            showsIndoors // Mapa interno
            loadingEnabled // Indicador de carregamento do mapa
            onPress={(e)=> animateRegionAndMarker(e.nativeEvent.coordinate)}
            >
            <Marker
                key={1}
                draggable
                title='Localizaçõa actual'
                description='Pressione o marcador e arraste para a localização onde irá receber o produto.'
                coordinate={coordinate}
                onDragStart={()=> setDrag(true)}
                onDragEnd={(e) => { 
                    setDrag(false);
                    animateRegionAndMarker(e.nativeEvent.coordinate);
                }}>
                    {drag ? <Text style={{color: 'green', fontSize: 10}}>Arrastando...🚶‍♂️</Text>:
                    <Text style={{color: 'green', fontSize: 10, fontWeight: 'bold'}}>Cliente Mbora 🙋‍♂️</Text>}
                    <Text style={{color: 'orange', fontWeight: 'bold'}}>António Teca</Text>
                    <Image source={require('../../assets/icon-location-client-mbora.png')} style={{height: 50, width:50, resizeMode:"contain" }} />
                    <Callout tooltip={true} style={{
                            width: 200,
                            backgroundColor: 'orange',
                            padding: 5,
                            zIndex: 10
                        }}>
                        <Text style={{color: 'green', fontWeight: 'bold'}}>Dica:</Text>
                        <Text style={{color: 'white'}}>Click ou arraste o marcador em uma região para marcar a localização onde irá receber o produto.</Text>
                    </Callout>
            </Marker>
        </MapView>
        <View style={{position: "absolute", bottom: 50, backgroundColor: 'white'}}>
        <RadioGroup padding-10 initialValue='standard' onValueChange={value => setMapType(value)}>
            <RadioButton size={20} marginB-10 color='orange' value='standard' label='Padrão' labelStyle={{color: 'orange'}}/>
            <RadioButton size={20} marginB-10 color='green' value='sattelite' label='Satélite' labelStyle={{color: 'green'}}/>
            <RadioButton size={20} marginB-10 color='blue' value='hybrid' label='Híbrido' labelStyle={{color: 'blue'}}/>
            <RadioButton size={20} color='black' value='terrain' label='Terreno' labelStyle={{color: 'black'}}/>
        </RadioGroup>
            {/*<Text style={styles.text}>{text}</Text>
            <Text style={styles.text}>{JSON.stringify(coordinate, null, 3)}</Text>
            <Text style={styles.text}>{JSON.stringify(region, null, 3)}</Text>*/}
        </View>
    </View>
  );
}

const regionContainingPoints = points => {
    let minLat, maxLat, minLng, maxLng;
  
    // Maneira Longa
    // (point => {
    //   minLat = point.latitude;
    //   maxLat = point.latitude;
    //   minLng = point.longitude;
    //   maxLng = point.longitude;
    // })(points[0]);
  
    // points.forEach(point => {
    //   minLat = Math.min(minLat, point.latitude);
    //   maxLat = Math.max(maxLat, point.latitude);
    //   minLng = Math.min(minLng, point.longitude);
    //   maxLng = Math.max(maxLng, point.longitude);
    // });

    // Maneira Simples
    minLat = Math.min(... points.map(p => p.latitude));
    maxLat = Math.max(... points.map(p => p.latitude));
    minLng = Math.min(... points.map(p => p.longitude));
    maxLng = Math.max(... points.map(p => p.longitude));

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
  
    const deltaLat = (maxLat - minLat);
    const deltaLng = (maxLng - minLng);
  
    return {
       latitude: midLat, longitude: midLng,
       latitudeDelta: deltaLat, longitudeDelta: deltaLng,
    };
}

const styles = StyleSheet.create({   
container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: 'black',
    textAlign: 'left',
    fontSize: 10
  }
});