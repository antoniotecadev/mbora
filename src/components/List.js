import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity
} from "react-native";
import { currency } from "../utils/utilitario";
import { useNavigation } from "@react-navigation/native"

const imageProduct = require('../../assets/products/oleo.jpg');

const Item = ({ item }) => {

const navigation = useNavigation();

const showProductDetails = (item)=> {
  navigation.navigate('ProductDetails', { produto: item });
}

return <TouchableOpacity onPress={()=> showProductDetails(item)}>
        <View style={styles.item}>
          <View style={styles.section}>
          <Text style={styles.title}>{item.nome}</Text>
            <Image style={{width: 50, height: 50, borderRadius: 25}} source= {imageProduct} />
          </View>
          <Text style={{color: 'green'}}>{currency(String(item.preco))}</Text>
        </View>
      </TouchableOpacity>
};

const List = ({ searchPhrase, setClicked, data }) => {
  const renderItem = ({ item }) => {
    return <Item item={item} />;
    // if (searchPhrase === "") {
      // return <Item item={item} />;
    // }
    // if (item.nome.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
    //   return <Item item={item} />;
    // }
    // if (item.empresa.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
    //   return <Item item={item}/>;
    // }
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
          ListEmptyComponent={<Text style={styles.emptyListStyle}>Produto não encontrado</Text>}
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
  emptyListStyle: {
    color: '#df4759',
    padding: 10,
    textAlign: 'center',
  }
});