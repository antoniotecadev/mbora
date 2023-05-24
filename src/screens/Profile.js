import AsyncStorage from '@react-native-async-storage/async-storage';
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
import CompanyFollowers from '../components/CompanyFollowers';
import * as Constants from 'expo-constants';
import {Image as ImageCache, CacheManager} from 'react-native-expo-image-cache';


const { width } = Dimensions.get('window');
const API_URL = Constants.default.manifest.extra.API_URL;
const preview = {uri: "data:image/png;base64,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"};

export default function Profile({ route, navigation }) {
    const cameraIcon = require('../../assets/icons-profile-camera-100.png');
    const [encomendas, setEncomendas] = useState([]);
    const [produts, setProduts] = useState([]);
    const [refreshingFavorito, setRefreshingFavorito] = useState(false);
    const [refreshingEncomenda, setRefreshingEncomenda] = useState(false);
    const [lastVisible, setLastVisible] = useState({encomenda: 0, favorito: 0});
    const [emptyEncomenda, setEmptyEncomenda] = useState(false); 
    const [emptyFavorito, setEmptyFavorito] = useState(false);
    const [viewHeader, setViewHeader] = useState(true);
    const [viewFullPhoto, setViewFullPhoto] = useState(false)
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [numberEncomenda, setNumberEncomenda] = useState("-");
    const [numberFavorito, setNumberFavorito] = useState("-");
    const [numberEmpresaAseguir, setNumberEmpresaAseguir] = useState("-");

    const { nav } = useServices();
    const {ui, user} = useStores();
    const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

    let color = getAppearenceColor(ui.appearanceName);

    const fetchEncomendas = useCallback(async (isMoreView) => {
        try {
            let response =  await fetch(API_URL + 'encomendas/mbora/lastVisible/' + lastVisible.encomenda + '/isMoreView/' + isMoreView,
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
            } else  if (!isEmpty(rjd.encomenda)) {
                setEmptyEncomenda(false);
                if (isMoreView) {
                    pagination(rjd.encomenda, true);
                    setEncomendas((prevState) => [...prevState, ...rjd.encomenda]);
                    if(lastVisible.encomenda == rjd.idEncomendaPaginacao){
                        setEmptyEncomenda(true);
                    }  
                } else {
                    setNumberEncomenda(rjd.numeroEncomenda);
                    setNumberEmpresaAseguir(rjd.numeroEmpresasAseguir);
                    pagination(rjd.encomenda, true);
                    setEncomendas(rjd.encomenda);
                    if(rjd.numeroEncomenda <= 10){
                        setEmptyEncomenda(true);
                    } 
                }
            } else {
                setEmptyEncomenda(true);
            }
        } catch (error) {
            setRefreshingEncomenda(false);
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

    const fetchFavoritos = useCallback(async(isMoreView)=> {
        try {
            let response =  await fetch(API_URL + 'produtos/favorito/mbora/lastVisible/' + lastVisible.favorito + '/isMoreView/' + isMoreView,
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
            } else  if (!isEmpty(rjd.favorito)) {
                setEmptyFavorito(false);
                if (isMoreView) {
                    pagination(rjd.favorito, false);
                    setProduts((prevState) => [...prevState, ...rjd.favorito]);
                    if(lastVisible.favorito == rjd.idFavoritoPaginacao){
                        setEmptyFavorito(true);
                    } 
                } else {
                    setNumberFavorito(rjd.numeroFavorito)
                    pagination(rjd.favorito, false);
                    setProduts(rjd.favorito);
                    if(rjd.numeroFavorito <= 10){
                        setEmptyFavorito(true);
                    } 
                }
            } else {
                setEmptyFavorito(true);
            }
        } catch (error) {
            setRefreshingFavorito(false);
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, [lastVisible.favorito]);

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
        switch (index) {
            case 0:
                setRefreshingEncomenda(true);
                fetchEncomendas(false).then(()=> setRefreshingEncomenda(false));
                break;
                case 1:
                setRefreshingFavorito(true);
                fetchFavoritos(false).then(()=> setRefreshingFavorito(false));
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
            let response =  await fetch(API_URL + 'mbora/profilephoto/user/url',
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

    const Badge = () => (
        <View style={[styles.badge, {borderWidth: 1.5, borderColor: color}]}>
            <AntDesign name="camera" size={24} color="black" onPress={()=> pickImage()} />
        </View>
    );

    const UserPhoto = useCallback(({setViewFullPhoto})=> {
        return (
            <View style={styles.containerPhoto}>
                <TouchableOpacity onPress={()=> setViewFullPhoto(true)}>
                    <ImageCache style={styles.image} {...{preview, uri: image}}/>
                </TouchableOpacity>
                <Badge />
            </View>
             /* Sem cache 
             <Avatar 
                onPress={()=> setViewFullPhoto(true)}
                source={image ? {uri: image} : preview} 
                size={150} 
                animate={false} 
                badgePosition={'BOTTOM_RIGHT'} 
                badgeProps={{icon: cameraIcon, size: 30, borderWidth: 1.5, borderColor: color, onPress:()=> pickImage()}} /> */
        )
    }, [image])

    const ViewFullPhoto = useCallback(({photoURI, setViewFullPhoto})=> {
        return (
            <TouchableOpacity style={styles.fullphoto} onPress={()=> setViewFullPhoto(false)}>
                <ImageCache style={styles.fullphoto} {...{preview, uri: photoURI}} />
                {/* Sem cache <Image source={{ uri: photoURI }} style={styles.fullphoto}/> */}
                <Feather name='minimize-2' size={30} color='orange' style={{alignSelf: 'center', bottom: 40}} />
            </TouchableOpacity>
        )
    }, [image]);

    const NumberInformation = useCallback(()=> {
        return (
            <View style={styles.section}>
                <Numeros text='Encomendas' numero={numberEncomenda}/>
                <Numeros text='Favoritos' numero={numberFavorito}/>
                <Numeros text='A seguir' numero={numberEmpresaAseguir}/>
            </View>
        )
    }, [numberEncomenda, numberFavorito, numberEmpresaAseguir])

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
        setRefreshingEncomenda(true);
        fetchEncomendas(false).then(()=> setRefreshingEncomenda(false));
        setRefreshingFavorito(true);
        fetchFavoritos(false).then(()=> setRefreshingFavorito(false));
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

    useEffect(() => {
        if (route.params?.id || route.params?.isFavorito) {
          setProduts((prevProduct) => {
              return prevProduct.map((product) => {
                if(product.id == route.params.id) {
                  product.isFavorito = route.params.isFavorito;
                }
                return product;
              });
          });
        }
    }, [route.params?.id, route.params?.isFavorito]);
    
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
                <NumberInformation/>
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
                        <Encomenda fetchEncomendas={fetchEncomendas} encomendas={encomendas} onRefresh={()=> onRefresh(0)} refreshing={refreshingEncomenda} empty={emptyEncomenda}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={1} lazy>
                        <Favoritos nav={nav} appearanceColor={color} fetchFavoritos={fetchFavoritos} userTelephone={user.userTelephone} produts={produts} onRefresh={onRefresh} refreshing={refreshingFavorito} empty={emptyFavorito}/>
                    </TabController.TabPage>
                    <TabController.TabPage index={2} lazy>
                        <CompanyFollowers route={route} navigation={navigation} user={user} API_URL={API_URL} setNumberEmpresaAseguir={setNumberEmpresaAseguir}/>
                    </TabController.TabPage>
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

const Favoritos = ({ nav, appearanceColor, fetchFavoritos, userTelephone, produts, onRefresh, refreshing, empty })=> {

    const [loading, setLoading] = useState(false);
    const { setShowDialog, setVisibleToast } = useContext(CartContext);

    const showProductDetails = (product)=> {
        nav.show('ProductDetails', {
          produto: product,
          userTelephone: userTelephone,
          screenBack: 'Profile',
          isProfileCompany: false
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
              let response = await fetch(API_URL + 'eliminar/produto/mbora/favorito',
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
        return <Product appearanceColor={appearanceColor} isFavorite={true} removeFavorite={()=> removeProductFavorite()} produto={product} key={product.id} userTelephone={userTelephone} onPress={()=> showProductDetails(product)}/>
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
            ListFooterComponent={refreshing ? <ActivityIndicator style={styles.emptyListStyle} color={'orange'} animating={refreshing}/> : !empty && <FooterComponent loading={loading} setLoading={setLoading} fetchFavoritos={fetchFavoritos}/>}
            ListEmptyComponent={!refreshing && <Text style={[styles.emptyListStyle, {color: 'gray'}]}>Sem favoritos</Text>}
            refreshControl={<RefreshControl colors={['orange']} refreshing={refreshing} onRefresh={()=> onRefresh(1)}/>} />
        )
}

const FooterComponent = (props) => {
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
    },
      containerPhoto: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
      image: { 
        height: 150, 
        width: 150, 
        borderRadius: 100 
    },
    badge: {
        position: 'absolute',
        backgroundColor: 'lightgray',
        borderRadius: 25,
        padding: 8,
        bottom: 0,
        right: 0,
        margin: 8,
      },
});
