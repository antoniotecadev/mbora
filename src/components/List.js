import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { currency } from "../utils/utilitario";
import { useNavigation } from "@react-navigation/native";
import { Text as TextUILIB } from "react-native-ui-lib";

const imageProduct = require('../../assets/products/oleo.jpg');

const Item = ({ item }) => {

const navigation = useNavigation();

const showProductDetails = (item)=> {
  navigation.navigate('ProductDetails', { produto: item });
}

return <TouchableOpacity onPress={()=> showProductDetails(item)}>
        <View style={styles.item}>
          <View style={styles.section}>
            <TextUILIB textColor style={{maxWidth: '50%'}}>{item.nome}</TextUILIB>
            <TextUILIB textColor text90 marginT-1 style={{maxWidth: '30%'}}>{currency(String(item.preco))}</TextUILIB>
            <Image style={{width: 45, height: 45, borderRadius: 25}} source= {imageProduct} />
          </View>
          <TextUILIB color="gray" text90>{item.empresa}</TextUILIB>
        </View>
      </TouchableOpacity>
};

const List = ({ empty, searchProduct, loading, setLoading, searchPhrase, setClicked, data }) => {
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
          ListEmptyComponent={<Text style={styles.emptyListStyle}>Produto(s) não encontrado(s)</Text>}
          ListFooterComponent={empty ? null : <FooterComponente loading={loading} setLoading={setLoading} searchProduct={searchProduct} searchPhrase={searchPhrase}/>}
        />
      </View>
    </SafeAreaView>
  );
};

const FooterComponente = (props) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={()=> {
            props.setLoading(true);
            props.searchProduct(props.searchPhrase, true).then(()=> props.setLoading(false));
        }
      }
        style={styles.loadMoreBtn}>
        <Text style={styles.btnText}>{props.loading ? 'A carregar produtos' : 'Mais produtos'}</Text>
        {props.loading ? (
          <ActivityIndicator
            color="white"
            style={{marginLeft: 8}} />
        ) : null}
      </TouchableOpacity>
    </View>
  )
}

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
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyListStyle: {
    color: 'gray',
    paddingTop: 200,
    textAlign: 'center',
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