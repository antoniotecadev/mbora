import React, {useEffect, useContext, useCallback, useState} from 'react';
import {
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  Image as Img,
  Dimensions
  } from 'react-native';

import { CartContext } from '../CartContext';
import { currency, removeSpaceLowerCase } from '../utils/utilitario';
import {Image} from 'react-native-expo-image-cache';
import { Icon } from '../components/icon';
import { Avatar, Colors, Text as TextUILIB, View as ViewUILIB } from 'react-native-ui-lib';
import ToastMessage from '../components/ToastMessage';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { AlertDialog } from '../components/AlertDialog';

const imageProduct = require('../../assets/products/oleo.jpg');

export function ProductDetails({route, navigation}) {
  const { height } = Dimensions.get('window');
  const [view, setView] = useState(0);
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialogLocal, setShowDialogLocal] = useState(false);

  const { produto } = route.params;
  const { getItem, setItem, removeItem } = useAsyncStorage('p-' + produto.id);
  const { addItemToCart, setVisibleToast, encomendar, showDialog, setShowDialog } = useContext(CartContext);

  const isFavorite = async () => {
    setValue(await getItem());
  }

  const addProductFavorite = async ()=> { 
    try {
      await setItem(JSON.stringify(produto));
      isFavorite();
      setVisibleToast({visible: true, message: produto.nome + ' adicionado aos favoritos.', backgroundColor: 'green'});
    } catch (error) {
      setVisibleToast({visible: true, message: error.message, backgroundColor: 'red'});
    }
  }

  const removeProductFavorite = async ()=> { 
    try {
      await removeItem();
      isFavorite();
      setVisibleToast({visible: true, message: produto.nome + ' removido dos favoritos.', backgroundColor: 'red'});
    } catch (error) {
      setVisibleToast({visible: true, message: error.message, backgroundColor: 'red'});
    }
  }

  const getViewNumberProduct = useCallback(async ()=> {
    let response = await fetch('http://192.168.18.3/mborasystem-admin/public/api/produtos/mbora/view/count/' + produto.id);
    let responseJsonData = await response.json();
    setView(responseJsonData.view);
    }, [produto.id]);

  const encomendarProduct = async(clientData)=> {
    await encomendar(setLoading, [produto.imei], [produto.id], [produto.nome], [1], clientData)
    .then(()=> {
      setLoading(false)
      setShowDialogLocal(false);
    });
  }
  
  useEffect(() => {
    try {
      isFavorite();
      getViewNumberProduct();
    } catch (error) {
      setShowDialog({visible: true, title: 'Erro', message: error.message, color: 'orangered'});     
    }
  },[]);

  useEffect(()=> {
    navigation.getParent()?.setOptions({
        tabBarStyle: {
            display: "none"
        }
    });
    return ()=> {
      navigation.getParent()?.setOptions({
        tabBarStyle: 'flex'
      });
    }
  }, []);
  
  const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
  const uri = "https://firebasestorage.googleapis.com/v0/b/react-native-e.appspot.com/o/b47b03a1e22e3f1fd884b5252de1e64a06a14126.png?alt=media&token=d636c423-3d94-440f-90c1-57c4de921641";  
  return (
    <ViewUILIB style={{height: height}} bg-bgColor>
    {showDialogLocal &&
    <AlertDialog 
      showDialog={showDialogLocal} 
      setShowDialog={setShowDialogLocal} 
      titulo='Encomenda' 
      mensagem={'Destino: ' + produto.empresa + '\n' +'Produto: ' + produto.nome + '\n' + 'Preço: ' + currency(String(produto.preco))} 
      cor='green' 
      onPress={encomendarProduct}
      isEncomenda={true}/>}
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      <ToastMessage />
      <ScrollView>
        <View style={styles.section}>
          <TextUILIB $textDefault textColor>{produto.empresa}</TextUILIB>
          <Avatar source={{ uri: 'https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg' }}
            size={20}
            animate={false}
            badgeProps={{ size: 6, borderWidth: 0, backgroundColor: Colors.$backgroundSuccessHeavy }}
          />
        </View>
          <Text style={{ marginHorizontal: 16, marginBottom: 16, color: Colors.grey40 }}>
            {`${produto.nomeProvincia}, ${produto.district} , ${produto.street}`}
          </Text>
        {/* <Image style={styles.image} {...{preview, uri}} /> */}
        <Img style={styles.image} source= {imageProduct} />
        <View style={styles.infoContainer}>
        <View style={styles.divisor}></View>
          <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <IconButton text={'Carrinho'} iconNames={'cart-outline'} size={25} onPress={()=> addItemToCart(produto, produto.nome + ' adicionado ao carrinho.', 'green')}/>
                {loading ? <ActivityIndicator color='white'/> : <IconButton text={'Encomenda'} iconNames={'chatbox-outline'} size={25} onPress={()=> setShowDialogLocal(true)}/>}
                <IconButton text={'Favorito'} iconNames={value == null ? 'star-outline' : 'star-sharp'} size={25} onPress={()=> value == null ? addProductFavorite() : removeProductFavorite()}/>
                {produto.codigoBarra != null ? null : <IconButton text={'Bar code'} iconNames={'barcode-outline'} size={25}/>}
                <IconButton text={'Partilha'} iconNames={'share-outline'} size={25}/>
            </View>
          <View style={styles.divisor}></View>
          <TextUILIB textColor style={styles.name}>{produto.nome}</TextUILIB>
          <Text style={styles.price}>{currency(String(produto.preco))}</Text>
          <Text style={styles.description}>{produto.nomeCategoria}</Text>
          <Tag tag = {produto.tag}/>
          <View style={styles.divisor}></View>
          <Text style={styles.colorGrey}>Publicado {produto.created_at}</Text>
          {produto.updated_at && <Text style={[styles.colorGrey, { marginTop: 8 }]}>Alterado {produto.updated_at}</Text>}
          <Text style={[styles.colorGrey, { marginTop: 8 }]}>{view} {Number(produto.visualizacao) > 1 ? 'visualizações' : 'visualização'}</Text>
        </View>
      </ScrollView>
    </ViewUILIB>
  );
}

const Tag = (props) => {
  return <TouchableOpacity>
          <Text style={{color: 'green'}}>{removeSpaceLowerCase('#' + props.tag)}</Text>
        </TouchableOpacity>
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
    padding: 16,
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
    marginHorizontal: 16
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
