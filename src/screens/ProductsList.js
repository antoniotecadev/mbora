import React, { useCallback, useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, Alert, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useServices } from '../services';
import { Product } from '../components/Product.js';
import { Card, View as ViewUILIB } from 'react-native-ui-lib';
import ToastMessage from '../components/ToastMessage';
import ErrorMessage from '../components/ErrorMessage';
import { CartContext } from '../CartContext';

const ITEM_HEIGHT = 150;

import firebase from '../services/firebase';
import { ref, onChildAdded, query, limitToFirst, limitToLast, orderByChild, orderByValue, get, child, startAfter, orderByKey, QueryConstraint  } from "firebase/database";
import database from '../services/firebase';
import { useStores } from '../stores';
import { AlertDialog } from '../components/AlertDialog';

const cardImage2 = require('../../assets/products/oleo.jpg');

export default function ProductsList({ navigation }) {

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [limit, setLimit] = useState(1);
  const [loading, setLoading] = useState({ctg: false, pdt: false});
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [countPage, setCountPage] = useState(0);

  const {ui} = useStores();
  const { nav } = useServices();
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
    });
  }

  const renderItemProduct = useCallback(({ item: product }) => { 
    return <Product appearanceName={ui.appearanceName} produto={product} key={product.id} onPress={()=> showProductDetails(product)}/>
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

  const FooterComponente = () => {
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
        <FlatList
        contentContainerStyle={styles.productsListContainer}
        keyExtractor={keyExtractor}
        data={categorias}
        horizontal={true}
        renderItem={renderItemCategory}
        getItemLayout={getItemLayout}/>
    );
  }

  const fetchCategorys = useCallback(async () => {
    try {
      let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/categorias/mbora');
      let responseJsonData = await response.json();
      setCategorias(responseJsonData);
    } catch (error) {
      Alert.alert('Erro ao carregar categorias', error.message + '');
    }
  }, [])

  const fetchProducts = useCallback(async (isRefresh) => {
    setLoading({pdt: true});
    try {
      let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/produtos/mbora/index/json');
      let responseJsonData = await response.json();
      if(isRefresh) {
        setProdutos(responseJsonData);
      } else {
        setProdutos((prevState) => [...prevState, ...responseJsonData]);
      }
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const getData = () => {
    // let imei = [];
    // setLoading(true);
    // const pds = query(ref(firebase, 'produtos'), limitToLast(2));
    //   onChildAdded(pds, (snapshot) => {
    //     get(query(child(ref(firebase), `produtos/${snapshot.key}`), limitToLast(2))).then((snap) => {
    //       snap.forEach((childSnapshot) => {
    //         setProdutos((p) => [...p, childSnapshot.val()]);
    //       });
    //     });
      // imei.push(snapshot.key)

      // snapshot.forEach((childSnapshot) => {
      //   const c = childSnapshot.child('categoria').key;
      //   const childKey = childSnapshot.key;
      //   const childData = childSnapshot.val();
      //   // setProdutos((p) => [...p, childData]);
      //   // console.log(c)
      //   // setLoading(false);
      // });
    // }); 
    // setLastVisible(imei[imei.length - 1])
  }

  const getMoreData = () => {
    // let imei = [];
    // setRefreshing(true);
    // const pds = query(ref(firebase, 'produtos'), limitToLast(limit));
    //   onChildAdded(pds, (snapshot) => {
    //   imei.push(snapshot.key)
    //   snapshot.forEach((childSnapshot) => {
    //     const childKey = childSnapshot.key;
    //     const childData = childSnapshot.val();
    //     setProdutos((p) => [...p, childData]);
    //     // console.log(childData)
    //     setRefreshing(false);
    //   });
    // }); 
    // setLastVisible(imei[imei.length - 1])
  }

  useEffect(() => {
    fetchCategorys();
    fetchProducts(true).then(()=> { setLoading({pdt: false}) });
  }, []);

  return (
    <ViewUILIB flex bg-bgColor>
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      <ToastMessage />
      { error == null ? 
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
        ListFooterComponent={FooterComponente}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyListStyle}>Sem produtos</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} />
        : <ErrorMessage onLoading={()=> { setError(null); fetchProducts(true).then(()=> { setLoading({pdt: false}) }) }} error={error} loading={loading} />}
    </ViewUILIB>
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
