import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { CompanyCard } from '../components/CompanyCard.js';
import { getProducts } from '../services/ProductsService.js';

export default function CompanyList() {

  function renderProduct({ item: product }) {
    return <CompanyCard {...product}/>
  }

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  return (
    <>
      <FlatList
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        numColumns={2}
        contentContainerStyle={styles.container}
        // keyExtractor={(item) => item.id.toString()}
        data={products}
        renderItem={renderProduct}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    marginHorizontal: 8,
  },
});
 