import React from "react";
import { StyleSheet, ActivityIndicator, Text } from "react-native";

export default function ErrorMessage({onLoading, error, loading}) {
    return <>
        <Text style={styles.title}>{'Erro'}</Text>
        <Text style={[styles.body, styles.fontWeight]}>{error}</Text>
        <Text style={styles.body} onPress={onLoading}>Recarregar</Text> 
        {loading.pdt ? (
        <ActivityIndicator
            style={{margin: 10}} />
        ) : null}
    </>
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center', 
        marginTop: 200
    },
    body: {
        color: 'gray', 
        textAlign: 'center', 
        marginTop: 20
    },
    fontWeight: {
        fontWeight: 'bold'
    }
});