import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import List from "../components/List";
import SearchBar from "../components/SearchBar";

const SearchProduct = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const searchProduct = (produto) => {
    getData("http://192.168.18.3/mborasystem-admin/public/api/produtos/mbora/searchproduct/" + String(produto));
  }

  const getData = async (url) => {
    setLoading(true);
    try {
    const apiResponse = await fetch(url);
    const responseJsonData = await apiResponse.json();
    setData(responseJsonData);
    } catch (error) {
        Alert.alert(error.message);
    }finally{
        setLoading(false);
    }
  };

  useEffect(() => {
    if(searchPhrase) {
        searchProduct(searchPhrase);
    } 
  }, [searchPhrase]);

  return (
    <SafeAreaView style={styles.root}>
      {!clicked && <Text style={styles.title}></Text>}
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />
      {loading ? <ActivityIndicator /> : null}
      {(
          <List
            searchPhrase={searchPhrase}
            data={data}
            setClicked={setClicked}
          />
      )}
    </SafeAreaView>
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
