import React, { useCallback, useState, useContext } from 'react';
import { StyleSheet, FlatList, Text, RefreshControl, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Product } from './Product';
import * as Constants from 'expo-constants';
import { getRandomColor, getValueItemAsync } from '../utils/utilitario';
import { CartContext } from '../CartContext';

const API_URL = Constants.default.manifest.extra.API_URL;

export default function Encomenda({ fetchEncomendas, encomendas, onRefresh, refreshing, empty, accountAdmin = false, userIMEI = null }) {

    const [loading, setLoading] = useState(false);
    const { setShowDialog, setVisibleToast } = useContext(CartContext);

    const markAsViewed = async(code_encomenda, setLoadingViewed)=> {
      try {
        let response = await fetch(API_URL + 'encomenda/mark/viewed',
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
          },
          body: JSON.stringify({code: code_encomenda})
        });
        let rjd = await response.json();
        if(rjd.success) {
          onRefresh();
          setVisibleToast({visible: true, message: rjd.message, backgroundColor: 'green'});
        } else {
          setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'});
        }
      } catch (error) {
        setLoadingViewed(false);
        setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});     
      }
    }

    const keyExtractor = (item)=> item.id;

    const renderItemProduct = useCallback(({ item: product }) => {
        let color = getRandomColor(product.code);
        return <Product appearanceColor={color} produto={product} isEncomenda={true} key={product.id} markAsViewed={markAsViewed} accountAdmin={accountAdmin} userIMEI={userIMEI}/>
    }, []);

    return(
        <FlatList
            columnWrapperStyle={{
                justifyContent: "space-between",
            }}
            numColumns={2}
            contentContainerStyle={styles.productsListContainer}
            keyExtractor={keyExtractor}
            renderItem={renderItemProduct}
            data={encomendas}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={refreshing ? <ActivityIndicator style={styles.emptyListStyle} color={'orange'} animating={refreshing}/> : !empty && <FooterComponente loading={loading} setLoading={setLoading} fetchEncomendas={fetchEncomendas}/>}
            ListEmptyComponent={!refreshing && <Text style={[styles.emptyListStyle, {color: 'gray'}]}>Sem encomendas</Text>}
            refreshControl={<RefreshControl colors={['orange']} refreshing={refreshing} onRefresh={onRefresh}/>}/>
        )
}

const FooterComponente = (props) => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={()=> {
                props.setLoading(true);
                props.fetchEncomendas(true).then(()=> props.setLoading(false));
          }
        }
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>{props.loading ? 'A carregar encomendas' : 'Mais encomendas'}</Text>
          {props.loading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    )
  }

const styles = StyleSheet.create({
    productsListContainer: {
        paddingVertical: 8,
        marginHorizontal: 8,
    },
    emptyListStyle: {
        paddingTop: 150,
        textAlign: 'center',
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
});