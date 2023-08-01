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
import { Feather, AntDesign } from "@expo/vector-icons";


const ItemProduct = ({ item, userTelephone, userName }) => {

const navigation = useNavigation();

const showProductDetails = (item)=> {
  navigation.navigate('ProductDetails', { 
    produto: item,
    userName: userName, 
    userTelephone: userTelephone, 
    screenBack: 'SearchProductCompany' 
  });
}
return <TouchableOpacity onPress={()=> showProductDetails(item)}>
        <View style={styles.item}>
          <View style={styles.section}>
            <TextUILIB textColor style={{maxWidth: '50%'}}>{item.nome}</TextUILIB>
            <TextUILIB textColor text90 marginT-1 style={{maxWidth: '30%'}}>{currency(String(item.preco))}</TextUILIB>
            <Image style={{width: 45, height: 45, borderRadius: 25, resizeMode: 'contain'}} source={{uri: item.urlImage}} />
          </View>
          <TextUILIB color="gray" text100L>{item.empresa}</TextUILIB>
        </View>
      </TouchableOpacity>
};

const ItemCompany = ({ item, searchPhrase }) => {
const navigation = useNavigation();
const showCompanyList = ()=> {
  navigation.navigate({name: 'CompanyList', params: {searchPhrase: searchPhrase}, merge: true});
}
return <TouchableOpacity onPress={()=> showCompanyList()}>
        <View style={styles.item}>
          <View style={styles.section}>
            <View style={styles.section}>
              <Feather name="search" size={15} color={'gray'}/>        
              <TextUILIB marginL-5 textColor>{item.empresa}</TextUILIB>
            </View>
            <AntDesign name="right" color={'gray'} size={15}/>
          </View>
          <TextUILIB marginL-20 color={'gray'} text100L>{item.imei}</TextUILIB>
        </View>
      </TouchableOpacity>
};
// const ItemCompany = ({ item }) => {

// const navigation = useNavigation();

// const showCompanyProfile = (item)=> {
//   navigation.navigate('CompanyProfile', {...item, screenBack: 'SearchProductCompany', isProfileCompany: true});
// }

// return <TouchableOpacity onPress={()=> showCompanyProfile(item)}>
//         <View style={styles.item}>
//           <View style={styles.section}>
//             <TextUILIB textColor style={{maxWidth: '50%'}}>{item.empresa}</TextUILIB>
//             {/* <TextUILIB textColor text90 marginT-1 style={{maxWidth: '30%'}}>-</TextUILIB> */}
//             <Image style={{width: 45, height: 45, borderRadius: 25}} source={imageCompany} />
//           </View>
//           <TextUILIB color="gray" text90>{item.first_name + ' ' + item.last_name}</TextUILIB>
//         </View>
//       </TouchableOpacity>
// };

const List = ({ isCompany, empty, search, loading, setLoading, searchPhrase, data, windowHeight, userName, userTelephone }) => {
  const renderItem = ({ item }) => {
    if(isCompany) {
      return <ItemCompany item={item} searchPhrase={searchPhrase}/>;
    } else {
      return <ItemProduct item={item}  userName={userName} userTelephone={userTelephone}/>;
    }
  };

  return (
    <ViewUILIB style={{height: windowHeight, flex: 1}} bg-bgColor>
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