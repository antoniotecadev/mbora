import React, { useContext } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, Text, View } from 'react-native';
import { Card, Colors, Typography, Text as TextUILIB } from 'react-native-ui-lib';
import { CartContext } from '../CartContext';
import ToastMessage from '../components/ToastMessage';
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
                style={styles.card}
                activeScale={0.96}>
                <Card.Image source={cardImage} style={{ width: 100, height: '100%' }} />
                <View style={{maxWidth: '100%', margin: 8 }}>
                    <TextUILIB textColor>
                        {item.product.nome}
                    </TextUILIB>
                    <Text style={{color: Colors.green10, marginBottom: 4}}>
                        {currency(String(item.product.preco))}
                    </Text>
                    <TextUILIB textColor style={{...Typography.text90}}>{item.product.empresa}</TextUILIB>
                    <Text style={{color: Colors.grey40, marginBottom: 8, fontSize: 10}}>
                        {`${item.product.nomeProvincia}, ${item.product.district} , ${item.product.street}`}
                    </Text>
                    <Footer qtd={item.qty} id={item.product.id} quantity={quantity} removeItemToCart={removeItemToCart} nomeProduto={item.product.nome} />
                </View>
            </Card>
        );
    }

    return (
        <View>
            <ToastMessage />
            <FlatList
                style={styles.itemsList}
                contentContainerStyle={styles.itemsListContainer}
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id}
                ListEmptyComponent={<Text style={styles.emptyListStyle}>Carrinho vazio</Text>}
                ListFooterComponent={items.length == 0 ? null : <Totals price={getTotalPrice()} totalQty={getItemsCount()} distincQty={items.length} removeItemToCart={removeItemToCart}/>}
            />
        </View>
    );
}

const Footer = ({ qtd, id, quantity, removeItemToCart, nomeProduto }) => {

    return <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }}>
        <TouchableOpacity style={styles.buttonQuantity} onPress={() => parseInt(qtd) <= 1 ? null: quantity(id, {isSum: false})}>
            <Text style={{color: 'white'}}>-</Text>
        </TouchableOpacity>

        <TextInput
            width={30}
            keyboardType='numeric'
            value={String(qtd)}
            maxLength={2}  //setting limit of input
            textAlign='center'
            color={Colors.getScheme() == 'light' ? Colors.dmBlack : 'white'}/>

        <TouchableOpacity style={styles.buttonQuantity} onPress={() => quantity(id, {isSum: true})}>
            <Text style={{color: 'white'}}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ left: 50, backgroundColor: Colors.red20, paddingHorizontal:10, paddingVertical:4, borderRadius: 20}} onPress={() => removeItemToCart(id, nomeProduto + ' removido.', 'red', {isAll: false})}>
            <Text style={{color: 'white'}}>x</Text>
        </TouchableOpacity>
    </View>
}

const Totals = ({ price, totalQty, distincQty, removeItemToCart})=> {
    return (
        <>
            <TouchableOpacity onPress={()=> removeItemToCart(null, 'Produtos removidos.', 'red', {isAll: true})} style={{backgroundColor: 'orange', borderRadius: 5, paddingVertical: 10, marginBottom: 5}}>
                <Text style={{color: 'white', textAlign: 'center'}}>Remover todos os produtos do carrinho</Text>
            </TouchableOpacity>
            <View style={styles.cartLineTotal}>
                <TextUILIB textColor style={[styles.lineLeft]}>Quantidade Distinta</TextUILIB>
                <TextUILIB textColor style={styles.lineRight}>{String(distincQty)}</TextUILIB>
            </View>
            <View style={styles.cartLineTotal}>
                <TextUILIB textColor style={[styles.lineLeft]}>Quantidade Total</TextUILIB>
                <TextUILIB textColor style={styles.lineRight}>{String(totalQty)}</TextUILIB>
            </View>
            <View style={styles.cartLineTotal}>
                <TextUILIB textColor style={[styles.lineLeft]}>Total</TextUILIB>
                <TextUILIB textColor style={styles.lineRight}>{currency(String(price))}</TextUILIB>
            </View>
            <TouchableOpacity style={{backgroundColor: 'green', borderRadius: 5, paddingVertical: 10}}>
                <Text style={{color: 'white', textAlign: 'center'}}>Encomendar</Text>
            </TouchableOpacity>
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
        fontSize: 14,
        lineHeight: 40,
    },
    lineRight: {
        flex: 1,
        fontSize: 14,
        lineHeight: 40,
        textAlign: 'right',
    },
    itemsList: {
        backgroundColor: Colors.getScheme() == 'light' ? '#eeeeee' : 'black',
    },
    itemsListContainer: {
        paddingVertical: 8,
        marginHorizontal: 8,
    },
    withUnderline: {
        borderBottomWidth: 1,
        borderColor: Colors.$outlineDisabledHeavy,
        paddingBottom: 4
    },
    emptyListStyle: {
        color: 'gray',
        paddingTop: 250,
        textAlign: 'center',
    },
    buttonQuantity: {
        backgroundColor: Colors.grey40, 
        borderRadius: 5, 
        paddingHorizontal: 25, 
        paddingVertical: 5
    },
    card: {
        backgroundColor: Colors.getScheme() == 'light' ? 'white' : Colors.dmBlack,
        shadowColor: Colors.getScheme() == 'light' ? Colors.dmBlack : 'white',
    }
});
