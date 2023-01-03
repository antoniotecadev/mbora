import React, {useEffect, useState, useContext} from 'react';
import {
  Text, 
  Image, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Button, 
  StyleSheet
  } from 'react-native';

import { CartContext } from '../CartContext';
import { currency } from '../utils/utilitario';

import firebase from '../services/firebase';
import { ref, child, get } from "firebase/database";

export function ProductDetails({route}) {
  const { produto } = route.params;
  const [product, setProduct] = useState({});
  const [parceiro, setParceiro] = useState([]);
  const { addItemToCart } = useContext(CartContext);
  
  useEffect(() => {
    setProduct(produto); 
    const dbRef = ref(firebase);
    get(child(dbRef, `parceiros/${produto.imei}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setParceiro(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  
  return () => ref(firebase, `parceiros/${produto.imei}`).off();
  },[]);
  
  function onAddToCart() {
    // addItemToCart(product.id);
  }
  
  return (
    <SafeAreaView>
      <ScrollView>
      {/* <Text style = {{color: 'white'}}>{JSON.stringify(parceiro) + ''+parceiro.bairro}</Text> */}
        <Image
          style={styles.image}
          source={{ uri: product.urlImage}}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.nome}</Text>
          <Text style={styles.price}>{currency(String(product.preco))}</Text>
          <Text style={styles.description}>{product.categoria}</Text>
            <Button
            onPress={onAddToCart}
            title="Add to cart"
            / >
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#787878',
    marginBottom: 16,
  },
});
