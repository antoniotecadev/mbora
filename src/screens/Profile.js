import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteItemAsync } from 'expo-secure-store';
import { isEmpty } from 'lodash';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl, Text, Image, TouchableOpacity, View, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { Avatar, TabController, Text as TextUILIB } from 'react-native-ui-lib';
import { CartContext } from '../CartContext';
import { AlertDialog } from '../components/AlertDialog';
import Encomenda from '../components/Encomenda';
import { Product } from '../components/Product';
import ToastMessage from '../components/ToastMessage';
import { useServices } from '../services';
import { useStores } from '../stores';
import { getAppearenceColor, getValueItemAsync, numberFollowersAndViewsFormat } from '../utils/utilitario';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
export default function Profile({ route, navigation }) {
    const cameraIcon = require('../../assets/icons-profile-camera-100.png');
    const [encomendas, setEncomendas] = useState([]);
    const [produts, setProduts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [lastVisible, setLastVisible] = useState({encomenda: 0, favorito: 0});
    const [empty, setEmpty] = useState({encomenda: false, favorito: false});
    const [viewHeader, setViewHeader] = useState(true);
    const [viewFullPhoto, setViewFullPhoto] = useState(false)
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [countEncomenda, setCountEncomenda] = useState("-");
    const [countFavorito, setCountFavorito] = useState("-");

    const { nav } = useServices();
    const {ui, user} = useStores();
    const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

    let color = getAppearenceColor(ui.appearanceName);

    const fetchEncomendas = useCallback(async (isMoreView) => {
        try {
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/encomendas/mbora/lastVisible/' + lastVisible.encomenda + '/isMoreView/' + isMoreView,
            {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                }
            });
            let rjd = await response.json();
            if  (!rjd.success && rjd.message == 'Autenticação') {
                setShowDialog({visible: true, title: rjd.message, message: rjd.data.message, color: 'orange'});
                await deleteItemAsync('token');
                user.setAuth(false);
            } else  if (!isEmpty(rjd)) {
                setEmpty({encomenda: false});
                if (isMoreView) {
                    pagination(rjd, true);
                    setEncomendas((prevState) => [...prevState, ...rjd]);
                } else {
                    pagination(rjd, true);
                    setEncomendas(rjd);
                }
            } else {
                setEmpty({encomenda: true});
            }
        } catch (error) {
            setRefreshing(false);
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, [lastVisible.encomenda]);

    function pagination(rjd, isEncomenda) {
        // Usar Math.max quando a ordem for CRESCENTE
        if(isEncomenda) {
            setLastVisible({encomenda: Math.min(... rjd.map(e => e.id))});
        } else {
            setLastVisible({favorito: Math.min(... rjd.map(e => e.idFavorito))});
        }
    }

    const getCountEncomenda = useCallback(async()=> {
        try {
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/encomendas/mbora/count',
            {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                }
            });
            let rjd = await response.json();
            setCountEncomenda(rjd);
        } catch (error) {
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, []);

    const fetchFavoritos = useCallback(async(isMoreView)=> {
        try {
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/produtos/favorito/mbora/lastVisible/' + lastVisible.favorito + '/isMoreView/' + isMoreView,
            {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                }
            });
            let rjd = await response.json();
            if  (!rjd.success && rjd.message == 'Autenticação') {
                setShowDialog({visible: true, title: rjd.message, message: rjd.data.message, color: 'orange'});
                await deleteItemAsync('token');
                user.setAuth(false);
            } else  if (!isEmpty(rjd)) {
                setEmpty({favorito: false});
                if (isMoreView) {
                    pagination(rjd, false);
                    setProduts((prevState) => [...prevState, ...rjd]);
                } else {
                    pagination(rjd, false);
                    setProduts(rjd);
                }
            } else {
                setEmpty({favorito: true});
            }
        } catch (error) {
            setRefreshing(false);
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, [lastVisible.favorito]);

    const getCountFavorito = useCallback(async()=> {
        try {
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/mbora/count/favorito',
            {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                }
            });
            let rjd = await response.json();
            setCountFavorito(rjd);
        } catch (error) {
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, []);

    //CONSULTAR PRODUTOS DE FAVORITOS LOCALMENTE
    // const getProducts = useCallback(async ()=> {
    //     let keys = [], produtcs = [];
    //     try {
    //         keys = await AsyncStorage.getAllKeys();
    //         keys.reverse();
    //         keys.map(async (key)=> {
    //             let jsonValue = await AsyncStorage.getItem(key);
    //             let value =  jsonValue != null ? JSON.parse(jsonValue) : null;
    //             if(value.id != null) {
    //                 produtcs.push(value);
    //             }
    //         });
    //         const regExpLiteral = /p-/gi;
    //         setTimeout(() => {
    //             setRefreshing(false);
    //             setProduts(produtcs);
    //             setCountFavorito(produtcs.length);
    //         }, String(keys).match(regExpLiteral).length * 1000);
    //     } catch (error) {
    //         setRefreshing(false);
    //         setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
    //     }
    // }, [produts]);

    const onRefresh = async (index)=> {
        setRefreshing(true);
        switch (index) {
            case 0:
                fetchEncomendas(false).then(()=> setRefreshing(false));
                getCountEncomenda();
                break;
            case 1:
                fetchFavoritos(false).then(()=> setRefreshing(false));
                getCountFavorito();
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
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                break;
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.2,
        });
        
        if (!result.canceled) {
            nav.show('PreviewProfilePhoto', {imageUri: result.assets[0].uri, userId: userId});
        }
    };

    const getURLProfilePhoto = async()=> {
        try {
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/mbora/profilephoto/user/url',
            {
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                }
            });
            let rjd = await response.json();
            setImage(rjd.photo_url);
            setUserId(rjd.user_id); // Este id será usado nome da foto de perfil, para evitir ter mais de duma foto de usuario no firebase storage
        } catch (error) {
            setShowDialog({visible: true, title: 'Erro Foto de Perfil', message: error.message, color: 'orangered'});
        }
    };

    const UserPhoto = useCallback(({setViewFullPhoto})=> {
        return (
            <Avatar 
                onPress={()=> setViewFullPhoto(true)}
                source={image ? {uri: image} : preview} 
                size={150} 
                animate={true} 
                badgePosition={'BOTTOM_RIGHT'} 
                badgeProps={{icon: cameraIcon, size: 30, borderWidth: 1.5, borderColor: color, onPress:()=> pickImage()}} />
        )
    }, [image])

    const CountInfo = useCallback(()=> {
        return (
            <View style={styles.section}>
                <Numeros text='Encomendas' numero={countEncomenda}/>
                <Numeros text='Favoritos' numero={countFavorito}/>
                <Numeros text='A seguir' numero={32}/>
            </View>
        )
    }, [countEncomenda, countFavorito])

    const Buttons = useCallback(()=> {
        return (
                <>
                    <TouchableOpacity style={styles.buttonEditProfile} onPress={()=> nav.show('ProfileEdit')}>
                        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}} >Editar perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.touchableOpacityStyle, {position: 'absolute', bottom: 10}]} onPress={()=> setViewHeader(false)}>
                        <AntDesign name='up' size={20} color='green'/>
                    </TouchableOpacity>
                </>
        )
    }, [])

    useEffect(() => {
        getURLProfilePhoto();
        getCountEncomenda();
        getCountFavorito();
        setRefreshing(true);
        fetchEncomendas(false).then(()=> setRefreshing(false));
        fetchFavoritos(false).then(()=> setRefreshing(false));
    }, []);

    useEffect(() => {
        if (route.params?.photoURL) {
            setImage(route.params.photoURL);
            setVisibleToast({visible: true, message: 'Foto de perfil alterada', backgroundColor: 'green'});
        }
    }, [route.params?.photoURL]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: viewHeader
        });
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: viewHeader ? "flex" : "none"
            }
        });
    }, [viewHeader]);
    
    const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
    
    return (
        <SafeAreaView style={{flex: 1}}>
            <ToastMessage />
            {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
            {viewFullPhoto ? <ViewFullPhoto photoURI={image} setViewFullPhoto={setViewFullPhoto} /> :
            <View style={styles.infoContainer}>
            {viewHeader ?
            <>
                <UserPhoto setViewFullPhoto={setViewFullPhoto}/>
                <TextUILIB textColor marginT-8 text70>{user.userFirstName + ' ' + user.userLastName}</TextUILIB>
                <CountInfo/>
                <Buttons/>
            </> :
                <TouchableOpacity style={styles.touchableOpacityStyle} onPress={()=> setViewHeader(true)}>
                    <AntDesign name='down' size={20} color='green'/>
                </TouchableOpacity>}
            </View>}
            <TabController asCarousel={true} initialIndex={0} onChangeIndex={(index)=> onChangeIndex(index)} items={[{ label: 'Encomendas' }, { label: 'Favoritos' }, { label: 'A seguir' }]}>
                <TabController.TabBar
                    backgroundColor={color} 
                    indicatorStyle={{backgroundColor: 'orange', height: 3}} 
                    labelColor={'green'}
                    selectedLabelColor={'orange'}/>
                <TabController.PageCarousel>
                    <TabController.TabPage index={0}>
                        <Encomenda appearanceName={color} fetchEncomendas={fetchEncomendas} encomendas={encomendas} onRefresh={onRefresh} refreshing={refreshing} empty={empty.encomenda}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={1} lazy>
                        <Favoritos nav={nav} appearanceName={color} fetchFavoritos={fetchFavoritos} userTelephone={user.userTelephone} produts={produts} onRefresh={onRefresh} refreshing={refreshing} empty={empty.favorito}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={2} lazy><Text>llllll</Text></TabController.TabPage>
                </TabController.PageCarousel>
            </TabController>
        </SafeAreaView>
    );
}

