import { isEmpty } from "lodash";
import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity, 
  Text,
  View
} from "react-native";
import { View as ViewUILIB } from "react-native-ui-lib";
import { CartContext } from "../CartContext";
import { AlertDialog } from "../components/AlertDialog";
import List from "../components/List";
import SearchBar from "../components/SearchBar";
import { Entypo } from "@expo/vector-icons";

const SearchProduct = ({navigation}) => {
  const [searchPhrase, setSearchPhrase] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [leastViewed, setLeastViewed] = useState(0);

  const { showDialog, setShowDialog } = useContext(CartContext);

  const searchProduct = async (produto, isMoreProduct) => {
    await getData("http://192.168.18.3/mborasystem-admin/public/api/produtos/mbora/searchproduct/" + String(produto) + '/isMoreProduct/' + isMoreProduct + '/leastViewed/' + leastViewed, isMoreProduct);
  }

  const getData = async (url, isMoreProduct) => {
    setLoading(true);
    try {
      const apiResponse = await fetch(url);
      const rjd = await apiResponse.json();
        if (!isEmpty(rjd)) {
          setEmpty(false);
          if (isMoreProduct) {
              pagination(rjd);
              setData((prevState) => [...prevState, ...rjd]);
          } else {
              pagination(rjd);
              setData(rjd);
          }
      } else {
          setEmpty(true);
      }
    } catch (error) {
        setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});     
    }
  };

  function pagination(rjd) {
    setLeastViewed(Math.min(... rjd.map(e => e.id)));
  }

  useEffect(() => {
    if(searchPhrase) {
        searchProduct(searchPhrase, false).then(()=> setLoading(false));
    } else {
      setEmpty(true);
    } 

    navigation.setOptions({
      headerTitle: () => (
          <SearchBar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            setClicked={setClicked}
          />
      ),
      headerRight: () => (
        clicked && <TouchableOpacity style={{padding: 10}} onPress={() => setSearchPhrase("")}>
          <Entypo name="cross" size={20} color="orange"/>        
        </TouchableOpacity>
      ),
    });

  }, [searchPhrase, clicked]);

  useEffect(useCallback(()=> {
    navigation.getParent()?.setOptions({
        tabBarStyle: {
            display: "none"
        }
    });
    return () => navigation.getParent()?.setOptions({
        tabBarStyle: 'flex'
    });
  }, [navigation]), []);

  return (
    <ViewUILIB bg-bgColor>
    <SafeAreaView style={[styles.root]}>
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      {(
          <List
            empty={empty}
            searchProduct={searchProduct}
            loading={loading}
            setLoading={setLoading}
            searchPhrase={searchPhrase}
            data={data}
            setClicked={setClicked}
          />
      )}
    { loading && <LoadingAnimation/> }
    </SafeAreaView>
    </ViewUILIB>
  );
};

function LoadingAnimation() {
  return (
    <View style={styles.indicatorWrapper}>
      <ActivityIndicator size={'large'} color={'orange'}/>
      <Text style={styles.indicatorText}>Loading...</Text>
    </View>
  );
}

export default SearchProduct;

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    width: "100%",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "10%",
  },
  indicatorWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.6)',
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
    color: 'orange'
  },
});
