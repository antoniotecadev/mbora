import React, { useEffect, useState, useCallback, useContext } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { AlertDialog } from '../components/AlertDialog.js';
import { CartContext } from '../CartContext.js';
import { getValueItemAsync } from '../utils/utilitario.js';
import { isEmpty } from 'lodash';
import { Text as TextUILIB, View as ViewUILIB } from 'react-native-ui-lib';

export default function ListFollowers({user, imei, API_URL, setNumberSeguidor}) {

const [follower, setFollower] = useState([]);
const [refreshing, setRefreshing] = useState(false);
const [loading, setLoading] = useState(false);
const { showDialog, setShowDialog} = useContext(CartContext);
const [empty, setEmpty] = useState(false);
const [lastVisible, setLastVisible] = useState(0);

const renderFollowers = ({item}) => {
    return <TouchableOpacity>
            <ViewUILIB bg-bgColor style={styles.item}>
              <View style={styles.section}>
                <Image style={{width: 60, height: 60, borderRadius: 30}} source= {{uri: item.photo_path}} />
                <TextUILIB style={{maxWidth: '80%', alignSelf: 'center'}} textColor text70 marginL-5>{(user.accountAdmin && (imei == item.imei_contact) ? 'Eu - ' : '') + item.first_name + ' ' + item.last_name}</TextUILIB>
              </View>
            </ViewUILIB>
          </TouchableOpacity>
}

const fetchFollowers = useCallback(async(isMoreView) => {
    setLoading(true);
    try {
        let response =  await fetch(API_URL + 'seguidores/mbora/empresa/imei/'+ imei +'/lastVisible/' + lastVisible + '/isMoreView/' + isMoreView,
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
        } else  if (!isEmpty(rjd.seguidor)) {
            setEmpty(false);
            if (isMoreView) {
              pagination(rjd.seguidor);
              setFollower((prevState) => [...prevState, ...rjd.seguidor]);
              if(lastVisible == rjd.idSeguidor){
                setEmpty(true);
              }  
            } else {
              setNumberSeguidor(rjd.numeroSeguidor);
              pagination(rjd.seguidor);
              setFollower(rjd.seguidor);
              if(rjd.numeroSeguidor <= 10){
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
    setLastVisible(Math.min(... rjd.map(s => s.id_table_followers)));
}

  const onRefresh = ()=> {
    setRefreshing(true);
    fetchFollowers(false).then(()=> {
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
                props.fetchFollowers(true).then(()=> props.setLoading(false));
          }
        }
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{props.loading ? 'A carregar seguidores' : 'Ver mais'}</Text>
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
    fetchFollowers(false).then(()=> setLoading(false));
  }, []);

  return (
    <>
      {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
      <FlatList
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.id_table_followers.toString()}
        data={follower}
        renderItem={renderFollowers}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={loading ? <ActivityIndicator style={styles.emptyListStyle} color={'orange'} animating={loading}/> : !empty && <FooterComponent loading={loading} setLoading={setLoading} fetchFollowers={fetchFollowers}/>}
        ListEmptyComponent={!loading && <Text style={[styles.emptyListStyle, {color: 'gray'}]}>Sem seguidores</Text>}
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
  },
  item: {
    marginRight: 16,
    marginLeft: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey"
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }
});
 