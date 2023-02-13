import React, { useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import { Card, Text, View, Button, Colors, TextField } from 'react-native-ui-lib';
import { CartContext } from '../CartContext';
import { currency } from '../utils/utilitario';

const cardImage = require('../../assets/products/feijao1.jpg');
const removeIcon = require('../../assets/icons/excluir.png');
const iconButton = { round: true, iconStyle: { tintColor: Colors.white } };

export function Carrinho({ navigation }) {
    
    const { items, getTotalPrice, getItemsCount, quantity, removeItemToCart } = useContext(CartContext);

    const renderItem = ({ item }) => {
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
                        {JSON.stringify(items.index)}
                    </Text>
                    <Text text70 $textDefault>
                        {item.product.nome}
                    </Text>
                    <Text text80 $textDefault green10 marginB-4>
                        {currency(String(item.product.preco))}
                    </Text>
                    <Text $textDefault text90>{item.product.empresa}</Text>
                    <Text text100 grey40 marginB-8>
                        {`${item.product.nomeProvincia}, ${item.product.district} , ${item.product.street}`}
                    </Text>
                    <Count qtd={item.qty} id={item.product.id} quantity={quantity} removeItemToCart={removeItemToCart} />
                </View>
            </Card>
        );
    }

    return (
        <FlatList
            style={styles.itemsList}
            contentContainerStyle={styles.itemsListContainer}
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id}
            ListFooterComponent={<Totals price={getTotalPrice()} totalQty={getItemsCount()} distincQty={items.length}/>}
        />
    );
}

const Count = ({ qtd, id, quantity, removeItemToCart }) => {

    return <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }}>
        <Button
            borderRadius={5}
            size={'small'}
            backgroundColor={Colors.grey40}
            label='-'
            onPress={() => parseInt(qtd) <= 1 ? null: quantity(id, {isSum: false})}/>
        <TextInput
            width={30}
            keyboardType='numeric'
            value={String(qtd)}
            maxLength={2}  //setting limit of input
            textAlign='center'/>
        <Button
            borderRadius={5}
            size={'small'}
            backgroundColor={Colors.grey40}
            label='+'
            onPress={() => quantity(id, {isSum: true})}
        />
        <Button
            marginL-80
            size={'small'}
            backgroundColor={Colors.red20}
            iconSource={removeIcon}
            {...iconButton} 
            onPress={() => removeItemToCart(id)} />
    </View>
}

const Totals = ({ price, totalQty, distincQty })=> {
    return (
        <>
            <View style={styles.cartLineTotal}>
                <Text style={[styles.lineLeft]}>Quantidade Distinta</Text>
                <Text style={styles.lineRight}>{String(distincQty)}</Text>
            </View>
            <View style={styles.cartLineTotal}>
                <Text style={[styles.lineLeft]}>Quantidade Total</Text>
                <Text style={styles.lineRight}>{String(totalQty)}</Text>
            </View>
            <View style={styles.cartLineTotal}>
                <Text style={[styles.lineLeft]}>Total</Text>
                <Text style={styles.lineRight}>{currency(String(price))}</Text>
            </View>
            <Button
                borderRadius={5}
                size={'large'}
                backgroundColor ='green'
                label='Encomendar' />
        </>
    );
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
    lineLeft: {
        fontSize: 18,
        lineHeight: 40,
        color: '#333333'
    },
    lineRight: {
        flex: 1,
        fontSize: 18,
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
