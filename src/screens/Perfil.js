import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEmpty } from 'lodash';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, TabController, View as ViewUILIB } from 'react-native-ui-lib';
import { CartContext } from '../CartContext';
import { AlertDialog } from '../components/AlertDialog';
import Encomenda from '../components/Encomenda';
import { Product } from '../components/Product';
import ToastMessage from '../components/ToastMessage';
import { useServices } from '../services';
import { useStores } from '../stores';
import { getAppearenceColor, getValueItemAsync } from '../utils/utilitario';

const perfilImage = require('../../assets/products/car-101.jpg');

export default function Perfil({ route }) {

    const [encomendas, setEncomendas] = useState([]);
    const [produts, setProduts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [lastVisible, setLastVisible] = useState(0);
    const [empty, setEmpty] = useState(false);

    const {ui} = useStores();
    const { showDialog, setShowDialog } = useContext(CartContext);

    const fetchEncomendas = useCallback(async (isMoreView) => {
        try {
            const id_users_mbora = await getValueItemAsync('user_id').catch((error)=> setShowDialog({visible: true, title: 'Identificador de usuário', message: error.message, color: 'orangered'}));
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/encomendas/mbora/' + id_users_mbora + '/lastVisible/' + lastVisible,
            {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                }
            });
            let rjd = await response.json();
            if  (!rjd.success && rjd.message == 'Autenticação') {
                setShowDialog({visible: true, title: rjd.message, message: rjd.data.message, color: 'orangered'});
            } else  if (!isEmpty(rjd)) {
                setEmpty(false);
                if (isMoreView) {
                    pagination(rjd);
                    setEncomendas((prevState) => [...prevState, ...rjd]);
                } else {
                    pagination(rjd);
                    setEncomendas(rjd);
                }
            } else {
                setEmpty(true);
            }
        } catch (error) {
            setRefreshing(false);
            setShowDialog({visible: true, title: 'Erro Encomendas', message: error.message, color: 'orangered'});
        }
    }, [lastVisible]);

    function pagination(rjd) {
        // Usar Math.max quando a ordem for CRESCENTE
        setLastVisible(Math.min(... rjd.map(e => e.id)));
    }

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

    const onRefresh = async (index)=> {
        setRefreshing(true);
        switch (index) {
            case 0:
                fetchEncomendas(false).then(()=> setRefreshing(false));
                break;
            case 1:
                setProduts([]);
                getProducts().then(()=> setRefreshing(false));
                break;
            case 2:
                break;
            default:
                break;
        }
    }

    const onChangeIndex = (index)=> {
        switch (index) {
            case 0:
                setProduts([]);
                fetchEncomendas();
                break;
            case 1:
                getProducts();
                break;
            case 2:
                setProduts([]);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        setRefreshing(true);
        fetchEncomendas(false).then(()=> setRefreshing(false));
    }, [])
    
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
            <TabController initialIndex={0} onChangeIndex={(index)=> onChangeIndex(index)} items={[{ label: 'Encomendas' }, { label: 'Favoritos' }, { label: 'A seguir' }]}>
                <TabController.TabBar 
                    backgroundColor={getAppearenceColor(ui.appearanceName)}
                    enableShadows 
                    indicatorStyle={{backgroundColor: 'orange', height: 3}} 
                    labelColor={'green'}
                    selectedLabelColor={'orange'}/>
                <ViewUILIB flex>
                    <TabController.TabPage index={0}>
                        <Encomenda appearanceName={ui.appearanceName} fetchEncomendas={fetchEncomendas} encomendas={encomendas} onRefresh={onRefresh} refreshing={refreshing} empty={empty}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={1} lazy>
                        <Favoritos appearanceName={ui.appearanceName} produts={produts} onRefresh={onRefresh} refreshing={refreshing}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={2} lazy><Text>llllll</Text></TabController.TabPage>
                </ViewUILIB>
            </TabController>
        </>
    );
}

const Favoritos = ({ appearanceName, produts, onRefresh, refreshing })=> {

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
            onRefresh(1);
            setVisibleToast({visible: true, message: product.nome + ' removido dos favoritos.', backgroundColor: 'red'});
        } catch (error) {
            setVisibleToast({visible: true, message: error.message, backgroundColor: 'red'});
        }    
    }, []);

    const keyExtractor = (item)=> item.id;

    const renderItemProduct = useCallback(({ item: product }) => { 
        return <Product appearanceName={appearanceName} isFavorite={true} removeFavorite={()=> removeFavorite(product)} produto={product} key={product.id} onPress={()=> showProductDetails(product)}/>
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=> onRefresh(1)}/>} />
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
