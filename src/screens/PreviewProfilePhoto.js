import React, { useState, useEffect, useContext, useRef } from "react";
import { Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Animated } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import app from "../services/firebase";
import { CartContext } from "../CartContext";
import { AlertDialog } from "../components/AlertDialog";
import { getValueItemAsync } from "../utils/utilitario";
import { View as ViewUILIB, Text as TextUILIB } from "react-native-ui-lib";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const { width, height } = Dimensions.get('window');

export default function PreviewProfilePhoto({route, navigation}) {
    const cameraIcon = require('../../assets/icons-profile-camera-100.png');
    const { imageUri } = route.params;
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [viewFullPhoto, setViewFullPhoto] = useState(false)
    const { showDialog, setShowDialog } = useContext(CartContext);

    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    let uri = image ? image :  imageUri;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
        });
    
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const updateProfilePhoto = async(photoURL)=> {
        try {
            let response = await fetch('http://192.168.18.3/mborasystem-admin/public/api/mbora/update/profilephoto/user',
            {
                method: 'PUT',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                },
                body: JSON.stringify({
                    photoURL: photoURL,
                }),
            });
            let rjd = await response.json();
            if(rjd.success) {
                setUploading(false);
                navigation.navigate({
                    name: 'Profile',
                    params: { photoURL: photoURL },
                    merge: true,
                });
            } else {
                setUploading(false);
                if (rjd.message == 'Erro de validação') {
                    let messageError;
                    if (rjd.data.message.photoURL != undefined){
                      messageError = rjd.data.message.photoURL;
                      setShowDialog({visible: true, title: rjd.message, message: messageError[0], color: 'orangered'});
                    }
                } else {
                  setShowDialog({visible: true, title: rjd.message, message: rjd.data.message, color: 'orangered'});
                }
            }
        } catch (error) {
            setUploading(false);
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }

    useEffect(()=> {
        const storage = getStorage(app);
        navigation.setOptions({
            headerRight: () => (
                uploading ? <ActivityIndicator color={'orange'}/> :
                <TouchableOpacity style={{padding: 10}} onPress={async() => {
                    try {
                        setUploading(true);
                        const newImage = await manipulateAsync(uri, [], {
                            compress: 0.1,
                            format: SaveFormat.JPEG
                        });
                        const metadata = { contentType: 'image/jpeg' };
                        let imageFile = await fetch(newImage.uri);
                        let imageBlob = await imageFile.blob()
                        const storageRef = ref(storage, 'usuarios/perfil/imagem/' + Date.now());
                        const uploadTask = uploadBytesResumable(storageRef, imageBlob, metadata);
                        uploadTask.on('state_changed',
                        () => {
                            setUploading(true);
                        },
                        (error) => {
                            setUploading(false);
                            setShowDialog({visible: true, title: error.code, message: error.message, color: 'orangered'});
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                updateProfilePhoto(downloadURL);
                            });
                        }
                        );
                    } catch (error) {
                        setUploading(false);
                        setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
                    }
                }}>
                    <Text style={{color: 'orange', fontWeight: 'bold'}}>Definir</Text>
                </TouchableOpacity>
            ),
        });
    }, [uploading]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }).start();
    }, [fadeAnim]);
    
    return (
        <ViewUILIB bg-bgColor style={styles.container}>
            {viewFullPhoto ? <ViewFullPhoto photoURI={uri} setViewFullPhoto={setViewFullPhoto} /> :
            <>
                {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
                <Animated.View style={{opacity: fadeAnim}}>
                    <TouchableOpacity disabled={uploading} onPress={()=> setViewFullPhoto(true)}>
                        <Image source={{ uri: uri }} style={[styles.image, {opacity: 1}]}/> 
                    </TouchableOpacity>
                </Animated.View>
                {uploading ?
                <Text style={[styles.text, {color: 'orange', marginTop: 10}]} >Definindo foto de perfil...</Text> :
                <>
                    <TouchableOpacity disabled={uploading} style={styles.button} onPress={()=> pickImage()}>
                        <Image source={cameraIcon} style={styles.cameraIcon} /> 
                    </TouchableOpacity>
                    <TextUILIB $textDefault>Seleccionar foto de perfil</TextUILIB>
                </>}
            </>}
        </ViewUILIB>
    )
}

const ViewFullPhoto = ({photoURI, setViewFullPhoto})=> {
    return (
        <TouchableOpacity style={styles.fullphoto} onPress={()=> setViewFullPhoto(false)}>
            <Image source={{ uri: photoURI }} style={styles.fullphoto}/>
            <TextUILIB style={{paddingVertical: 10, textAlign: 'center', color: 'orangered'}}>Toque a foto para voltar</TextUILIB>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: height,
        alignItems: 'center',
    },
    image: {
        width: 200, 
        height: 200, 
        marginTop: 10, 
        borderRadius: 100, 
        borderColor: 'orange', 
        borderWidth: 2, 
    },
    button: {
        padding: 5,
        marginVertical: 8, 
        borderRadius: 50, 
        backgroundColor: 'orange',
    },
    text: {
        textAlign: 'center', 
    }, 
    cameraIcon: {
        width: 30,
        height: 30,
        borderRadius: 50, 
    },
    fullphoto : {
        width: '100%', 
        height: width
    },
});
