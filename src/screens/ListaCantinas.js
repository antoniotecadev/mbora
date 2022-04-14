import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';

import { useServices } from '../services';
import { useStores } from '../stores';

import { CantinaCard } from '../components/CantinaCard.js';
import { getProducts } from '../services/ProductsService.js';
import { Text, View, Card } from 'react-native-ui-lib';

const cardImage2 = require('../../assets/products/car-101.jpg');

export default function ListaCantinas({ navigation }) {

  const { nav, t, api } = useServices();
  const { counter, ui } = useStores();

  function renderProduct({ item: product }) {
    return (
      <CantinaCard {...product}
        onPress={() => {
          nav.show('ProductDetails', {
            productId: product.id,
          });
        }}
      />
    );
  }
  // function renderCategory({ item: product }) {
  //   return (
  //     <Card
  //       onPress={() => alert()}
  //       height={150}
  //       marginR-8
  //       elevation={1}
  //     >
  //       <Card.Image style={styles.thumb} source={cardImage2} />
  //       <Card.Section
  //         padding-4
  //         content={[{ text: 'Card', text80: true, grey10: true }]}
  //       />
  //     </Card>
  //   );
  // }

  // function flatListHeader() {
  //   return (
  //     <FlatList
  //       contentContainerStyle={styles.productsListContainer}
  //       // keyExtractor={(item) => item.id.toString()}
  //       data={products}
  //       horizontal={true}
  //       renderItem={renderCategory}
  //     />
  //   );
  // }

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getProducts());
  });

  return (
    <>
      <FlatList
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        numColumns={2}
        contentContainerStyle={styles.productsListContainer}
        // keyExtractor={(item) => item.id.toString()}
        data={products}
        renderItem={renderProduct}
        // ListHeaderComponent={flatListHeader}
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
  // thumb: {
  //   height: '100%',
  //   width: 100,
  // },
});
 