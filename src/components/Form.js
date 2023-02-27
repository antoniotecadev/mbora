import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';

export const ButtonSubmit = ({ onPress, loading, textButtonLoading, textButton}) => {
    return (
        <TouchableOpacity
          onPress={onPress}
          disabled={loading}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{loading ? textButtonLoading: textButton}</Text>
          {loading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
    );
  }

export const FormHeader = ({ title }) =>{
  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.viewIcon}>
              <Image style={styles.icon} source={require('../../assets/icon.png')}/>
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.title}>{title}</Text>
    </>
  )
} 

export const ErroMessage = ({ touched, errors })=> {
  return (
    <>
     {touched && errors ? (<Text style={styles.error}>{errors}</Text>) : null}
    </>
  )
} 

  const styles = StyleSheet.create({
    loadMoreBtn: {
      width: '100%',
      height: 45,
      marginVertical: 8,
      backgroundColor: 'green',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    title: {
      marginBottom: 24,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'orange'
    },
    viewIcon: {
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginVertical: 16
    },
    icon: {
      width: 60, 
      height: 80, 
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4, 
    },
    error: {
      margin: 8,
      fontSize: 14,
      color: 'red',
    }
  });