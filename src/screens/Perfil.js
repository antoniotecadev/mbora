import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useCallback, useContext } from 'react';
import { StyleSheet, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, TabController, View as ViewUILIB } from 'react-native-ui-lib';
import { CartContext } from '../CartContext';
import { AlertDialog } from '../components/AlertDialog';
import { Product } from '../components/Product';
import ToastMessage from '../components/ToastMessage';
import { useServices } from '../services';
import { useStores } from '../stores';

const perfilImage = require('../../assets/products/car-101.jpg');

export default function Perfil({ route }) {

    const [produts, setProduts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const { showDialog, setShowDialog } = useContext(CartContext);

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
            setRefreshing(false);
            setShowDialog({visible: true, title: 'Erro Perfil', message: error.message, color: 'orangered'});
        }
    }, [produts]);

    const onRefresh = async ()=> {
        setRefreshing(true);
        setProduts([]);
        getProducts().then(()=> setRefreshing(false));
    }

    const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
    
    return (
        <>
            {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
            <View style={styles.infoContainer}>
                <Avatar source={preview} size={100} animate={false} />
                <Text style={{ color: 'gray', marginHorizontal: 6 }}>António Teca</Text>
            </View>
                <TouchableOpacity style={styles.buttonEditProfile}>
                    <Text style={{color: 'white', textAlign: 'center'}} >Editar perfil</Text>
                </TouchableOpacity>
                <TabController onChangeIndex={(index)=> index == 1 ? getProducts() : setProduts([])} items={[{ label: 'Encomendas' }, { label: 'Favoritos' }, { label: 'A seguir' }]}>
                <TabController.TabBar 
                    enableShadows 
                    indicatorStyle={{backgroundColor: 'orange', height: 3}} 
                    labelColor={'green'}
                    selectedLabelColor={'orange'}/>
                <ViewUILIB flex>
                    <TabController.TabPage index={0}>
                        <Text>Chilala</Text>
                    </TabController.TabPage>
                    <TabController.TabPage index={1} lazy>
                        <Favoritos produts={produts} onRefresh={onRefresh} refreshing={refreshing}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={2} lazy><Text>llllll</Text></TabController.TabPage>
                </ViewUILIB>
            </TabController>
        </>
    );
}

const Favoritos = ({produts, onRefresh, refreshing})=> {

    const {ui} = useStores();
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
        return <Product appearanceName={ui.appearanceName} isFavorite={true} removeFavorite={()=> removeFavorite(product)} produto={product} key={product.id} onPress={()=> showProductDetails(product)}/>
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
    },
    buttonEditProfile: {
        marginHorizontal: 14, 
        marginBottom: 8, 
        borderRadius: 5, 
        backgroundColor: 'green', 
        paddingVertical: 5
    }
});
