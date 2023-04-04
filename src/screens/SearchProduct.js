import { isEmpty } from "lodash";
import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { View as ViewUILIB } from "react-native-ui-lib";
import { CartContext } from "../CartContext";
import { AlertDialog } from "../components/AlertDialog";
import List from "../components/List";
import SearchBar from "../components/SearchBar";

const SearchProduct = () => {
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
  }, [searchPhrase]);

  return (
    <ViewUILIB bg-bgColor>
    <SafeAreaView style={[styles.root]}>
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      {!clicked && <Text style={styles.title}></Text>}
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />
      <ActivityIndicator animating={loading} />
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
    </SafeAreaView>
    </ViewUILIB>
  );
};

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
});
// "https://my-json-server.typicode.com/kevintomas1995/logRocket_searchBar/languages"
