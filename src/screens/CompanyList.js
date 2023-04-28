import React, { useEffect, useState, useCallback, useContext } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { CompanyCard } from '../components/CompanyCard.js';
import { AlertDialog } from '../components/AlertDialog.js';
import { CartContext } from '../CartContext.js';
import {Ionicons} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useStores } from '../stores';
import { getAppearenceColor } from '../utils/utilitario.js';

export default function CompanyList({navigation}) {

  const {ui} = useStores();
  let color = getAppearenceColor(ui.appearanceName); 

  function renderCompany({ item: company }) {
    return <CompanyCard {...company} appearanceName={color}/>
  }

  const [company, setCompany] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState({cpn: false});
  const { showDialog, setShowDialog} = useContext(CartContext);

  const fetchCompanys = useCallback(async(isRefresh) => {
    setLoading({cpn: true});
    try {
      let response =  await fetch('http://192.168.18.3/mborasystem-admin/public/api/empresas/mbora');
      let responseJsonData = await response.json();
      
      if(isRefresh) {
        setCompany(responseJsonData);
      } else {
        setCompany((prevState) => [...prevState, ...responseJsonData]);
      }
    } catch (error) {
      setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'})
    }
  }, []);

  const onRefresh = ()=> {
    setRefreshing(true);
    fetchCompanys(true).then(()=> {
      setLoading({cpn: false});
      setRefreshing(false);
    });
  };

  const FooterComponente = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={()=> fetchCompanys(false).then(()=> { setLoading({cpn: false}) })}
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{loading.cpn ? 'A carregar empresas': 'Ver mais'}</Text>
          {loading.cpn ? (
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
    fetchCompanys(true).then(()=> setLoading({cpn: false}));
  }, []);

  useFocusEffect(useCallback(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: 'flex'
    });
  }, [navigation])
  );

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
        ListFooterComponent={FooterComponente}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyListStyle}>Sem empresas</Text>}
        refreshControl={<RefreshControl colors={['orange']} refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </>
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
  }
});
 