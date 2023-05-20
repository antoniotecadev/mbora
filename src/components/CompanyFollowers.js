import React, { useEffect, useState, useCallback, useContext } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { CompanyCard } from '../components/CompanyCard.js';
import { AlertDialog } from '../components/AlertDialog.js';
import { CartContext } from '../CartContext.js';
import { useStores } from '../stores';
import { getAppearenceColor, getValueItemAsync } from '../utils/utilitario.js';
import { isEmpty } from 'lodash';

export default function CompanyFollowers({route, navigation, user, URL, setNumberEmpresaAseguir}) {

  const {ui} = useStores();
  let color = getAppearenceColor(ui.appearanceName); 

  function renderCompany({ item: company }) {
    return <CompanyCard {...company} appearanceColor={color} screenBack={'Profile'}/>
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
        } else  if (!isEmpty(rjd.empresa)) {
            setEmpty(false);
            if (isMoreView) {
              pagination(rjd.empresa);
              setCompany((prevState) => [...prevState, ...rjd.empresa]);
              if(lastVisible == rjd.idEmpresaAseguirPaginacao){
                setEmpty(true);
              }  
            } else {
              setNumberEmpresaAseguir(rjd.numeroEmpresasAseguir);
              pagination(rjd.empresa);
              setCompany(rjd.empresa);
              if(rjd.numeroEmpresasAseguir <= 10){
                  setEmpty(true);
              } 
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
        ListFooterComponent={loading ? <ActivityIndicator style={styles.emptyListStyle} color={'orange'} animating={loading}/> : !empty && <FooterComponent loading={loading} setLoading={setLoading} fetchCompanys={fetchCompanys}/>}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && <Text style={[styles.emptyListStyle, {color: 'gray'}]}>Sem empresas a seguir</Text>}
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
    paddingTop: 150,
    textAlign: 'center',
  }
});
 