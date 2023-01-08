import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Alert, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

import { useServices } from '../services';
import { useStores } from '../stores';

import { Product } from '../components/Product.js';
import { Card } from 'react-native-ui-lib';

import firebase from '../services/firebase';
import { ref, onChildAdded, query, limitToFirst, limitToLast, orderByChild, orderByValue, get, child, startAfter, orderByKey, QueryConstraint  } from "firebase/database";
import database from '../services/firebase';

const cardImage2 = require('../../assets/products/oleo.jpg');

export default function ProductsList({ navigation }) {

  const [produtos, setProdutos] = useState([]);
  const [limit, setLimit] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [countPage, setCountPage] = useState(0);

  const { nav, t, api } = useServices();
  const { counter, ui } = useStores();

  const ItemProduct = ({ item: product }) => {
    return (
      <Product {...product}
        onPress={() => {
          nav.show('ProductDetails', {
            produto: product,
          });
        }}
      />
    );
  }
  const renderCategory = ({ item: product }) => {
    return (
      <Card
        onPress={() => Alert.alert()}
        height={150}
        marginR-8
        elevation={1}
      >
        <Card.Image style={styles.thumb} source={cardImage2} />
        <Card.Section
          padding-4
          content={[{ text: 'Categoria', text80: true, grey10: true }]}
        />
      </Card>
    );
  }

  const FooterComponente = () => {
    return (
    //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={fetchMoreProducts}
          //On Click of button load more data
          style={styles.loadMoreBtn}>

          <Text style={styles.btnText}>Ver mais</Text>
          {loading ? (
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
        // keyExtractor={(item) => item.id.toString()}
        data={produtos}
        horizontal={true}
        renderItem={renderCategory}
      />
    );
  }

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/produtos/mbora/json/index');
      let responseJsonData = await response.json();
      if(countPage > 4) {
        setCountPage(0);
        setProdutos(responseJsonData);
      } else {
        setCountPage(countPage + 1);
        setProdutos([...produtos, ...responseJsonData]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  const fetchMoreProducts = () => {
    setRefreshing(true);
    fetchProducts();
    setRefreshing(false);
  }

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
        keyExtractor={(item) => item.id}
        renderItem={ItemProduct}
        data={produtos}
        ListHeaderComponent={FlatListHeaderComponent}
        ListFooterComponent={FooterComponente}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreProducts}
        refreshing={refreshing}
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
});
