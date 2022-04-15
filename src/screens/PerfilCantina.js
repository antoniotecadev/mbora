import React, { useEffect, useState, useContext } from 'react';
import {
  Text,
  Image,
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet
} from 'react-native';

import { Button, TabController, Colors } from 'react-native-ui-lib';

const perfilImage = require('../../assets/products/cantina1.jpg');

export default function PerfilCantina({ route }) {

  return (
    <SafeAreaView>
      <ScrollView>
        <Image
          style={styles.image}
          source={perfilImage}
        />
        <Button
          text90
          margin-16
          label="Seguir"
          size={Button.sizes.large}
          borderRadius={5}
          style={{ backgroundColor: Colors.$backgroundSuccessHeavy }}
          iconStyle={{ tintColor: Colors.black }}
        />
        <TabController items={[{ label: 'Produtos' }, { label: 'Promoção' }, { label: 'Seguidores' }]}>
          <TabController.TabBar activeBackgroundColor={'orange'} enableShadows />
          <View flex>
            <TabController.TabPage index={0}><Text>hhhhhh</Text></TabController.TabPage>
            <TabController.TabPage index={1} lazy><Text>oooo</Text></TabController.TabPage>
            <TabController.TabPage index={2} lazy><Text>llllll</Text></TabController.TabPage>
          </View>
        </TabController>
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
