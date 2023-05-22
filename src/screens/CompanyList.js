import React, { useEffect, useState, useCallback, useContext } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { CompanyCard } from '../components/CompanyCard.js';
import { AlertDialog } from '../components/AlertDialog.js';
import { CartContext } from '../CartContext.js';
import {Ionicons} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useStores } from '../stores';
import { getAppearenceColor, getValueItemAsync } from '../utils/utilitario.js';
import { isEmpty } from 'lodash';
import * as Constants from 'expo-constants';

const API_URL = Constants.default.manifest.extra.API_URL;

export default function CompanyList({route, navigation}) {

  const {ui} = useStores();
  let color = getAppearenceColor(ui.appearanceName); 

  function renderCompany({ item: company }) {
    return <CompanyCard {...company} appearanceColor={color} screenBack={'CompanyList'}/>
  }

  const [company, setCompany] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [leastViewed, setLeastViewed] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [emptyCompany, setEmptyCompany] = useState(false);
  const [loading, setLoading] = useState({fetch: false, search: false});
  const { showDialog, setShowDialog} = useContext(CartContext);

  const searchCompany = async(isMore, searchPhrase)=> {
    try {
        let response =  await fetch(API_URL + "empresas/mbora/searchcompany/search/" + searchPhrase + '/isMoreCompany/' + isMore + '/leastViewed/' + leastViewed,
        {
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
            }
        });
        let rjd = await response.json();
        if  (!rjd.success && rjd.message == 'Autenticação') {
          setShowDialog({visible: true, title: rjd.message, message: rjd.data.message, color: 'orange'});
        } else  if (!isEmpty(rjd)) {
          setIsSearch(true);
          setEmptyCompany(false);
          if (isMore) {
            pagination(rjd);
            setCompany((prevState) => [...prevState, ...rjd]);
          } else {
            pagination(rjd);
            setCompany(rjd);
          }
        } else {
            setEmptyCompany(true);
        }
    } catch (error) {
        setRefreshing(false);
        setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
    }
  };

  function pagination(rjd) {
    setLeastViewed(Math.min(... rjd.map(c => c.id)));
  }

  const fetchCompanys = useCallback(async(isRefresh) => {
    setLoading({fetch: true});
    try {
      let response =  await fetch(API_URL + 'empresas/mbora', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
        }
      });
      let responseJsonData = await response.json();
      if(!isEmpty(responseJsonData)){
        setIsSearch(false);
        setEmptyCompany(false);
        if(isRefresh) {
          setCompany(responseJsonData);
        } else {
          setCompany((prevState) => [...prevState, ...responseJsonData]);
        }
      } else {
        setEmptyCompany(true);
      }
    } catch (error) {
      setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
    }
  }, []);

  const onRefresh = ()=> {
    setRefreshing(true);
    fetchCompanys(true).then(()=> {
      setLoading({fetch: false});
      setRefreshing(false);
    });
  };

  const FooterComponente = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={()=> fetchCompanys(false).then(()=> setLoading({fetch: false}))}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{loading.fetch ? 'A carregar empresas': 'Ver mais'}</Text>
          {loading.fetch ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: ()=> (
        <TouchableOpacity onPress={()=> navigation.navigate('SearchProductCompany', {isCompany: true})}>
          <Ionicons name={'search'} size={30} color="orange"/>
        </TouchableOpacity>
      )
    })
    fetchCompanys(true).then(()=> setLoading({fetch: false}));
  }, []);

  useFocusEffect(useCallback(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: 'flex'
    });
  }, [navigation]));

  useEffect(() => {
    if (route.params?.id || route.params?.estado) {
      setCompany((prevCompany) => {
          return prevCompany.map((company) => {
            if(company.id == route.params.id) {
              company.estado = route.params.estado;
              company.followers_number = route.params.numberSeguidor;
            }
            return company;
          });
      });
    }
  }, [route.params?.id, route.params?.estado]);

  useEffect(() => {
    if (route.params?.searchPhrase) {
      setLoading({search: true});
      searchCompany(false, route.params.searchPhrase).then(()=> setLoading({search: false}));
    }
  }, [route.params?.searchPhrase]);

  return (
    <>
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      <FlatList
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        numColumns={2}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.id.toString()}
        data={company}
        renderItem={renderCompany}
        ListFooterComponent={(!emptyCompany && !isSearch) && FooterComponente}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading.fetch && <Text style={styles.emptyListStyle}>Sem empresas</Text>}
        refreshControl={<RefreshControl colors={['orange']} refreshing={refreshing} onRefresh={onRefresh}/>}
      />
      {loading.search && <LoadingAnimation/>}
    </>
  );
}

function LoadingAnimation() {
  return (
    <View style={styles.indicatorWrapper}>
      <ActivityIndicator size={'large'} color={'orange'}/>
      <Text style={styles.indicatorText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    marginHorizontal: 8,
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
  emptyListStyle: {
    color: 'gray',
    paddingTop: 150,
    textAlign: 'center',
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
  }
});
 