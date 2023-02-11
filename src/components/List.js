import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image
} from "react-native";
import { currency } from "../utils/utilitario";

const imageProduct = require('../../assets/products/oleo.jpg');


// definition of the Item, which will be rendered in the FlatList
const Item = ({ name, price }) => (
  <View style={styles.item}>
    <View style={styles.section}>
    <Text style={styles.title}>{name}</Text>
      <Image style={{width: 50, height: 50, borderRadius: 25}} source= {imageProduct} />
    </View>
    <Text style={{color: 'green'}}>{currency(String(price))}</Text>
  </View>
);

// the filter
const List = ({ searchPhrase, setClicked, data }) => {
  const renderItem = ({ item }) => {
    // when no input, show all
    if (searchPhrase === "") {
      return <Item name={item.nome} price={item.preco} />;
    }
    // filter of the name
    if (item.nome.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
      return <Item name={item.nome} price={item.preco} />;
    }
    // filter of the description
    if (item.empresa.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
      return <Item name={item.nome} price={item.preco} />;
    }
  };

  return (
    <SafeAreaView style={styles.list__container}>
      <View
        onStartShouldSetResponder={() => {
          setClicked(false);
        }}
      >
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default List;

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: "85%",
    width: "100%",
  },
  item: {
    marginRight: 25,
    marginLeft: 25,
    marginTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  title: {
    fontSize: 18,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});