const Numeros = ({text, numero}) => {
    return <TouchableOpacity style={styles.count}>
                <TextUILIB textColor style={{ fontSize: 12, fontWeight: 'bold' }}>{numberFollowersAndViewsFormat(numero, 'youtube')}</TextUILIB>
                <TextUILIB textColor color='gray' style={{ fontSize: 12 }}>{text}</TextUILIB>
            </TouchableOpacity>
}

const Favoritos = ({ nav, appearanceName, fetchFavoritos, userTelephone, produts, onRefresh, refreshing, empty })=> {

    const [loading, setLoading] = useState(false);
    const { setShowDialog, setVisibleToast } = useContext(CartContext);

    const showProductDetails = (product)=> {
        nav.show('ProductDetails', {
          produto: product,
          userTelephone: userTelephone
        });
    }

    // REMOVER PRODUTO DOS FAVORITOS LOCALMENTE
    // const removeProductFavorite = useCallback(async (product)=> {
    //     try {     
    //         await AsyncStorage.removeItem('p-' +  product.id);
    //         onRefresh(1);
    //         setVisibleToast({visible: true, message: product.nome + ' removido dos favoritos.', backgroundColor: 'red'});
    //     } catch (error) {
    //         setVisibleToast({visible: true, message: error.message, backgroundColor: 'red'});
    //     }    
    // }, []);

    const keyExtractor = (item)=> item.id;

    const renderItemProduct = useCallback(({ item: product }) => { 
        
        const removeProductFavorite = async()=> { 
            try {
              let response = await fetch('http://192.168.18.3/mborasystem-admin/public/api/eliminar/produto/mbora/favorito',
              {
                method: 'DELETE',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                },
                body: JSON.stringify({ id_products_mbora: product.id })
              });
              let rjd = await response.json();
              if(rjd.success) {
                onRefresh(1);
                setVisibleToast({visible: true, message: product.nome + ' removido dos favoritos.', backgroundColor: 'red'});
              } else {
                if (rjd.message == 'Erro de validação') {
                  setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message.id_products_mbora, color: 'orangered'});
                } else {
                  setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'});
                }      
              }
            } catch (error) {
              setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});     
            }
        }
        return <Product appearanceName={appearanceName} isFavorite={true} removeFavorite={()=> removeProductFavorite()} produto={product} key={product.id} userTelephone={userTelephone} onPress={()=> showProductDetails(product)}/>
    }, []);

    return(
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
            ListFooterComponent={empty || refreshing ? null : <FooterComponente loading={loading} setLoading={setLoading} fetchFavoritos={fetchFavoritos}/>}
            ListEmptyComponent={<Text style={styles.emptyListStyle}>Sem favoritos</Text>}
            refreshControl={<RefreshControl colors={['orange']} refreshing={refreshing} onRefresh={()=> onRefresh(1)}/>} />
        )
}

const ViewFullPhoto = ({photoURI, setViewFullPhoto})=> {
    return (
        <TouchableOpacity style={styles.fullphoto} onPress={()=> setViewFullPhoto(false)}>
            <Image source={{ uri: photoURI }} style={styles.fullphoto}/>
            <Feather name='minimize-2' size={30} color='orange' style={{alignSelf: 'center', bottom: 40}} />
        </TouchableOpacity>
    )
}

const FooterComponente = (props) => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={()=> {
                props.setLoading(true);
                props.fetchFavoritos(true).then(()=> props.setLoading(false));
          }
        }
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{props.loading ? 'A carregar favoritos' : 'Mais favoritos'}</Text>
          {props.loading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
    infoContainer: {
        padding: 8,
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
        width: '30%',
        paddingVertical: 10,
        marginVertical: 8, 
        borderRadius: 5, 
        backgroundColor: 'green',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    count: { 
        alignItems: 'center', 
        margin: 8 
    },
    touchableOpacityStyle: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 10,
    },
    fullphoto : {
        width: '100%', 
        height: width,
        resizeMode: 'contain',
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      loadMoreBtn: {
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
      }
});
