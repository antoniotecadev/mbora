import React, {useEffect, useContext, useCallback, useState} from 'react';
import {
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  Platform,
  BackHandler,
  Share,
  Alert
} from 'react-native';
import { CartContext } from '../CartContext';
import { currency, getValueItemAsync, getCompany, numberFollowersAndViewsFormat, removeSpaceLowerCase } from '../utils/utilitario';
import { Icon } from '../components/icon';
import { Avatar, Colors, Text as TextUILIB, View as ViewUILIB } from 'react-native-ui-lib';
import ToastMessage from '../components/ToastMessage';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { AlertDialog } from '../components/AlertDialog';
import { isNumber } from 'lodash';
import { AntDesign, MaterialCommunityIcons, Fontisto  } from "@expo/vector-icons";
import * as Constants from 'expo-constants';
import Barcode from 'react-native-barcode-svg';

const imageProduct = require('../../assets/products/oleo.jpg');
const API_URL = Constants.default.manifest.extra.API_URL;

export function ProductDetails({route, navigation}) {
  const { height } = Dimensions.get('window');
  const [view, setView] = useState(0);
  const [isFavorito, setIsFavorito] = useState(false);
  const [viewCodeBar, setViewCodeBar] = useState(false);
  const [loading, setLoading] = useState({encomenda: false, favorito: false, companyProfile: false});
  const [showDialogLocal, setShowDialogLocal] = useState(false);

  const { produto, userName, userTelephone, screenBack, isProfileCompany } = route.params;
  const { getItem, setItem, removeItem } = useAsyncStorage('p-' + produto.id);
  const { addItemToCart, setVisibleToast, encomendar, showDialog, setShowDialog } = useContext(CartContext);

  const addProductFavorite = async ()=> {
    setLoading({favorito: true}); 
    try {
      let response = await fetch(API_URL + 'adicionar/produto/mbora/favorito',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
        },
        body: JSON.stringify({ id_products_mbora: produto.id })
      });
      let rjd = await response.json();
      if(rjd.success) {
        setIsFavorito(!isFavorito);
        setVisibleToast({visible: true, message: produto.nome + ' adicionado aos favoritos.', backgroundColor: 'green'});
      } else {
        if (rjd.message == 'Erro de validação') {
          setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message.id_products_mbora, color: 'orangered'});
        } else {
          setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'});
        }
      }
    } catch (error) {
      setLoading({favorito: false}); 
      setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});     
    }
  }

  // VERIFICAR PRODUTO AOS FAVORITOS LOCALMENTE
  // const isFavorite = async () => {
  //   setIsFavorito(await getItem());
  // }

  // ADICIONAR PRODUTO AOS FAVORITOS LOCALMENTE
  // const addProductFavorite = async ()=> { 
  //   try {
  //     await setItem(JSON.stringify(produto));
  //     alert(JSON.stringify(produto, null, 2));
  //     isFavorite();
  //     setVisibleToast({visible: true, message: produto.nome + ' adicionado aos favoritos.', backgroundColor: 'green'});
  //   } catch (error) {
  //     setVisibleToast({visible: true, message: error.message, backgroundColor: 'red'});
  //   }
  // }

  // REMOVER PRODUTO DOS FAVORITOS LOCALMENTE
  // const removeProductFavorite = async ()=> { 
  //   try {
  //     // await removeItem(); REMOVER PRODUTO DOS FAVORITOS LOCALMENTE
  //     // isFavorite();
  //     setVisibleToast({visible: true, message: produto.nome + ' removido dos favoritos.', backgroundColor: 'red'});
  //   } catch (error) {
  //     setVisibleToast({visible: true, message: error.message, backgroundColor: 'red'});
  //   }
  // }

  const removeProductFavorite = async ()=> { 
    setLoading({favorito: true}); 
    try {
      let response = await fetch(API_URL + 'eliminar/produto/mbora/favorito',
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
        },
        body: JSON.stringify({ id_products_mbora: produto.id })
      });
      let rjd = await response.json();
      if(rjd.success) {
        setIsFavorito(!isFavorito);
        setVisibleToast({visible: true, message: produto.nome + ' removido dos favoritos.', backgroundColor: 'red'});
      } else {
        if (rjd.message == 'Erro de validação') {
          setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message.id_products_mbora, color: 'orangered'});
        } else {
          setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'});
        }      
      }
    } catch (error) {
      setLoading({favorito: false}); 
      setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});     
    }
  }

  const getViewNumberProduct = useCallback(async ()=> {
    let response = await fetch(API_URL + 'produtos/mbora/view/count/' + produto.id);
    let responseJsonData = await response.json();
    setView(responseJsonData.view);
  }, [produto.id]);

  const encomendarProduct = async(clientData)=> {
    await encomendar(setLoading, [produto.imei], [produto.id], [produto.nome], [1], clientData)
    .then(()=> {
      setLoading({encomenda: false})
      setShowDialogLocal(false);
    });
  }

  const Tag = () => {
    const tag = removeSpaceLowerCase('#' + produto.tag);
    return <TouchableOpacity onPress={() => navigation.navigate('ProductCategoryList', {categoria: {id: produto.idcategoria, nome: tag}, isTag: true, tag: produto.tag})}>
            <Text style={{color: 'green'}}>{tag}</Text>
          </TouchableOpacity>
  }

  const backAction = () => {
    navigation.navigate({
      name: screenBack,
      params: isFavorito == isNumber(produto.isFavorito) ? {} : 
      { 
        id: produto.id,
        isFavorito: isFavorito ? produto.id : null,
      },
      merge: true,
    });
  }

  const onShare = async () => {
      const url = "https://firebasestorage.googleapis.com/v0/b/react-native-e.appspot.com/o/b47b03a1e22e3f1fd884b5252de1e64a06a14126.png?alt=media&token=d636c423-3d94-440f-90c1-57c4de921641";  
      try {
        const result = await Share.share({
          title: produto.nome,       
          message: 'Produto: ' + produto.nome + '\nPreço: ' + currency(String(produto.preco)) + '\n' + (Platform.OS == 'android' ? url : ''),
          url: url,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});     
      }
  };

  useEffect(() => {
    try {
      setIsFavorito(isNumber(produto.isFavorito));
      getViewNumberProduct();
    } catch (error) {
      setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});     
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  },[produto.id]);

  useEffect(()=> {
    navigation.setOptions({
        headerLeft: () => (
            <TouchableOpacity style={{right: 10, paddingRight: 10, paddingVertical: 10}} onPress={() => backAction()}>
              <AntDesign name='left' color={'orange'} size={24}/>
            </TouchableOpacity>
        ),
    })
  }, [isFavorito, produto.isFavorito, screenBack]);
  
  const uri = "https://firebasestorage.googleapis.com/v0/b/react-native-e.appspot.com/o/b47b03a1e22e3f1fd884b5252de1e64a06a14126.png?alt=media&token=d636c423-3d94-440f-90c1-57c4de921641";  
  return (
    <ViewUILIB style={{height: height}} bg-bgColor>
    {showDialogLocal &&
    <AlertDialog 
      showDialog={showDialogLocal} 
      setShowDialog={setShowDialogLocal} 
      titulo='Encomenda' 
      mensagem={'\nEmpresa: ' + produto.empresa + '\n' +'Produto: ' + produto.nome + '\n' + 'Preço: ' + currency(String(produto.preco)) + '\n'} 
      cor='green' 
      isEncomenda={true}
      userTelephone={userTelephone}
      isDetailsEncomenda={false}
      clientName={userName}
      companyName={produto.empresa}
      companyCoordinate={JSON.parse(produto.company_coordinate)}
      onPress={encomendarProduct}
      />}
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      <ToastMessage />
      <ScrollView>
        <TouchableOpacity onPress={()=> {
          if(!isProfileCompany){
            setLoading({companyProfile: true});
            getCompany(produto.imei, navigation, 'ProductDetails', isProfileCompany).then(()=> setLoading({companyProfile: false}));
          }
        }}>
          <View style={styles.section}>
            <TextUILIB $textDefault textColor>{produto.empresa}</TextUILIB>
            {loading.companyProfile ? <ActivityIndicator color={'orange'}/>: 
            <Avatar source={{ uri: 'https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg' }}
              size={20}
              animate={false}
              badgeProps={{ size: 6, borderWidth: 0, backgroundColor: Colors.$backgroundSuccessHeavy }}
            />}
          </View>
          <Text style={{ marginHorizontal: 16, marginBottom: 16, color: Colors.grey40 }}>
            {`${produto.nomeProvincia}, ${produto.district} , ${produto.street}`}
          </Text>
        </TouchableOpacity>
        <Image style={styles.image} source= {{uri: uri}}/>
        {viewCodeBar && 
        <View style={{alignItems: 'center', backgroundColor: 'lightgreen', paddingVertical: 2, marginHorizontal: 16, marginTop: 10}}>
          <Barcode value={produto.codigoBarra} format="CODE128" />
          <Text>{produto.codigoBarra}</Text>
        </View>}
        <View style={styles.infoContainer}>
        <View style={styles.divisor}></View>
          <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <IconButton text={'Carrinho'} iconNames={'cart-outline'} size={25} onPress={()=> addItemToCart(produto, produto.nome + ' adicionado ao carrinho.', 'green')}/>
                {loading.encomenda ? <ActivityIndicator color='orange'/> : <IconButton text={'Encomenda'} iconNames={'chatbox-outline'} size={25} onPress={()=> setShowDialogLocal(true)}/>}
                {produto.codigoBarra && 
                (viewCodeBar ? 
                  <MaterialCommunityIcons name="barcode-off" size={25} color="darkgreen" onPress={()=> setViewCodeBar(false)}/> :
                  <Fontisto name="shopping-barcode" size={25} color="darkgreen" onPress={()=> setViewCodeBar(true)}/>)}  
                {loading.favorito ? <ActivityIndicator style={{marginHorizontal: Platform.OS == 'ios' ? 12 : 10}} color='orange'/> : <IconButton text={'Favorito'} iconNames={isFavorito ? 'star-sharp' : 'star-outline'} size={25} onPress={()=> isFavorito ?  removeProductFavorite().then(()=> setLoading({favorito: false})) : addProductFavorite().then(()=> setLoading({favorito: false}))}/>}
                <IconButton text={'Partilha'} iconNames={'share-outline'} size={25} onPress={()=> onShare()}/>
            </View>
          <View style={styles.divisor}></View>
          <TextUILIB textColor style={styles.name}>{produto.nome}</TextUILIB>
          <Text style={styles.price}>{currency(String(produto.preco))}</Text>
          <Text style={styles.description} onPress={() => navigation.navigate('ProductCategoryList', {categoria: {id: produto.idcategoria, nome: produto.nomeCategoria}, isTag: false})}>
            {produto.nomeCategoria}
          </Text>
          <Tag/>
          <View style={styles.divisor}></View>
          <Text style={styles.colorGrey}>Publicado {produto.created_at}</Text>
          {produto.updated_at && <Text style={[styles.colorGrey, { marginTop: 8 }]}>Alterado {produto.updated_at}</Text>}
          <Text style={[styles.colorGrey, { marginTop: 8 }]}>{numberFollowersAndViewsFormat(view, 'youtube')} {Number(produto.visualizacao) > 1 ? 'visualizações' : 'visualização'}</Text>
        </View>
      </ScrollView>
    </ViewUILIB>
  );
} 

const IconButton = ({iconNames, text, size, onPress}) =>{
  return <TouchableOpacity style={{ alignItems: 'center' }} onPress={onPress}>
              <Icon name={iconNames} size={size} color="green"/>
              <TextUILIB textColor style={{ fontSize: 12 }}>{text}</TextUILIB>
          </TouchableOpacity>
}

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 22,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    marginBottom: 8,
    color: 'green'
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#787878',
    marginBottom: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 10
  },
  divisor: {
    borderBottomWidth: 1, 
    borderBottomColor: Colors.$backgroundDisabled, 
    marginVertical: 10
  }, 
  colorGrey: {
    color: Colors.grey40
  }
}); 
