import React, { useState } from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { Card, Text, Button, Colors, Avatar, Typography, ExpandableSection } from 'react-native-ui-lib';

const featureIcon = require('../../assets/icons/star.png');
const shareIcon = require('../../assets/icons/share.png');
const cartIcon = require('../../assets/icons/cart.png');
const cestoIcon = require('../../assets/icons/cesto-de-compras.png');
const denunciaIcon = require('../../assets/icons/denuncia.png');

const iconButton = { round: true, iconStyle: { tintColor: Colors.white } };

export function Cantina({ name, price, image, onPress }) {

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'React Native | A framework for building native apps using React',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Card style={styles.card} center onPress={onPress}>
            <Card.Image style={styles.thumb} source={image} />
            <View maxWidth={180}>
                <View row style={styles.section}>
                    <Text $textDefault style={{ ...Typography.text90 }}>💢Maliana</Text>
                </View>
                <Text text100 grey40 marginB-8>
                    📍 Morro Bento, Prédio de Ferro{'\n'}
                    🚶‍♂️120 mil seguem esta cantina
                </Text>
                <View center>
                    <Button
                        text90
                        marginB-10
                        label="Seguir"
                        size={Button.sizes.medium}
                        borderRadius={10}
                        style={{ backgroundColor: Colors.$backgroundSuccessHeavy }}
                        iconStyle={{ tintColor: Colors.black }}
                    />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8
                    }}>
                        <Button
                            size={'small'}
                            backgroundColor={Colors.red40}
                            iconSource={denunciaIcon}
                            {...iconButton}
                            onPress={onShare} />
                        <Text text100 orange50 marginB-8>
                            Produtos: 100+
                        </Text>
                        <Button
                            size={'small'}
                            backgroundColor={Colors.green20}
                            iconSource={shareIcon}
                            {...iconButton}
                            onPress={onShare}
                        />
                    </View>
                </View>
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
    infoContainer: {
        padding: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 15,
        marginTop: 8,
        width: '100%'
    },
    icon: {
        alignSelf: 'center'
    },
});
