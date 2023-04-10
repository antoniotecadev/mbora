import React, { useEffect } from "react";
import { StyleSheet, TextInput, Dimensions } from "react-native";
import { Colors } from "react-native-ui-lib";
import { useHeaderHeight } from '@react-navigation/elements';

const SearchBar = ({searchPhrase, setSearchPhrase, setClicked, inputRef}) => {
  const headerHeight = useHeaderHeight();
  const { width } = Dimensions.get('window');
  useEffect(() => {
    setTimeout(() => inputRef.current.focus(), 500);
  }, [])
  return (
    <TextInput
      ref={inputRef}
      style={[styles.input, {width: (width/2) + headerHeight, height: headerHeight/2}]}
      keyboardType='web-search'
      placeholder="Pesquisa no Mbora"
      placeholderTextColor='gray'
      value={searchPhrase}
      onChangeText={setSearchPhrase}
      onFocus={()=> setClicked(true)}
      onBlur={()=> setClicked(false)}
      // clearButtonMode="always" // IOS
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