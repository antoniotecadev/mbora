import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import List from "../components/List";
import SearchBar from "../components/SearchBar";

const SearchProduct = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [fakeData, setFakeData] = useState();
  useEffect(() => {
    const getData = async () => {
      const apiResponse = await fetch("http://192.168.18.3/mborasystem-admin/public/api/produtos/mbora/index/json");
      const data = await apiResponse.json();
      setFakeData(data);
    };
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      {!clicked && <Text style={styles.title}></Text>}
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />
      {(
          <List
            searchPhrase={searchPhrase}
            data={fakeData}
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
