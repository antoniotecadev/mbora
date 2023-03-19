import React, { useCallback } from 'react';
import { StyleSheet, FlatList, Text, RefreshControl } from 'react-native';
import { Product } from './Product';
import ToastMessage from './ToastMessage';
import { useStores } from '../stores';

export default function Encomenda({ encomendas, onRefresh, refreshing }) {

    const {ui} = useStores();

    const keyExtractor = (item)=> item.id;

    const renderItemProduct = useCallback(({ item: product }) => { 
        return <Product appearanceName={ui.appearanceName} produto={product} isEncomenda={true} key={product.id} />
    }, []);

    return(
        <>
            <ToastMessage />
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
                ListEmptyComponent={<Text style={styles.emptyListStyle}>Sem encomendas</Text>}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=> onRefresh(0)}/>} />
         </>
        )
}

const styles = StyleSheet.create({
    productsListContainer: {
        paddingVertical: 8,
        marginHorizontal: 8,
    },
    emptyListStyle: {
        color: 'gray',
        paddingTop: 150,
        textAlign: 'center',
    },
});