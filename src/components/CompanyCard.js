import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Colors, Typography } from 'react-native-ui-lib';
import { useServices } from '../services';

const cardImage = require('../../assets/products/cantina2.jpg');

export function CompanyCard(props) {

    const { nav } = useServices();
    const {empresa, nomeProvincia, district, street} = props;

    return (
        <Card style={styles.card} center onPress={() => {
            nav.show('CompanyProfile');
        }}>
            <Card.Image style={styles.thumb} source={cardImage} />
            <View maxWidth={180}>
                <View row style={styles.section}>
                    <Text $textDefault style={{ ...Typography.text90 }}>{empresa}</Text>
                </View>
                <Text marginV-8 color={Colors.grey30} style={{ fontSize: 10 }}>
                    {`${nomeProvincia}, ${district} , ${street}`}
                </Text>
                <Text marginB-8 color={Colors.grey40} style={{ fontSize: 10 }}>
                    120 mil seguidores
                </Text>
                <Text marginB-8 color={Colors.grey40} style={{ fontSize: 10 }}>
                    +12 Visitas
                </Text>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '49%',
        backgroundColor: 'white',
        shadowOpacity: 0.2,
        shadowColor: 'black',
        shadowOffset: {
            height: 0,
            width: 0,
        },
        elevation: 1,
        marginVertical: 5,
    },
    thumb: {
        height: 210,
        width: '100%',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 15,
        marginTop: 8,
        width: '100%'
    },
});
