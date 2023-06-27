import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Share, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Card, Colors, Avatar, Typography, ExpandableSection, Text as TextUILIB } from 'react-native-ui-lib';
import { currency, numberFollowersAndViewsFormat } from '../utils/utilitario';
import {Image as ImageCache} from 'react-native-expo-image-cache';
import { CartContext } from '../CartContext';
import { AlertDialog } from './AlertDialog';
import { AntDesign } from "@expo/vector-icons";

export function Product({appearanceColor, isEncomenda = false, isFavorite = false, removeFavorite, produto, userName = null, userTelephone = null, onPress, markAsAnswered, accountAdmin, userIMEI, deleteProductService } ) {
  
  const isAdmin = (accountAdmin && (userIMEI == produto.imei));

  const { addItemToCart, encomendar } = useContext(CartContext);
  const [top] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingAnswered, setLoadingAnswered] = useState(false);

  const clientData = isEncomenda ? 'Cliente: ' + produto.first_name + ' ' +  produto.last_name + '\n' +'Email: ' + produto.email : '';

  function onExpand() {
    setExpanded(!expanded);
  }

  const encomendarProduct = async (clientData)=> {
    await encomendar(setLoading, [produto.imei], [produto.id], [produto.nome], [1], clientData)
    .then(()=> {
      setLoading(false)
      setShowDialog(false);
    });
  }

  const deleteProduct = () =>
    Alert.alert('Eliminar ' + produto.nome, 'Este produto ou serviço pode estar associado a uma encomenda, tem certeza que quer eliminar?', [
      {
        text: 'Sim',
        onPress: () => {
          setLoadingDelete(true);
          deleteProductService(produto.id, produto.nome, produto.imei, setLoadingDelete).then(()=> setLoadingDelete(false));
        },
        style: 'destructive',
      },
      {
        text: 'Cancelar',
        style: 'cancel',
      },
    ]);

  const preview = { uri: "data:image/png;base64,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" };
  const uri = "https://firebasestorage.googleapis.com/v0/b/react-native-e.appspot.com/o/b47b03a1e22e3f1fd884b5252de1e64a06a14126.png?alt=media&token=d636c423-3d94-440f-90c1-57c4de921641";
  // const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
  {/* <Card.Image style={styles.thumb} source={{ uri: urlImage }} /> */}
  {/* <Card.Image style={styles.thumb} source= {imageBackground} /> */}
  return (
    <>
    {showDialog &&
    <AlertDialog 
      showDialog={showDialog} 
      setShowDialog={setShowDialog} 
      titulo={'Encomenda'} 
      mensagem={'Empresa: ' + produto.empresa + '\n' +'Produto: ' + produto.nome + '\n' + 'Preço: ' + currency(String(produto.preco)) + '\n' + clientData} 
      cor={'green'} 
      isEncomenda={true}
      userTelephone={userTelephone || produto.client_phone}
      clientAddress={produto.client_address}
      moreDetails={produto.client_info_ad}
      isDetailsEncomenda={isEncomenda}
      clientName={userName || produto.first_name + ' ' +  produto.last_name}
      clientCoordinate={produto.client_coordinate}
      companyName={produto.empresa}
      companyCoordinate={produto.company_coordinate}
      clientOrcompanyPhoto={produto.photo_path}
      onPress={encomendarProduct}
      />}
    <Card style={[styles.card, {backgroundColor: appearanceColor, shadowColor: Colors.getScheme() === 'light' ? Colors.dmBlack : 'white'}]} center onPress={isEncomenda ? ()=> setShowDialog(true) : onPress}>
    <ImageCache style={styles.thumb} {...{preview, uri}}/>
      <ExpandableSection
        top={top}
        expanded={expanded}
        sectionHeader={HeaderElement(produto.code, produto.nome, produto.preco, isEncomenda, produto.prod_quant, produto.estado, produto.imei, produto.created_at, markAsAnswered, accountAdmin, userIMEI, loadingAnswered, setLoadingAnswered)}
        onPress={() => onExpand()}
      >
        <View maxWidth={180}>
          <View center>
            {isEncomenda || isAdmin ?
            !isEncomenda && (loadingDelete ? <ActivityIndicator style={{alignItems: 'left'}} color={'orangered'} /> : <AntDesign name='delete' size={20} color='orangered' onPress={()=> deleteProduct()}/>)
            : 
            <>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: 'orange' }]} 
                onPress={()=> addItemToCart(produto, produto.nome + ' adicionado ao carrinho.', 'green')}>
                <Text style={styles.textButton}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>

            {loading ? <ActivityIndicator /> :
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: 'green' }]} 
              onPress={()=> setShowDialog(true)}>
              <Text style={styles.textButton}>Encomendar Agora</Text>
            </TouchableOpacity>}</>}

            {isFavorite && 
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: 'orangered' }]} 
              onPress={removeFavorite}>
              <Text style={styles.textButton}>Remover</Text>
            </TouchableOpacity>}
            {!isAdmin && 
            <>
              <View style={[styles.section, {marginVertical: 8}]}>
                <TextUILIB textColor style={{ ...Typography.text90 }}>{produto.empresa}</TextUILIB>
                <Avatar source={{ uri: 'https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg' }}
                  size={20}
                  animate={false}
                  badgeProps={{ size: 6, borderWidth: 0, backgroundColor: Colors.$backgroundSuccessHeavy }}
                />
              </View>
              <Text style={{ marginBottom: 8, color: Colors.grey30, fontSize: 10 }}>
                {`${produto.nomeProvincia}, ${produto.district} , ${produto.street}`}
              </Text>
            </>}
            <Text style={{ marginBottom: 8, color: Colors.grey40, fontSize: 10 }}>{numberFollowersAndViewsFormat(produto.visualizacao, 'youtube')} {produto.visualizacao > 1 ? 'visualizações' : 'visualização'}</Text>
          </View>
        </View>
      </ExpandableSection>
    </Card>
    </>
  );
}

