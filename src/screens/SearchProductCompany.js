import { isEmpty } from "lodash";
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity, 
  Text,
  View,
  Dimensions
} from "react-native";
import { CartContext } from "../CartContext";
import { AlertDialog } from "../components/AlertDialog";
import List from "../components/List";
import SearchBar from "../components/SearchBar";
import { Entypo, Feather } from "@expo/vector-icons";
import { useHeaderHeight } from '@react-navigation/elements';
import { useStores } from "../stores";

const SearchProductCompany = ({route, navigation}) => {

  const { isCompany } = route.params;
  const {user} = useStores();
  const inputRef = useRef();
  const headerHeight = useHeaderHeight();
  const { width, height } = Dimensions.get('window');

  const [searchPhrase, setSearchPhrase] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [leastViewed, setLeastViewed] = useState(0);

  const { showDialog, setShowDialog } = useContext(CartContext);

  const search = async(name, isMore) => {
    if(isCompany){
      await getData("http://192.168.18.3/mborasystem-admin/public/api/empresas/mbora/searchcompany/" + String(name) + '/isMoreCompany/' + isMore + '/leastViewed/' + leastViewed, isMore);
    } else {
      await getData("http://192.168.18.3/mborasystem-admin/public/api/produtos/mbora/searchproduct/" + String(name) + '/isMoreProduct/' + isMore + '/leastViewed/' + leastViewed, isMore);
    }
  }

  const getData = async (url, isMore) => {
    setLoading(true);
    try {
      const apiResponse = await fetch(url);
      const rjd = await apiResponse.json();
        if (!isEmpty(rjd)) {
          setEmpty(false);
          if (isMore) {
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
        search(searchPhrase, false).then(()=> setLoading(false));
    } else {
      setEmpty(true);
      setData([]);
    } 
    navigation.setOptions({
      headerTitle: () => (
          <SearchBar
            isCompany={isCompany}
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            setClicked={setClicked}
            inputRef={inputRef}
            windowWidth={width}
            headerHeight={headerHeight}
          />
      )
    });
  }, [searchPhrase])
  
  useEffect(()=> {
    navigation.setOptions({
      headerRight: () => (
        clicked ? <TouchableOpacity style={{padding: 10}} 
          onPress={() => {
            setSearchPhrase("");
            inputRef.current.clear();
          }}>
          <Entypo name="cross" size={20} color="orange"/>        
        </TouchableOpacity>
        :
        <TouchableOpacity style={{padding: 10}} 
          onPress={() => {
            inputRef.current.focus();
          }}>
          <Feather name="search" size={20} color="orange"/>        
        </TouchableOpacity>
      ),
    });
  }, [clicked]);

  useEffect(()=> {
    navigation.getParent()?.setOptions({
        tabBarStyle: {
            display: "none"
        }
    });
  }, []);

  return (
      <>
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      {(
          <List
            isCompany={isCompany}
            empty={empty}
            search={search}
            loading={loading}
            setLoading={setLoading}
            searchPhrase={searchPhrase}
            data={data}
            windowHeight={height}
            userTelephone={user.userTelephone}
          />
      )}
    { loading && <LoadingAnimation/> }
    </>
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

export default SearchProductCompany;

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(100, 100, 100, 0.1)',
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
    color: 'orange'
  },
});
