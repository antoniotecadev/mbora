import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useCallback, useContext } from 'react';
import { StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { Avatar, Text, Button, TabController, View } from 'react-native-ui-lib';
import { CartContext } from '../CartContext';
import { Product } from '../components/Product';
import ToastMessage from '../components/ToastMessage';
import { useServices } from '../services';

const perfilImage = require('../../assets/products/car-101.jpg');

export default function Perfil({ route }) {

    const [produts, setProduts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const getProducts = useCallback(async ()=> {
        let keys = [];
        try {
            keys = await AsyncStorage.getAllKeys();
            keys.map(async (key)=> {
                let jsonValue = await AsyncStorage.getItem(key);
                let value =  jsonValue != null ? JSON.parse(jsonValue) : null;
                if(value.id != null) {
                    setProduts((prevState) => [...prevState, ...[value]]);
                }
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    }, [produts]);

    const onRefresh = async ()=> {
        setRefreshing(true);
        setProduts([]);
        getProducts();
        setRefreshing(false);
    }

    const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
    
    return (
        <>
            <View style={styles.infoContainer}>
                <Avatar source={preview} size={100} animate={true} />
                <Text color='grey' marginH-6 text80BO>António Teca</Text>
            </View>
            <Button
                text90
                marginH-14
                marginB-8
                label="Editar perfil"
                size={Button.sizes.large}
                borderRadius={5}
                style={{ backgroundColor: 'green' }}
                />
                <TabController onChangeIndex={(index)=> index == 1 ? getProducts() : setProduts([])} items={[{ label: 'Encomendas' }, { label: 'Favoritos' }, { label: 'A seguir' }]}>
                <TabController.TabBar 
                    enableShadows 
                    indicatorStyle={{backgroundColor: 'orange', height: 3}} 
                    labelColor={'green'}
                    selectedLabelColor={'orange'}/>
                <View flex>
                    <TabController.TabPage index={0}>
                        <Text>Chilala</Text>
                    </TabController.TabPage>
                    <TabController.TabPage index={1} lazy>
                        <Favoritos produts={produts} onRefresh={onRefresh} refreshing={refreshing}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={2} lazy><Text>llllll</Text></TabController.TabPage>
                </View>
            </TabController>
        </>
    );
}

const Favoritos = ({produts, onRefresh, refreshing})=> {

    const { nav } = useServices();
    const { setVisibleToast } = useContext(CartContext);

    
    const showProductDetails = (product)=> {
        nav.show('ProductDetails', {
          produto: product,
        });
    }

    const removeFavorite = useCallback(async (product)=> {
        try {     
            await AsyncStorage.removeItem('p-' +  product.id);
            onRefresh();
            setVisibleToast({visible: true, message: product.nome + ' removido dos favoritos.', backgroundColor: 'red'});
        } catch (error) {
            setVisibleToast({visible: true, message: error.message, backgroundColor: 'red'});
        }    
    }, []);

    const keyExtractor = (item)=> item.id;

    const renderItemProduct = useCallback(({ item: product }) => { 
        return <Product isFavorite={true} removeFavorite={()=> removeFavorite(product)} produto={product} key={product.id} onPress={()=> showProductDetails(product)}/>
    }, []);

    return(
        <>
            <ToastMessage />
            <FlatList
                columnWrapperStyle={{
                justifyContent: "space-between",
                }}
                numColumns={2}
                contentContainerStyle={styles.productsListContainer}
                keyExtractor={keyExtractor}
                renderItem={renderItemProduct}
                data={produts}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.emptyListStyle}>Sem produtos favoritos</Text>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} />
        </>
        )
}

const styles = StyleSheet.create({
    infoContainer: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    productsListContainer: {
        paddingVertical: 8,
        marginHorizontal: 8,
    },
    emptyListStyle: {
        color: 'gray',
        paddingTop: 150,
        textAlign: 'center',
    }
});
