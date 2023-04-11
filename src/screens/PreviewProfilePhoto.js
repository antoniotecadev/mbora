import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function PreviewProfilePhoto({route, navigation}){
    const { imageUri } = route.params;
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    useEffect(()=> {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{padding: 10}} onPress={() => alert()}>
                    <Text style={{color: 'orange'}}>Guardar</Text>
                </TouchableOpacity>
            ),
        });
    }, []);

    return (
        <View style={styles.container}>
            <Image source={{ uri: image ? image :  imageUri}} style={styles.image} /> 
            <TouchableOpacity style={styles.button} onPress={()=> pickImage()}>
                <Text style={styles.buttonText} >Seleccionar foto de perfil</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    image: {
        width: 200, 
        height: 200, 
        marginTop: 10, 
        borderRadius: 100, 
        borderColor: 'orange', 
        borderWidth: 5, 
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 8, 
        borderRadius: 5, 
        backgroundColor: 'orange',
    },
    buttonText: {
        color: 'white', 
        textAlign: 'center', 
        fontWeight: 'bold'
    }
});
