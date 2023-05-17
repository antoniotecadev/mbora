import React, { useCallback, useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, Alert, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useServices } from '../services';
import { Product } from '../components/Product.js';
import { Card } from 'react-native-ui-lib';
import ToastMessage from '../components/ToastMessage';
import ErrorMessage from '../components/ErrorMessage';
import { CartContext } from '../CartContext';
import { useFocusEffect  } from '@react-navigation/native';

const ITEM_HEIGHT = 150;

import { useStores } from '../stores';
import { AlertDialog } from '../components/AlertDialog';
import { getAppearenceColor, getValueItemAsync } from '../utils/utilitario';

const cardImage2 = require('../../assets/products/oleo.jpg');
const URL = 'http://192.168.18.4/mborasystem-admin/public/api/'; 

export default function ProductsList({ route, navigation }) {

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState({ctg: false, pdt: false});
  const [refreshing, setRefreshing] = useState(false);
  const [emptyProduct, setEmptyProduct] = useState(false);
  const [categoryError, setCategoryError] = useState(null);

  const {ui, user} = useStores();
  const { nav } = useServices();
  let color = getAppearenceColor(ui.appearanceName); 
  const { error, setError, showDialog, setShowDialog} = useContext(CartContext);

  const onRefresh = ()=> {
    setRefreshing(true);
    fetchProducts(true).then(()=> {
      setLoading({pdt: false});
      setRefreshing(false);
    });
  };

  const showProductDetails = (product)=> {
    nav.show('ProductDetails', {
      produto: product,
      userTelephone: user.userTelephone,
      screenBack: 'Main',
      isProfileCompany: false
    });
  }

  const renderItemProduct = useCallback(({ item: product }) => { 
    return <Product appearanceColor={color} produto={product} key={product.id} userTelephone={user.userTelephone} onPress={()=> showProductDetails(product)}/>
  },[]);

  const keyExtractor = (item)=> item.id;
  const getItemLayout = (_, index)=>({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index });

  const renderItemCategory = useCallback(({ item: category }) => {
    return (
      <Card
        onPress={() => Alert.alert()}
        height={150}
        marginR-8
        width={100}
        backgroundColor = 'orange'
        elevation={1}
      >
        {/* <Card.Image style={styles.thumb} source={cardImage2} /> */}
        <Card.Section
          padding-4
          backgroundColor = 'green'
          content={[{ text: category.nome, text80: true, grey10: true, white: true }]}
        />
      </Card>
    );
  }, []);

  const FooterComponent = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={()=> fetchProducts(false).then(()=> { setLoading({pdt: false}) })}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{loading.pdt ? 'A carregar produtos': 'Ver mais'}</Text>
          {loading.pdt ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    )
  }

  const FlatListHeaderComponent = () =>  {
    return (
      <>
        {categoryError == null ?
        <FlatList
        contentContainerStyle={styles.productsListContainer}
        keyExtractor={keyExtractor}
        data={categorias}
        horizontal={true}
        renderItem={renderItemCategory}
        getItemLayout={getItemLayout}/>
        :
        <TouchableOpacity 
          style={{padding: 10, backgroundColor: 'orangered'}} 
          onPress={()=> { setLoading({ ctg: true}); fetchCategorys().then(()=> setLoading({ ctg: false}))}}>
          {loading.ctg ? <ActivityIndicator color='white'/> : <Text style={{textAlign: 'center', color: 'white'}}>{categoryError}</Text>}
        </TouchableOpacity>}
      </>
    );
  }

  const fetchCategorys = useCallback(async () => {
    try {
      let response =  await fetch(URL + 'categorias/mbora');
      let responseJsonData = await response.json();
      setCategorias(responseJsonData);
      setCategoryError(null);
    } catch (error) {
      setCategoryError(error.message);
    }
  }, [])

  const fetchProducts = useCallback(async (isRefresh) => {
    setLoading({pdt: true});
    try {
      let response =  await fetch(URL + 'produtos/mbora/index/json', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
        }
      });
      let responseJsonData = await response.json();
      if(!emptyProduct){
        setEmptyProduct(false);
        if(isRefresh) {
          setProdutos(responseJsonData);
        } else {
          setProdutos((prevState) => [...prevState, ...responseJsonData]);
        }
      } else {
        setEmptyProduct(true);
      }
    } catch (error) {
      // setError(error.message); // Renderizar um component com mensagem de erro
      setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
    }
  }, []);

  useEffect(() => {
    fetchCategorys();
    fetchProducts(true).then(()=> setLoading({pdt: false}));
  }, []);

  useFocusEffect(useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: 'flex'
      });
    }, [navigation])
  );

  useEffect(() => {
    if (route.params?.id || route.params?.isFavorito) {
      setProdutos((prevProduct) => {
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
    <>
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      <ToastMessage />
      {/* { error == null ?  */}
      <FlatList
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        numColumns={2}
        contentContainerStyle={styles.productsListContainer}
        keyExtractor={keyExtractor}
        renderItem={renderItemProduct}
        data={produtos}
        ListHeaderComponent={FlatListHeaderComponent}
        ListFooterComponent={!emptyProduct && FooterComponent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading.pdt && <Text style={styles.emptyListStyle}>Sem produtos</Text>}
        refreshControl={<RefreshControl colors={['orange']} refreshing={refreshing} onRefresh={onRefresh}/>} />
        {/* : <ErrorMessage onLoading={()=> { setError(null); fetchProducts(true).then(()=> { setLoading({pdt: false}) }) }} error={error} loading={loading} />} */}
    </>
  );
}

const styles = StyleSheet.create({
  productsList: {
    backgroundColor: 'black',
  },
  productsListContainer: {
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  thumb: {
    height: '50%',
    width: 100,
  },
  container:{
    justifyContent: 'center',
    flex: 1,
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
  emptyListStyle: {
    color: 'gray',
    paddingTop: 150,
    textAlign: 'center',
  }
});
