import React, { useState, useContext } from 'react';
import { View, StyleSheet, Share, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Card, Colors, Avatar, Typography, ExpandableSection, Text as TextUILIB } from 'react-native-ui-lib';
import { currency, getAppearenceColor } from '../utils/utilitario';
import {Image, CacheManager} from 'react-native-expo-image-cache';
import { CartContext } from '../CartContext';
import { AlertDialog } from './AlertDialog';

const featureIcon = require('../../assets/icons/star.png');
const shareIcon = require('../../assets/icons/share.png');

const imageProduct = require('../../assets/products/oleo.jpg');

export function Product({ appearanceName, isFavorite = false, removeFavorite, produto, onPress } ) {
  
  const [showDialog, setShowDialog] = useState(false);
  const { addItemToCart, encomendar } = useContext(CartContext);
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [top] = useState(false)

  function onExpand() {
    setExpanded(!expanded);
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const encomendarProduct = async (clientData)=> {
    await encomendar(setLoading, produto.imei, produto.id, produto.nome, clientData)
    .then(()=> {
      setLoading(false)
      setShowDialog(false);
    });
  }

  const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
  const uri = "https://firebasestorage.googleapis.com/v0/b/react-native-e.appspot.com/o/b47b03a1e22e3f1fd884b5252de1e64a06a14126.png?alt=media&token=d636c423-3d94-440f-90c1-57c4de921641";
  {/* <Card.Image style={styles.thumb} source={{ uri: urlImage }} /> */}
  {/* <Card.Image style={styles.thumb} source= {imageProduct} /> */}
  return (
    <>
    {showDialog &&
    <AlertDialog 
      showDialog={showDialog} 
      setShowDialog={setShowDialog} 
      titulo='Encomenda' 
      mensagem={'Produto: ' + produto.nome + '\n' + 'Preço: ' + currency(String(produto.preco))} 
      cor='green' 
      onPress={encomendarProduct}
      isEncomenda={true}/>}
    <Card style={[styles.card, {backgroundColor: getAppearenceColor(appearanceName), shadowColor: Colors.getScheme() === 'light' ? Colors.dmBlack : 'white'}]} center onPress={onPress}>
    {/* <Image style={styles.thumb} {...{preview, uri}} /> */}
    <Card.Image style={styles.thumb} source= {imageProduct} />
      <ExpandableSection
        top={top}
        expanded={expanded}
        sectionHeader={HeaderElement(produto.nome, produto.preco)}
        onPress={() => onExpand()}
      >
        <View maxWidth={180}>
          <View center>
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
            </TouchableOpacity>}

            {isFavorite && 
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: 'red' }]} 
              onPress={removeFavorite}>
              <Text style={styles.textButton}>Remover</Text>
            </TouchableOpacity>}

            <View style={styles.section}>
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
            <Text style={{ marginBottom: 8, color: Colors.grey40, fontSize: 10 }}>{produto.visualizacao} {produto.visualizacao > 1 ? 'visualizações' : 'visualização'}</Text>
          </View>
        </View>
      </ExpandableSection>
    </Card>
    </>
  );
}

const HeaderElement = (nome, preco) => {
  return (
    <View spread row maxWidth={180}>
      <TextUILIB textColor>
        {nome}
      </TextUILIB>
      <Text style={{ color: Colors.green10, marginBottom: 4 }}>
        {currency(String(preco))}
      </Text>
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
    marginTop:8
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
    textAlign: 'center' }
});
