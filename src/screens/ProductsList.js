import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Alert } from 'react-native';

import { useServices } from '../services';
import { useStores } from '../stores';

import { Product } from '../components/Product.js';
import { Card } from 'react-native-ui-lib';

import firebase from '../services/firebase';
import { ref, onChildAdded, query } from "firebase/database";

const cardImage2 = require('../../assets/products/oleo.jpg');

export default function ProductsList({ navigation }) {

  const [produtos, setProdutos] = useState([]);

  const { nav, t, api } = useServices();
  const { counter, ui } = useStores();

  function renderProduct({ item: product }) {
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
  function renderCategory({ item: product }) {
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

  function flatListHeader() {
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

  useEffect(() => {
    const pds = query(ref(firebase, 'produtos'));
      onChildAdded(pds, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        setProdutos((a) => [...a, childData]);
      });
    }); 
  return () => ref(firebase, 'produtos').off();
  }, []);

  return (
    <>
      <FlatList
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        numColumns={2}
        contentContainerStyle={styles.productsListContainer}
        keyExtractor={(item) => item.urlImage.toString()}
        data={produtos}
        renderItem={renderProduct}
        ListHeaderComponent={flatListHeader}
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
});
