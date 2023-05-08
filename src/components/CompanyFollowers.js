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
import { deleteItemAsync } from 'expo-secure-store';

export default function CompanyFollowers({route, navigation, user, URL, setNumberEmpresaAseguir}) {

  const {ui} = useStores();
  let color = getAppearenceColor(ui.appearanceName); 

  function renderCompany({ item: company }) {
    return <CompanyCard {...company} appearanceName={color} screenBack={'Profile'}/>
  }

  const [company, setCompany] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showDialog, setShowDialog} = useContext(CartContext);
  const [empty, setEmpty] = useState(false);
  const [lastVisible, setLastVisible] = useState(0);

  const fetchCompanys = useCallback(async (isMoreView) => {
    setLoading(true);
    try {
        let response =  await fetch(URL + 'empresas/mbora/aseguir/lastVisible/' + lastVisible + '/isMoreView/' + isMoreView,
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
            await deleteItemAsync('token');
            user.setAuth(false);
        } else  if (!isEmpty(rjd.empresa)) {
            setEmpty(false);
            if (isMoreView) {
                pagination(rjd.empresa);
                setCompany((prevState) => [...prevState, ...rjd.empresa]);
            } else {
                setNumberEmpresaAseguir(rjd.numeroEmpresasAseguir);
                pagination(rjd.empresa);
                setCompany(rjd.empresa);
            }
        } else {
            setEmpty(true);
        }
    } catch (error) {
        setRefreshing(false);
        setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
    }
}, [lastVisible]);

function pagination(rjd) {
    setLastVisible(Math.min(... rjd.map(c => c.id_table_followers)));
}

  const onRefresh = ()=> {
    setRefreshing(true);
    fetchCompanys(false).then(()=> {
      setLoading(false);
      setRefreshing(false);
    });
  };

  const FooterComponent = (props) => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={()=> {
                props.setLoading(true);
                props.fetchCompanys(true).then(()=> props.setLoading(false));
          }
        }
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{props.loading ? 'A carregar empresas' : 'Ver mais'}</Text>
          {props.loading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    fetchCompanys(false).then(()=> setLoading(false));
  }, []);

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
        ListFooterComponent={empty || refreshing ? null : <FooterComponent loading={loading} setLoading={setLoading} fetchCompanys={fetchCompanys}/>}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyListStyle}>Sem empresas a seguir</Text>}
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
 