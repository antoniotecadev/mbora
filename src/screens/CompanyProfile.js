import { deleteItemAsync } from 'expo-secure-store';
import { isEmpty, isNumber } from 'lodash';
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
import ListFollowers from '../components/ListFollowers';

const { width } = Dimensions.get('window');
let URL = 'http://192.168.18.3/mborasystem-admin/public/api/'; 
export default function CompanyProfile({ route, navigation }) {
    const [encomendas, setEncomendas] = useState([]);
    const [produts, setProduts] = useState([]);
    const [refreshing, setRefreshing] = useState({encomenda: false, produto: false});
    const [lastVisible, setLastVisible] = useState({encomenda: 0, produto: 0});
    const [empty, setEmpty] = useState({encomenda: false, produto: false});
    const [viewHeader, setViewHeader] = useState(true);
    const [viewDetails, setViewDetails] = useState(false);
    const [viewFullPhoto, setViewFullPhoto] = useState(false)
    const [image, setImage] = useState(null);
    const [numberProduto, setNumberProduto] = useState('-');
    const [numberEncomenda, setNumberEncomenda] = useState('-');
    const [numberSeguidor, setNumberSeguidor] = useState('-');
    const [numberVisita, setNumberVisita] = useState('-');
    const [isFollower, setIsFollower] = useState(false);
    const [loading, setLoading] = useState({seguir: false});

    const { nav } = useServices();
    const {ui, user} = useStores();
    const {id, estado, empresa, imei, first_name, last_name, email, phone, alternative_phone, nomeProvincia, district, street, product_number, encomenda_number, followers_number, views_mbora, description, screenBack} = route.params;
    const { showDialog, setShowDialog, setVisibleToast } = useContext(CartContext);

    let color = getAppearenceColor(ui.appearanceName);

    const fetchEncomendas = useCallback(async (isMoreView) => {
        try {
            let response =  await fetch(URL + 'empresas/encomendas/mbora/imei/' + imei + '/lastVisible/' + lastVisible.encomenda + '/isMoreView/' + isMoreView,
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
            setRefreshing({encomenda: false});
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

    const fecthProducts = useCallback(async(isMoreView)=> {
        try {
            let response =  await fetch(URL + 'produtos/servicos/mbora/lastVisible/' + lastVisible.produto + '/isMoreView/' + isMoreView + '/imei/' + imei,
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
            setRefreshing({produto: false});
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, [lastVisible.produto]);

    const getNumber = useCallback(async(action)=> {
        let url;
        try {
            if (action == 0) {
              url =  URL + 'number/produtos/servicos/mbora/imei/' + imei;
            } else if (action == 1) {
              url =  URL + 'number/encomendas/empresas/mbora/imei/' + imei;
            }
            let response =  await fetch(url,
            {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                }
            });
            let rjd = await response.json();
            if (isNumber(rjd)) {
              if (action == 0) {
                setNumberProduto(rjd);
              } else if (action == 1) {
                setNumberEncomenda(rjd);
              }
            }
        } catch (error) {
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, []);

    const onRefresh = async (index)=> {
      switch (index) {
        case 0:
          setRefreshing({produto: true});
          fecthProducts(false).then(()=> setRefreshing({produto: false}));
          getNumber(0);
          break;
        case 1:
          setRefreshing({encomenda: true});
          fetchEncomendas(false).then(()=> setRefreshing({encomenda: false}));
          getNumber(1);
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

    const NumberInformation = useCallback(()=> {
        return (
            <View style={styles.section}>
                <Numeros text='Prod | Serv' numero={numberProduto}/>
                <Numeros text='Encomendas' numero={numberEncomenda}/>
                <Numeros text='Seguidores' numero={numberSeguidor}/>
                <Numeros text='Visitas' numero={numberVisita}/>
            </View>
        )
    }, [numberProduto, numberEncomenda, numberSeguidor, numberVisita])

    const ButtonViewDetails = useCallback(()=> {
      return  <TouchableOpacity style={[styles.touchableOpacityStyle, {position: 'absolute', bottom: 10, left: 10}]} onPress={()=> setViewDetails(!viewDetails)}>
                  <AntDesign name={viewDetails ? 'down' : 'up'} size={20} color='orange'/>
                  <TextUILIB textColor style={{fontSize: 8}}>{viewDetails ? '-' : '+'} Detalhes</TextUILIB>
              </TouchableOpacity>
    }, [viewDetails])

    const Details = useCallback(()=> {
      return <> 
              <TextUILIB textColor text80>{description}</TextUILIB>
              <TextUILIB marginT-5 color='gray'>Localização: {`${nomeProvincia}, ${district} , ${street}`}</TextUILIB>
              <TextUILIB marginT-5 color='gray'>Email: {email}</TextUILIB>
              <TextUILIB marginT-5 color='gray'>Telefone 1 : {phone}</TextUILIB>
              <TextUILIB marginT-5 color='gray'>Telefone 2 : {alternative_phone}</TextUILIB>
            </>
    }, [])

    const ButtonsFollowerMaximise = useCallback(()=> {
      return  <>
                <TouchableOpacity disabled={loading.seguir} style={[styles.buttonEditProfile, {backgroundColor: isFollower ? 'orangered' : 'green'}]} onPress={()=> followCompany().then(()=> setLoading({seguir: false}))}>
                    <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}} >{isFollower ? 'A seguir' : 'Seguir'}</Text>
                    {loading.seguir ? 
                      <ActivityIndicator 
                        size={10}
                        color="white" 
                        style={{marginLeft: 8}} /> : null}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.touchableOpacityStyle, {position: 'absolute', bottom: 10, right: 10}]} onPress={()=> setViewHeader(false)}>
                    <AntDesign name='up' size={20} color='green'/>
                    <TextUILIB textColor style={{fontSize: 8}}>Maximizar</TextUILIB>
                </TouchableOpacity> 
              </>
    }, [isFollower, loading.seguir])

    const numberViewsCompany = async()=> {
      let response = await fetch(URL + 'number/visitas/empresas/mbora/imei/' + imei);
      let rjd = await response.json();
      setNumberVisita(isNumber(rjd.views) ? rjd.views : views_mbora);
    };

    const followCompany = async()=> {
      setLoading({seguir: true}); 
      try {
        let response = await fetch(URL + 'seguir/empresas/mbora/imei/' + imei + '/isFollower/' + isFollower,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
          },
        });
        let rjd = await response.json();
        if(rjd.success) {
          setIsFollower(rjd.estado);
          setNumberSeguidor((seguidor) => rjd.estado == 1 ? seguidor + 1 : (seguidor > 0 ? seguidor - 1 : seguidor));
        } else {
          setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'});
        }
      } catch (error) {
        setLoading({seguir: false}); 
        setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});     
      }
    }

    useEffect(() => {
        navigation.setOptions({
          headerTitle: first_name + ' ' + last_name
        })
        setIsFollower(estado == 1);
        setNumberProduto(product_number);
        setNumberEncomenda(encomenda_number);
        setNumberSeguidor(followers_number);
        numberViewsCompany();
        fetchEncomendas(false);
        fecthProducts(false);
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

  const goBack = () => {
    navigation.navigate({
      name: screenBack,
      params: isFollower == estado || (isFollower == false && isFollower != 0) || (estado == null && isFollower == false) ?
       {} : { 
        estado: isFollower ? 1 : 0, 
        id: id,
        numberSeguidor: numberSeguidor
      },
      merge: true,
    });
  }

  useEffect(()=> {
      navigation.setOptions({
          headerLeft: () => (
              <TouchableOpacity style={{right: 10, paddingRight: 10, paddingVertical: 10}} onPress={() => goBack()}>
                <AntDesign name='left' color={'orange'} size={24}/>
              </TouchableOpacity>
          ),
      })
  }, [id, estado, isFollower, numberSeguidor, screenBack]);

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
            <NumberInformation/>
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
                      <ProdutosServicos nav={nav} appearanceColor={color} fecthProducts={fecthProducts} userTelephone={user.userTelephone} produts={produts} onRefresh={onRefresh} refreshing={refreshing.produto} empty={empty.produto}/>
                  </TabController.TabPage>
                  <TabController.TabPage index={1} lazy>
                      <Encomenda isUser={false} appearanceColor={color} fetchEncomendas={fetchEncomendas} encomendas={encomendas} onRefresh={()=> onRefresh(1)} refreshing={refreshing.encomenda} empty={empty.encomenda}/>
                  </TabController.TabPage>
                  <TabController.TabPage index={2} lazy>
                    <ListFollowers user={user} imei={imei} URL={URL} setNumberSeguidor={setNumberSeguidor}/>
                  </TabController.TabPage>
              </TabController.PageCarousel>
          </TabController>
        </ViewUILIB>
      </SafeAreaView>
    );
}

const Numeros = ({text, numero}) => {
    return <TouchableOpacity style={styles.number}>
                <TextUILIB textColor style={{ fontSize: 12, fontWeight: 'bold' }}>{numberFollowersAndViewsFormat(numero, 'youtube')}</TextUILIB>
                <TextUILIB textColor color='gray' style={{ fontSize: 12 }}>{text}</TextUILIB>
            </TouchableOpacity>
}

const ProdutosServicos = ({ nav, appearanceColor, fecthProducts, userTelephone, produts, onRefresh, refreshing, empty })=> {

    const [loading, setLoading] = useState(false);
    const { setShowDialog, setVisibleToast } = useContext(CartContext);

    const showProductDetails = (product)=> {
        nav.show('ProductDetails', {
          produto: product,
          userTelephone: userTelephone,
          screenBack: 'CompanyProfile'
        });
    }

    const keyExtractor = (item)=> item.id;

    const renderItemProduct = useCallback(({ item: product }) => { 
      return <Product appearanceColor={appearanceColor} produto={product} key={product.id} userTelephone={userTelephone} onPress={()=> showProductDetails(product)}/>
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
        flexDirection: "row", 
        justifyContent: "center",
        alignItems: "center",
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    number: { 
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
