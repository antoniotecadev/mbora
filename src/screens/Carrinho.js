import React, { useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, TextInput } from 'react-native';
import { Card, Text, View, Button, Colors, TextField } from 'react-native-ui-lib';

const cardImage = require('../../assets/products/car-101.jpg');

const shareIcon = require('../../assets/icons/excluir.png');
const iconButton = { round: true, iconStyle: { tintColor: Colors.white } };

export function Carrinho({ navigation }) {
    function Totals() {
        return (
            <>
                <View style={styles.cartLineTotal}>
                    <Text style={[styles.lineLeft, styles.lineTotal]}>Total</Text>
                    <Text style={styles.lineRight}>1500,00 kz</Text>
                </View>
                <Button
                    borderRadius={5}
                    size={'large'}
                    backgroundColor={Colors.green20}
                    label='Finalizar compra' />
            </>
        );
    }

    function renderItem({ item }) {


        return (
            <Card
                row
                marginB-8
                borderRadius={20}
                useNative
                bg-$backgroundElevated
                activeOpacity={1}
                activeScale={0.96}
            >
                <Card.Image source={cardImage} style={{ width: 100, height: '100%' }} />
                <View maxWidth={240} margin-8>
                    <Text text70 $textDefault>
                        Arroz Tio João
                    </Text>
                    <Text text70BO $textDefault>
                        1500,00 kz
                    </Text>
                    <Text text70 green40>
                        Disponível
                    </Text>
                    <Text $textDefault text90>💢Maliana</Text>
                    <Text text100 grey40 marginB-8>
                        📍 Morro Bento, Prédio de Ferro
                    </Text>
                    <Count />
                </View>
            </Card>
        );
    }

    return (
        <FlatList
            style={styles.itemsList}
            contentContainerStyle={styles.itemsListContainer}
            data={[1, 2, 3, 4, 5]}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            ListFooterComponent={Totals}
        />
    );
}

const Count = () => {

    const [qtd, setQtd] = useState(0);

    return <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
    }}>
        <Button
            borderRadius={5}
            size={'small'}
            backgroundColor={Colors.grey40}
            label='-'
            onPress={() => setQtd(parseInt(qtd) - 1)}
        />

        <TextInput
            width={30}
            keyboardType='numeric'
            value={qtd + ''}
            maxLength={2}  //setting limit of input
            textAlign='center'

        />
        <Button
            borderRadius={5}
            size={'small'}
            backgroundColor={Colors.grey40}
            label='+'
            onPress={() => setQtd(parseInt(qtd) + 1)}
        />
        <Button
            marginL-8
            size={'small'}
            backgroundColor={Colors.red40}
            iconSource={shareIcon}
            {...iconButton} />
    </View>
}

const styles = StyleSheet.create({
    cartLine: {
        flexDirection: 'row',
    },
    cartLineTotal: {
        flexDirection: 'row',
        borderTopColor: '#dddddd',
        borderTopWidth: 1
    },
    lineTotal: {
        fontWeight: 'bold',
    },
    lineLeft: {
        fontSize: 20,
        lineHeight: 40,
        color: '#333333'
    },
    lineRight: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 40,
        color: '#333333',
        textAlign: 'right',
    },
    itemsList: {
        backgroundColor: '#eeeeee',
    },
    itemsListContainer: {
        backgroundColor: '#eeeeee',
        paddingVertical: 8,
        marginHorizontal: 8,
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.$outlineDisabledHeavy,
        paddingBottom: 4
    }
});
