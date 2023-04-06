import React from "react";
import { StyleSheet, TextInput, View, Keyboard, TouchableOpacity, Text, KeyboardAvoidingView, Platform} from "react-native";
import { Feather, Entypo, Ionicons } from "@expo/vector-icons";

const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked, backHome}) => {
    return (
      // <View style={[styles.container, {marginTop: clicked ? (Platform.OS === 'ios' ? undefined : 35) : undefined}]}>
      <View style={styles.container}>
        <Ionicons
            name="chevron-back"
            size={30}
            color="orange"
            style={{paddingRight: 10}}
            onPress={()=> backHome()}
          />
        <View style={styles.searchBar__unclicked}>
          {/* search Icon */}
          <Feather
            name="search"
            size={15}
            color="black"
            style={{ marginLeft: 1 }}
          />
          {/* Input field */}
            <TextInput
              autoFocus
              style={styles.input}
              placeholder="Pesquisa no Mbora"
              placeholderTextColor='gray'
              value={searchPhrase}
              onChangeText={setSearchPhrase}
              onFocus={() => {
                setClicked(true);
              }}
            />
          {/* cross Icon, depending on whether the search bar is clicked or not */}
          {clicked && (
            <Entypo name="cross" size={20} color="black" onPress={() => {
              setSearchPhrase("")
            }}/>
            )}
        </View>
        {/* cancel button, depending on whether the search bar is clicked or not */}
        {/* {clicked && (
          <View>
          <TouchableOpacity style={{padding: 10, marginTop: Platform.OS === 'ios' ? 0 : 40}}
          onPress={() => {
            Keyboard.dismiss();
            setClicked(false);
          }}>
          <Text style={{color: Colors.blue10}}>Cancelar</Text>
          </TouchableOpacity>
          </View>
        )} */}
      </View>
  );
};
export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  searchBar__unclicked: {
    padding: 5,
    flexDirection: "row",
    width: "85%",
    backgroundColor: "#d9dbda",
    borderRadius: 5,
    alignItems: "center",
  },
  searchBar__clicked: {
    marginTop: Platform.OS === 'ios' ? 0 : 40,
    padding: 5,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    width: "85%",
    fontSize: 16,
    marginRight: 15
  },
});