import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Alert, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useServices } from '../services';
import { useStores } from '../stores';

import { Product } from '../components/Product.js';
import { Card } from 'react-native-ui-lib';

const ITEM_HEIGHT = 150;

import firebase from '../services/firebase';
import { ref, onChildAdded, query, limitToFirst, limitToLast, orderByChild, orderByValue, get, child, startAfter, orderByKey, QueryConstraint  } from "firebase/database";
import database from '../services/firebase';

const cardImage2 = require('../../assets/products/oleo.jpg');

export default function ProductsList({ navigation }) {

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [limit, setLimit] = useState(1);
  const [loading, setLoading] = useState({ctg: false, pdt: false});
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [countPage, setCountPage] = useState(0);

  const { nav, t, api } = useServices();
  const { counter, ui } = useStores();

  const onRefresh = ()=> {
    setRefreshing(true);
    setTimeout(() => {
      fetchProducts();
    }, 1000);
  };

  const showProductDetails = (product)=> {
    nav.show('ProductDetails', {
      produto: product,
    });
  }

  const renderItemProduct = useCallback(({ item: product }) => { 
    return <Product {...product} key={product.id} onPress={()=> showProductDetails(product)} />
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
          onPress={fetchMoreProducts}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Ver mais</Text>
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
        getItemLayout={getItemLayout}
      />
    );
  }

  const fetchCategorys = useCallback(async () => {
    try {
      setLoading({ctg: true});
      let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/categorias/mbora');
      let responseJsonData = await response.json();
      setCategorias(responseJsonData);
    } catch (error) {
      Alert.alert('Erro ao carregar categorias', error.message + '');
    }finally {
      setLoading({ctg: false});
    }
  }, [])

  const fetchMoreProducts = useCallback(async () => {
    setLoading({pdt: true});
    try {
      let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/produtos/mbora/index/json');
      let responseJsonData = await response.json();
      setProdutos((prevState) => [...prevState, ...responseJsonData]);
      setLoading({pdt: false});
    } catch (error) {
      setLoading({pdt: false});
      Alert.alert('Erro ao carregar produtos', error.message + '');
    } finally {
      setRefreshing(false)
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading({pdt: true});
    try {
      let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/produtos/mbora/index/json');
      let responseJsonData = await response.json();
      setProdutos(responseJsonData);
      setLoading({pdt: false});
    } catch (error) {
      setLoading({pdt: false});
      Alert.alert('Erro ao carregar produtos', error.message + '');
    } finally {
      setRefreshing(false)
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
    fetchProducts();
  }, []);

  return (
    <>
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
        ListEmptyComponent={<Text style={styles.emptyListStyle}>Produtos não carregados 😥</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        />
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
    color: '#df4759',
    padding: 10,
    textAlign: 'center',
  }
});
