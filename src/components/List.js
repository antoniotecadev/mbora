import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { currency } from "../utils/utilitario";
import { useNavigation } from "@react-navigation/native";
import { Text as TextUILIB, View as ViewUILIB } from "react-native-ui-lib";

const imageCompany = require('../../assets/products/cantina2.jpg');
const imageProduct = require('../../assets/products/oleo.jpg');

const ItemProduct = ({ item, userTelephone }) => {

const navigation = useNavigation();

const showProductDetails = (item)=> {
  navigation.navigate('ProductDetails', { produto: item, userTelephone: userTelephone, screenBack: 'SearchProductCompany' });
}

return <TouchableOpacity onPress={()=> showProductDetails(item)}>
        <View style={styles.item}>
          <View style={styles.section}>
            <TextUILIB textColor style={{maxWidth: '50%'}}>{item.nome}</TextUILIB>
            <TextUILIB textColor text90 marginT-1 style={{maxWidth: '30%'}}>{currency(String(item.preco))}</TextUILIB>
            <Image style={{width: 45, height: 45, borderRadius: 25}} source={imageProduct} />
          </View>
          <TextUILIB color="gray" text90>{item.empresa}</TextUILIB>
        </View>
      </TouchableOpacity>
};

const ItemCompany = ({ item }) => {

const navigation = useNavigation();

const showCompanyProfile = (item)=> {
  navigation.navigate('CompanyProfile', {...item, screenBack: 'SearchProductCompany', isProfileCompany: true});
}

return <TouchableOpacity onPress={()=> showCompanyProfile(item)}>
        <View style={styles.item}>
          <View style={styles.section}>
            <TextUILIB textColor style={{maxWidth: '50%'}}>{item.empresa}</TextUILIB>
            {/* <TextUILIB textColor text90 marginT-1 style={{maxWidth: '30%'}}>-</TextUILIB> */}
            <Image style={{width: 45, height: 45, borderRadius: 25}} source={imageCompany} />
          </View>
          <TextUILIB color="gray" text90>{item.first_name + ' ' + item.last_name}</TextUILIB>
        </View>
      </TouchableOpacity>
};

const List = ({ isCompany, empty, search, loading, setLoading, searchPhrase, data, windowHeight, userTelephone }) => {
  const renderItem = ({ item }) => {
    if(isCompany) {
      return <ItemCompany item={item} />;
    } else {
      return <ItemProduct item={item} userTelephone={userTelephone} />;
    }
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
    <ViewUILIB flex style={{height: windowHeight}} bg-bgColor>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyListStyle}>{isCompany ? 'Empresas(s) não encontrada(s)' : 'Produto(s) não encontrado(s)'}</Text>}
        ListFooterComponent={empty ? null : <FooterComponente isCompany={isCompany} loading={loading} setLoading={setLoading} search={search} searchPhrase={searchPhrase}/>}
      />
    </ViewUILIB>
  );
};

const FooterComponente = (props) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={()=> {
            props.setLoading(true);
            props.search(props.searchPhrase, true).then(()=> props.setLoading(false));
        }
      }
        style={styles.loadMoreBtn}>
        <Text style={styles.btnText}>{props.loading ? `A carregar ${props.isCompany ? 'empresas' : 'produtos'}` : 'Ver mais'}</Text>
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
    textAlign: 'center',
    marginVertical: 250
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