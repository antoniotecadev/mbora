import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { useServices } from '../services';
import { useStores } from '../stores';

import { Product } from '../components/Product.js';
import { getProducts } from '../services/ProductsService.js';
import { View } from 'react-native-ui-lib';

export default function ProductsList({ navigation }) {

  const { nav, t, api } = useServices();
  const { counter, ui } = useStores();

  function renderProduct({ item: product }) {
    return (
      <Product {...product}
        onPress={() => {
          nav.show('ProductDetails', {
            productId: product.id,
          });
        }}
      />
    );
  }

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getProducts());
  });

  return (
    <FlatList
      columnWrapperStyle={{
        justifyContent: "space-between",
      }}
      numColumns={2}
      contentContainerStyle={styles.productsListContainer}
      // keyExtractor={(item) => item.id.toString()}
      data={products}
      renderItem={renderProduct}
    />
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
});
