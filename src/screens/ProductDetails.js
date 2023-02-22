import React, {useEffect, useContext, useCallback, useState} from 'react';
import {
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity, 
  StyleSheet,
  Alert,
  ActivityIndicator
  } from 'react-native';

import { CartContext } from '../CartContext';
import { currency, removeSpaceLowerCase } from '../utils/utilitario';
import {Image} from 'react-native-expo-image-cache';
import { Icon } from '../components/icon';
import { Avatar, Colors } from 'react-native-ui-lib';
import ToastMessage from '../components/ToastMessage';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export function ProductDetails({route}) {
  const { produto } = route.params;
  const { addItemToCart, setVisibleToast, encomendar } = useContext(CartContext);
  const [view, setView] = useState(0);
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getItem, setItem, removeItem } = useAsyncStorage('p-' + produto.id);

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

  const encomendarProduct = ()=> {
    Alert.alert('Encomenda', 'Encomendar ' + produto.nome, [
      { text: 'Cancelar', undefined, style: 'cancel'},
      { text: 'OK', onPress: async ()=> await encomendar(setLoading, produto.imei, '123456', produto.id, produto.nome)},
    ]);
  }
  
  useEffect(() => {
    try {
      isFavorite();
      getViewNumberProduct();
    } catch (error) {
      Alert.alert('Erro', error.message);     
    }
  },[]);
  
  const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
  const uri = "https://firebasestorage.googleapis.com/v0/b/react-native-e.appspot.com/o/b47b03a1e22e3f1fd884b5252de1e64a06a14126.png?alt=media&token=d636c423-3d94-440f-90c1-57c4de921641";  
  return (
    <SafeAreaView>
      <ToastMessage />
      <ScrollView>
        <View style={styles.section}>
          <Text $textDefault>{produto.empresa}</Text>
          <Avatar source={{ uri: 'https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg' }}
            size={20}
            animate={false}
            badgeProps={{ size: 6, borderWidth: 0, backgroundColor: Colors.$backgroundSuccessHeavy }}
          />
        </View>
          <Text style={{ marginHorizontal: 16, marginBottom: 16, color: Colors.grey40 }}>
            {`${produto.nomeProvincia}, ${produto.district} , ${produto.street}`}
          </Text>
        <Image style={styles.image} {...{preview, uri}} />
        <View style={styles.infoContainer}>
          <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <IconButton text={'Carrinho'} iconNames={'cart-outline'} size={25} onPress={()=> addItemToCart(produto, produto.nome + ' adicionado ao carrinho.', 'green')}/>
                {loading ? <ActivityIndicator/> : <IconButton text={'Encomenda'} iconNames={'chatbox-outline'} size={25} onPress={()=> encomendarProduct()}/>}
                <IconButton text={'Favorito'} iconNames={value == null ? 'star-outline' : 'star-sharp'} size={25} onPress={()=> value == null ? addProductFavorite() : removeProductFavorite()}/>
                <IconButton text={'Qr code'} iconNames={'qr-code-outline'} size={25}/>
                <IconButton text={'Partilha'} iconNames={'share-outline'} size={25}/>
            </View>
          <View style={styles.divisor}></View>
          <Text style={styles.name}>{produto.nome}</Text>
          <Text style={styles.price}>{currency(String(produto.preco))}</Text>
          <Text style={styles.description}>{produto.nomeCategoria}</Text>
          <Tag tag = {produto.tag}/>
          <View style={styles.divisor}></View>
          <Text style={styles.colorGrey}>Publicado {produto.created_at}</Text>
          {produto.updated_at && <Text style={[styles.colorGrey, { marginTop: 8 }]}>Alterado {produto.updated_at}</Text>}
          <Text style={[styles.colorGrey, { marginTop: 8 }]}>{view} {Number(produto.visualizacao) > 1 ? 'visualizações' : 'visualização'}</Text>
          <View style={styles.divisor}></View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
              <Text style={{ fontSize: 12 }}>{text}</Text>
          </TouchableOpacity>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    marginVertical: 20,
  },
  image: {
    height: 300,
    width: '100%'
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
