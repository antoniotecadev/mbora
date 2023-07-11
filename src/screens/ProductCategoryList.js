import React, { useCallback, useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useServices } from '../services';
import { Product } from '../components/Product.js';
import ToastMessage from '../components/ToastMessage';
import { CartContext } from '../CartContext';
import { useStores } from '../stores';
import { AlertDialog } from '../components/AlertDialog';
import { getAppearenceColor, getValueItemAsync } from '../utils/utilitario';
import * as Constants from 'expo-constants';
import { View as ViewUILB } from 'react-native-ui-lib';
import { isEmpty } from 'lodash';

const API_URL = Constants.default.manifest.extra.API_URL;

export default function ProductsList({ route, navigation }) {

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [emptyProduct, setEmptyProduct] = useState(false);

  const { categoria, isTag, tag = null } = route.params;
  const { nav } = useServices();
  const {ui, user} = useStores();
  let color = getAppearenceColor(ui.appearanceName); 
  const {showDialog, setShowDialog} = useContext(CartContext);

  const onRefresh = ()=> {
    setRefreshing(true);
    fetchProducts(true).then(()=> {
      setLoading(false);
      setRefreshing(false);
    });
  };

  const showProductDetails = (product)=> {
    nav.show('ProductDetails', {
      produto: product,
      userName: user.userFirstName + ' ' + user.userLastName,
      userTelephone: user.userTelephone,
      screenBack: 'Main',
      isProfileCompany: false
    });
  }

  const renderItemProduct = useCallback(({ item: product }) => { 
    return <Product appearanceColor={color} produto={product} key={product.id} userName={user.userFirstName + ' ' + user.userLastName} userTelephone={user.userTelephone} onPress={()=> showProductDetails(product)}/>
  },[]);

  const keyExtractor = (item)=> item.id;

  const FooterComponent = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={()=> fetchProducts(false).then(()=> { setLoading(false) })}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{loading ? 'A carregar produtos': 'Ver mais'}</Text>
          {loading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    )
  }

  const fetchProducts = useCallback(async (isRefresh) => {
    setLoading(true);
    try {
      let response =  await fetch(API_URL + 'produtos/mbora/categoria/' + categoria.id + '/isTag/' + isTag + '/tag/' + tag, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
        }
      });
      let responseJsonData = await response.json();
      if(!isEmpty(responseJsonData.produtos)) {
        setEmptyProduct(false);
        if(isRefresh) {
            if(responseJsonData.numeroProdutos <= 32) {
                setEmptyProduct(true);
            } 
            setProdutos(responseJsonData.produtos);
        } else {
            setProdutos((prevState) => {
                const idsSet = new Set(prevState.map(p => p.id));
                const newProducts = responseJsonData.produtos.filter(item => !idsSet.has(item.id));
                if(responseJsonData.numeroProdutos == (idsSet.size + newProducts.length)) {
                    setEmptyProduct(true);
                } 
                return [...prevState, ...newProducts];
            });
        }
      } else {
        setEmptyProduct(true);
      }
    } catch (error) {
      setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
        headerTitle: categoria.nome
    });
    fetchProducts(true).then(()=> setLoading(false));
  }, []);

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
    <ViewUILB bg-bgColor style={{flex: 1}}>
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      <ToastMessage />
      <FlatList
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        numColumns={2}
        contentContainerStyle={styles.productsListContainer}
        keyExtractor={keyExtractor}
        renderItem={renderItemProduct}
        data={produtos}
        // ListHeaderComponent={<Text style={styles.title}>{route.params.categoria.nome}</Text>}
        ListFooterComponent={!emptyProduct && FooterComponent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && <Text style={styles.emptyListStyle}>Sem produtos</Text>}
        refreshControl={<RefreshControl colors={['orange']} refreshing={refreshing} onRefresh={onRefresh}/>} />
    </ViewUILB>
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
  },
  title: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'orange',
    padding: 5,
  }
});
