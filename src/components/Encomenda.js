import React, { useCallback, useState } from 'react';
import { StyleSheet, FlatList, Text, RefreshControl, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Product } from './Product';
import { getRandomColor } from '../utils/utilitario';

export default function Encomenda({ fetchEncomendas, encomendas, onRefresh, refreshing, empty }) {

    const [loading, setLoading] = useState(false);

    const keyExtractor = (item)=> item.id;

    const renderItemProduct = useCallback(({ item: product }) => {
        let color = getRandomColor(product.code);
        return <Product appearanceColor={color} produto={product} isEncomenda={true} key={product.id} />
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