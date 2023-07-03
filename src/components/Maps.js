import React, { useState, useEffect, Fragment } from 'react';
import { isEmpty } from 'lodash';
import * as Location from 'expo-location';
import { RadioButton, RadioGroup } from 'react-native-ui-lib';
import MapView, { Marker, Callout, UrlTile, Polyline } from 'react-native-maps';
import { StyleSheet, View, Image, Alert, Text, Pressable, ScrollView, Linking } from 'react-native';
// import MapViewDirections from 'react-native-maps-directions';

export default function Maps(props) {

let mapView = null;

const [drag, setDrag] = useState(false);
const [region, setRegion] = useState(null);
const [location, setLocation] = useState(null);
const [errorMsg, setErrorMsg] = useState(null);
const [mapType, setMapType] = useState('standard');
const [coordinate, setCoordinate] = useState({latitude: 0, longitude: 0})

    useEffect(() => {
    (async () => {
        try {
            if(props.coordinate.latlng.latitude == 0 && props.coordinate.latlng.longitude == 0) {
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
            } else {
                animateRegionAndMarker(props.coordinate.latlng, true);
            }
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

    const animateRegionAndMarker = async (latlng, moveMarker)=> {
        mapView.animateToRegion(regionContainingPoints([latlng]), 1000);
        let lctGc = await getLocationGeocode(latlng);
        setTimeout(() => {
            if(moveMarker) {
                setCoordinate(latlng);
                props.setCoordinate({latlng: latlng, locationGeocode: lctGc[0]});
            }
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
            loadingEnabled={true} // Indicador de carregamento do mapa
            onDoublePress={(e)=> animateRegionAndMarker(e.nativeEvent.coordinate, true)}
            >
            {/* Usar este componente oculta o componente Polyline
            <UrlTile
                urlTemplate={"http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                maximumZ={19}
                flipY={false}
            /> */}
            {props.isEditCompanyCoordinate ? 
            <ClientOrCompanyMarker id={0} draggable={true} dataClientOrCompany={{name: props.companyName, coordinate: coordinate, title: 'Empresa ®'}} drag={drag} setDrag={setDrag} animateRegionAndMarker={animateRegionAndMarker}/>:
            <Fragment>
                <ClientOrCompanyMarker id={0} draggable={!props.isDetails} dataClientOrCompany={{name: props.clientName, coordinate: coordinate, title: 'Cliente Mbora ©'}} drag={drag} setDrag={setDrag} animateRegionAndMarker={animateRegionAndMarker}/>
                {props.companyName == null ? 
                    props.companyNameAndCoordinate.map((c) => (
                    (c.companyCoordinate.latlng.latitude != 0) &&
                        <Fragment key={c.id}>
                            <ClientOrCompanyMarker id={c.id + 1} dataClientOrCompany={{name: c.companyName, coordinate: c.companyCoordinate.latlng, title: 'Empresa ®'}} drag={drag} setDrag={setDrag} animateRegionAndMarker={animateRegionAndMarker}/>
                            <Polyline
                                coordinates={[coordinate, c.companyCoordinate.latlng]}
                                fillColor="#16b4f7"
                                strokeColor={"#000"}
                                strokeWidth={5}
                                lineCap='round'
                            />
                        </Fragment>
                    ))
                : 
                (props.companyCoordinate.latlng.latitude != 0) &&
                <Fragment>
                    <ClientOrCompanyMarker id={1} dataClientOrCompany={{name: props.companyName, coordinate: props.companyCoordinate.latlng, title: 'Empresa ®'}} drag={drag} setDrag={setDrag} animateRegionAndMarker={animateRegionAndMarker}/>
                    <Polyline
                        coordinates={[coordinate, props.companyCoordinate.latlng]}
                        fillColor="#16b4f7"
                        strokeColor={"#000"}
                        strokeWidth={5}
                        lineCap='round'
                    />
                </Fragment>}
            </Fragment>}
        </MapView>
        <View style={{position: "absolute", bottom: 50, backgroundColor: 'white'}}>
        <RadioGroup padding-10 initialValue='standard' onValueChange={value => setMapType(value)}>
            <RadioButton size={20} marginB-10 color='orange' value='standard' label='Padrão' labelStyle={{color: 'orange'}}/>
            <RadioButton size={20} marginB-10 color='green' value='sattelite' label='Satélite' labelStyle={{color: 'green'}}/>
            <RadioButton size={20} marginB-10 color='blue' value='hybrid' label='Híbrido' labelStyle={{color: 'blue'}}/>
            <RadioButton size={20} color='black' value='terrain' label='Terreno' labelStyle={{color: 'black'}}/>
        </RadioGroup>
            {/* 
            <Text style={styles.text}>{JSON.stringify(coordinate, null, 3)}</Text>
            <Text style={styles.text}>{JSON.stringify(props.companyCoordinate.latlng, null, 3)}</Text>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.text}>{JSON.stringify(region, null, 3)}</Text>
        */}
        </View>
        {!props.isEditCompanyCoordinate &&
         <Fragment>
            <View style={styles.viewStyleButtom}>
                <Pressable style={[styles.button, {backgroundColor: 'green'}]} onPress={() => animateRegionAndMarker(coordinate, true)}>
                    <Text style={[styles.text, {color: 'white'}]}>{props.clientName}</Text>
                </Pressable>
                {props.companyName == null ? 
                <ScrollView horizontal={true}>
                    {props.companyNameAndCoordinate.map((c) => (
                        (c.companyCoordinate.latlng.latitude != 0) &&
                        <Fragment key={c.id}>
                            <Pressable style={[styles.button, {backgroundColor: 'orange'}]} onPress={() => animateRegionAndMarker(c.companyCoordinate.latlng, false)}>
                                <Text style={[styles.text, {color: 'white'}]}>{c.companyName}</Text>
                            </Pressable>
                        </Fragment>
                    ))}
                </ScrollView>
                :
                (props.companyCoordinate.latlng.latitude != 0) &&
                <Pressable style={[styles.button, {backgroundColor: 'orange'}]} onPress={() => animateRegionAndMarker(props.companyCoordinate.latlng, false)}>
                    <Text style={[styles.text, {color: 'white'}]}>{props.companyName}</Text>
                </Pressable>}
            </View>
            {(props.isDetails && (props.companyCoordinate.latlng.latitude != 0)) && 
            <View style={styles.viewGoogleMaps}>
                <Pressable style={[styles.googleMaps]} onPress={() => Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + props.companyCoordinate.latlng.latitude + '%2C' + props.companyCoordinate.latlng.longitude + '&destination=' + coordinate.latitude + '%2C' + coordinate.longitude)}>
                    <Text style={[styles.text, {color: 'white'}]}>Google Maps</Text>
                </Pressable>
            </View>}
        </Fragment>}
    </View>
  );
}

const ClientOrCompanyMarker = ({id, draggable = false, dataClientOrCompany, drag, setDrag, animateRegionAndMarker}) => {
    return (
        <Marker
            key={id}
            draggable={id == 0 && draggable}
            title='Localizaçõa actual'
            description='Pressione o marcador e arraste para a localização onde irá receber o produto.'
            coordinate={dataClientOrCompany.coordinate}
            onDragStart={()=> setDrag(true)}
            onDragEnd={(e) => { 
                setDrag(false);
                animateRegionAndMarker(e.nativeEvent.coordinate, id == 0);
            }}>
                {drag ? <Text style={{color: 'green'}}>Arrastando...</Text>:
                <Text style={[styles.textMarker, {color: id == 0 ? 'green' : 'rgb(255, 140, 0)'}]}>{dataClientOrCompany.title}</Text>}
                <Text style={{color: 'black'}}>{dataClientOrCompany.name}</Text>
                <Image source={require('../../assets/icon-location-client-mbora.png')} style={{height: 50, width:50, resizeMode:"contain" }} />
                <Callout tooltip={true} style={{
                        width: 200,
                        backgroundColor: 'orange',
                        padding: 5,
                        zIndex: 10
                    }}>
                    <Text style={{color: 'green', fontWeight: 'bold'}}>Dica:</Text>
                    {id == 0 ? <Text style={{color: 'white'}}>Click ou arraste o marcador em uma região para marcar a localização onde irá receber o produto.</Text>
                    :<Text style={{color: 'white'}}>Empresa vendedora.</Text>}
                </Callout>
        </Marker>
    )
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
},
viewStyleButtom: {
    position: "absolute", 
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},
button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin:10
},
viewGoogleMaps: {
    position: "absolute", 
    top: 50,
},
googleMaps: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin:10,
    backgroundColor: 'black'
},
textMarker: {
    backgroundColor: 'white'
}
});