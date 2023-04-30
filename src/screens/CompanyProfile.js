import { deleteItemAsync } from 'expo-secure-store';
import { isEmpty } from 'lodash';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl, Text, Image, TouchableOpacity, View, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { Avatar, TabController, Text as TextUILIB, View as ViewUILIB } from 'react-native-ui-lib';
import { CartContext } from '../CartContext';
import { AlertDialog } from '../components/AlertDialog';
import Encomenda from '../components/Encomenda';
import { Product } from '../components/Product';
import ToastMessage from '../components/ToastMessage';
import { useServices } from '../services';
import { useStores } from '../stores';
import { getAppearenceColor, getValueItemAsync, numberFollowersAndViewsFormat } from '../utils/utilitario';
import { AntDesign, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
export default function CompanyProfile({ route, navigation }) {
    const [encomendas, setEncomendas] = useState([]);
    const [produts, setProduts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [lastVisible, setLastVisible] = useState({encomenda: 0, produto: 0});
    const [empty, setEmpty] = useState({encomenda: false, produto: false});
    const [viewHeader, setViewHeader] = useState(true);
    const [viewDetails, setViewDetails] = useState(false);
    const [viewFullPhoto, setViewFullPhoto] = useState(false)
    const [image, setImage] = useState(null);
    const [countProduto, setCountProduto] = useState("-");
    const [countEncomenda, setCountEncomenda] = useState("-");

    const { nav } = useServices();
    const {ui, user} = useStores();
    const {empresa, imei, first_name, last_name, email, phone, alternative_phone, nomeProvincia, district, street} = route.params;
    const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

    let color = getAppearenceColor(ui.appearanceName);

    const fetchEncomendas = useCallback(async (isMoreView) => {
        try {
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/empresas/encomendas/mbora/imei/' + imei + '/lastVisible/' + lastVisible.encomenda + '/isMoreView/' + isMoreView,
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
            setLastVisible({produto: Math.min(... rjd.map(p => p.id))});
        }
    }

    const getCountEncomenda = useCallback(async()=> {
        try {
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/empresas/encomendas/mbora/count/imei/' + imei,
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

    const fecthProducts = useCallback(async(isMoreView)=> {
        try {
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/produtos/servicos/mbora/lastVisible/' + lastVisible.produto + '/isMoreView/' + isMoreView + '/imei/' + imei,
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
                setEmpty({produto: false});
                if (isMoreView) {
                    pagination(rjd, false);
                    setProduts((prevState) => [...prevState, ...rjd]);
                } else {
                    pagination(rjd, false);
                    setProduts(rjd);
                }
            } else {
                setEmpty({produto: true});
            }
        } catch (error) {
            setRefreshing(false);
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, [lastVisible.produto]);

    const getCountProduto = useCallback(async()=> {
        try {
            let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/count/produtos/servicos/mbora/imei/' + imei,
            {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                }
            });
            let rjd = await response.json();
            setCountProduto(rjd);
        } catch (error) {
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, []);

    const onRefresh = async (index)=> {
        setRefreshing(true);
        switch (index) {
            case 0:
                fecthProducts(false).then(()=> setRefreshing(false));
                getCountProduto();
                break;
              case 1:
                fetchEncomendas(false).then(()=> setRefreshing(false));
                getCountEncomenda();
                break;
            case 2:
                break;
            default:
                break;
        }
    }

    const UserPhoto = useCallback(({setViewFullPhoto})=> {
        return (
            <Avatar 
                onPress={()=> setViewFullPhoto(true)}
                source={image ? {uri: image} : preview} 
                size={150} 
                animate={true} 
             />
        )
    }, [image])

    const CountInfo = useCallback(()=> {
        return (
            <View style={styles.section}>
                <Numeros text='Prod | Serv' numero={countProduto}/>
                <Numeros text='Encomendas' numero={countEncomenda}/>
                <Numeros text='Seguidores' numero={32}/>
            </View>
        )
    }, [countEncomenda, countProduto])

    const ButtonViewDetails = useCallback(()=> {
      return  <TouchableOpacity style={[styles.touchableOpacityStyle, {position: 'absolute', bottom: 10, left: 10}]} onPress={()=> setViewDetails(!viewDetails)}>
                  <AntDesign name={viewDetails ? 'down' : 'up'} size={20} color='orange'/>
                  <TextUILIB textColor style={{fontSize: 8}}>{viewDetails ? '-' : '+'} Detalhes</TextUILIB>
              </TouchableOpacity>
    }, [viewDetails])

    const Details = useCallback(()=> {
      return <> 
              <TextUILIB textColor text80>Beleza e Higiene</TextUILIB>
              <TextUILIB marginT-5 color='gray'>Localização: {`${nomeProvincia}, ${district} , ${street}`}</TextUILIB>
              <TextUILIB marginT-5 color='gray'>Email: {email}</TextUILIB>
              <TextUILIB marginT-5 color='gray'>Telefone 1 : {phone}</TextUILIB>
              <TextUILIB marginT-5 color='gray'>Telefone 2 : {alternative_phone}</TextUILIB>
            </>
    }, [])

    const ButtonsFollowerMaximise = useCallback(()=> {
      return  <>
                <TouchableOpacity style={styles.buttonEditProfile} onPress={()=> alert()}>
                    <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}} >Seguir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.touchableOpacityStyle, {position: 'absolute', bottom: 10, right: 10}]} onPress={()=> setViewHeader(false)}>
                    <AntDesign name='up' size={20} color='green'/>
                    <TextUILIB textColor style={{fontSize: 8}}>Maximizar</TextUILIB>
                </TouchableOpacity> 
              </>
    }, [])

    useEffect(() => {
        navigation.setOptions({
          headerTitle: first_name + ' ' + last_name
        })
        getCountEncomenda();
        getCountProduto();
        setRefreshing(true);
        fetchEncomendas(false).then(()=> setRefreshing(false));
        fecthProducts(false).then(()=> setRefreshing(false));
    }, []);

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
          <SafeAreaView flex>
            <ViewUILIB flex bg-bgColor>
              <ToastMessage />
              {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
              {viewFullPhoto ? <ViewFullPhoto photoURI={image} setViewFullPhoto={setViewFullPhoto} /> :
              <View style={styles.infoContainer}>
              {viewHeader ?
              <>
                {viewDetails ? <Details /> : <UserPhoto setViewFullPhoto={setViewFullPhoto}/>}
                <TextUILIB textColor marginT-8 text70>{empresa}</TextUILIB>
                <CountInfo/>
                <ButtonViewDetails/>
                <ButtonsFollowerMaximise/>
              </> :
                  <TouchableOpacity style={styles.touchableOpacityStyle} onPress={()=> setViewHeader(true)}>
                      <AntDesign name='down' size={20} color='green'/>
                  </TouchableOpacity>}
              </View>}
              <TabController asCarousel={true} initialIndex={0}  items={[{ label: 'Produtos | Serviços' }, { label: 'Encomendas' }, { label: 'Seguidores' }]}>
                  <TabController.TabBar
                      backgroundColor={color} 
                      indicatorStyle={{backgroundColor: 'orange', height: 3}} 
                      labelColor={'green'}
                      selectedLabelColor={'orange'}/>
                  <TabController.PageCarousel>
                      <TabController.TabPage index={0}>
                          <ProdutosServicos nav={nav} appearanceName={color} fecthProducts={fecthProducts} userTelephone={user.userTelephone} produts={produts} onRefresh={onRefresh} refreshing={refreshing} empty={empty.produto}/>
                      </TabController.TabPage>
                      <TabController.TabPage index={1} lazy>
                          <Encomenda appearanceName={color} fetchEncomendas={fetchEncomendas} encomendas={encomendas} onRefresh={onRefresh} refreshing={refreshing} empty={empty.encomenda}/>
                      </TabController.TabPage>
                      <TabController.TabPage index={2} lazy><Text>llllll</Text></TabController.TabPage>
                  </TabController.PageCarousel>
              </TabController>
            </ViewUILIB>
          </SafeAreaView>
    );
}

const Numeros = ({text, numero}) => {
    return <TouchableOpacity style={styles.count}>
                <TextUILIB textColor style={{ fontSize: 12, fontWeight: 'bold' }}>{numberFollowersAndViewsFormat(numero, 'youtube')}</TextUILIB>
                <TextUILIB textColor color='gray' style={{ fontSize: 12 }}>{text}</TextUILIB>
            </TouchableOpacity>
}

const ProdutosServicos = ({ nav, appearanceName, fecthProducts, userTelephone, produts, onRefresh, refreshing, empty })=> {

    const [loading, setLoading] = useState(false);
    const { setShowDialog, setVisibleToast } = useContext(CartContext);

    const showProductDetails = (product)=> {
        nav.show('ProductDetails', {
          produto: product,
          userTelephone: userTelephone
        });
    }

    const keyExtractor = (item)=> item.id;

    const renderItemProduct = useCallback(({ item: product }) => { 
      return <Product appearanceName={appearanceName} produto={product} key={product.id} userTelephone={userTelephone} onPress={()=> showProductDetails(product)}/>
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
            ListFooterComponent={empty || refreshing ? null : <FooterComponente loading={loading} setLoading={setLoading} fecthProducts={fecthProducts}/>}
            ListEmptyComponent={<Text style={styles.emptyListStyle}>Sem produtos e serviços</Text>}
            refreshControl={<RefreshControl colors={['orange']} refreshing={refreshing} onRefresh={()=> onRefresh(0)}/>} />
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
                props.fecthProducts(true).then(()=> props.setLoading(false));
          }
        }
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{props.loading ? 'A carregar produtos e serviços' : 'Ver mais'}</Text>
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