const HeaderElement = (code_encomenda, nome, preco, isEncomenda, prod_quant, estado, imei, data_cria, markAsAnswered, accountAdmin, userIMEI, loading, setLoading) => {
  return (
    <View spread row maxWidth={180}>
      <TextUILIB textColor>
        {nome}
      </TextUILIB>
      <Text style={{ color: Colors.green10, marginBottom: 4 }}>
        {currency(String(preco))}
      </Text>
      {isEncomenda && 
      <>
        <View style={styles.section}>
          <TextUILIB textColor text100M>Código: </TextUILIB>
          <TextUILIB color='gray' text100M>{code_encomenda}</TextUILIB>
        </View>
        <View style={styles.section}>
          <TextUILIB textColor text100M>Quantidade: </TextUILIB>
          <TextUILIB color='gray' text100M>{prod_quant}</TextUILIB>
        </View>
        {estado == false && accountAdmin && (userIMEI == imei) ? 
        (loading ? <ActivityIndicator color={'green'} size={'small'}/> :
        (<TouchableOpacity 
          style={[styles.buttonSmall, {backgroundColor: 'green',}]} 
          onPress={() => {
            setLoading(true); 
            markAsAnswered(code_encomenda, setLoading).then(()=> setLoading(false));
        }}>
          <Text style={styles.textButtonSmall}>
            Marcar como atendida
          </Text>
        </TouchableOpacity>))
        :
        <View style={styles.section}>
          <TextUILIB textColor text100M>Estado:</TextUILIB>
          {estado == true ? 
          <TextUILIB color='green' text100M> atendida</TextUILIB> 
          :
          <TextUILIB color='orangered' text100M> não atendida</TextUILIB>}
        </View>}
        <TextUILIB color='gray' marginB-4 f text100M>{data_cria}</TextUILIB>
      </>}
    </View>
  );
} 

const styles = StyleSheet.create({
  card: {
    width: '49%',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    marginVertical: 5,
  },
  thumb: {
    height: 210,
    resizeMode: 'contain',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    alignSelf: 'center'
  },
  button: {
    borderRadius: 10, 
    marginBottom: 5, 
    paddingVertical: 8,
    paddingHorizontal: 20
  },
  textButton: { 
    color: 'white', 
    textAlign: 'center' 
  },
  buttonSmall: {
    padding: 5,  
    borderRadius: 5
  },
  textButtonSmall: {
    color: 'white', 
    fontSize: 10, 
    textAlign: 'center'
  }
});
