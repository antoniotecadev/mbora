import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Colors, Typography } from 'react-native-ui-lib';
import { useServices } from '../services';
import { numberFollowersAndViewsFormat } from '../utils/utilitario';

const cardImage = require('../../assets/products/cantina2.jpg');

export function CompanyCard(props) {

    const { nav } = useServices();
    const {empresa, followers_number, views_mbora, estado, description} = props;

    return (
        <Card style={[styles.card, {backgroundColor: props.appearanceName, shadowColor: Colors.getScheme() === 'light' ? Colors.dmBlack : 'white'}]} center onPress={() => {
            nav.show('CompanyProfile', {...props});
        }}>
            <Card.Image style={styles.thumb} source={cardImage} />
            {(estado == 1) && <Text color='white' style={styles.aseguir}>A seguir</Text>}
            <View maxWidth={180}>
                <View row style={styles.section}>
                    <Text textColor style={{ ...Typography.text90 }}>{empresa}</Text>
                </View>
                <Text marginB-8 color={Colors.grey30} style={{ fontSize: 10 }}>
                    {description}
                </Text>
                <Text marginB-8 color={Colors.grey40} style={{ fontSize: 10 }}>
                    {numberFollowersAndViewsFormat(followers_number, 'youtube')} seguidores
                </Text>
                <Text marginB-8 color={Colors.grey40} style={{ fontSize: 10 }}>
                    {numberFollowersAndViewsFormat(views_mbora, 'youtube')} visitas
                </Text>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '49%',
        borderRadius: 16,
        shadowOpacity: 0.2,
        shadowRadius: 4,
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
    aseguir: {
        fontSize: 8, 
        fontWeight: 'bold', 
        backgroundColor: 'green', 
        padding: 5, 
        position: 'absolute', 
        top: 0
    }
});
