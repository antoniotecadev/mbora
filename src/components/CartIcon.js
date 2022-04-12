
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { CartContext } from '../CartContext';
import {useServices} from '../services';

export function CartIcon() {
  const {getItemsCount} = useContext(CartContext);
  const {nav, t, api} = useServices();
  return (
    <View style={styles.container}>
      <Text style={styles.text} 
        onPress={() => {
          nav.show('Cart');
        }}
      >Cart ({getItemsCount()})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    backgroundColor: 'orange',
    height: 32,
    padding: 12,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
});
