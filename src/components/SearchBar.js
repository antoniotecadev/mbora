import React, { useRef, useEffect } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Colors } from "react-native-ui-lib";

const SearchBar = ({searchPhrase, setSearchPhrase, setClicked}) => {
  const inputRef = useRef();
    useEffect(() => {
      setTimeout(() => inputRef.current.focus(), 500)
    }, [])
    return (
      <TextInput
        ref={inputRef}
        // onLayout={()=> inputRef.current.focus()} // ANDROID
        style={styles.input}
        keyboardType='web-search'
        placeholder="Pesquisa no Mbora"
        placeholderTextColor='gray'
        value={searchPhrase}
        onChangeText={setSearchPhrase}
        onFocus={()=> setClicked(true)}
        onBlur={()=> setClicked(false)}
      />
  );
};
export default SearchBar;

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    color: Colors.getScheme() === 'dark' ? 'white' : 'black'
  },
});