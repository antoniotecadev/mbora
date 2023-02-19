import React, {useEffect, useContext} from 'react';
import {
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity, 
  StyleSheet,
  } from 'react-native';

import { CartContext } from '../CartContext';
import { currency, removeSpaceLowerCase } from '../utils/utilitario';
import {Image} from 'react-native-expo-image-cache';
import { Icon } from '../components/icon';
import { Text as TextUILB, View as ViewUILB, Avatar, Colors } from 'react-native-ui-lib';

export function ProductDetails({route}) {
  const { produto } = route.params;
  const { addItemToCart } = useContext(CartContext);
  
  useEffect(() => {
    
  },[]);
  
  const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
  const uri = "https://firebasestorage.googleapis.com/v0/b/react-native-e.appspot.com/o/b47b03a1e22e3f1fd884b5252de1e64a06a14126.png?alt=media&token=d636c423-3d94-440f-90c1-57c4de921641";  
  return (
    <SafeAreaView>
      <ScrollView>
      <ViewUILB marginH-16 style={styles.section}>
          <Text $textDefault>{produto.empresa}</Text>
          <Avatar source={{ uri: 'https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg' }}
            size={24}
            animate={true}
            imageProps={{ animationDuration: 1000 }}
            badgeProps={{ size: 6, borderWidth: 0, backgroundColor: Colors.$backgroundSuccessHeavy }}
          />
        </ViewUILB>
        <TextUILB marginH-16 marginB-16 grey40>
            {`${produto.nomeProvincia}, ${produto.district} , ${produto.street}`}
          </TextUILB>
        <Image style={styles.image} {...{preview, uri}} />
        <View style={styles.infoContainer}>
          <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <IconButton iconNames={'cart-outline'} size={25}/>
                <IconButton iconNames={'chatbox-outline'} size={25}/>
                <IconButton iconNames={'heart-outline'} size={25} onPress={()=> addItemToCart(produto, produto.nome + ' adicionado ao carrinho.', 'green')}/>
                <IconButton iconNames={'qr-code-outline'} size={25}/>
                <IconButton iconNames={'share-outline'} size={25}/>
            </View>
          <Text style={styles.name}>{produto.nome}</Text>
          <Text style={styles.price}>{currency(String(produto.preco))}</Text>
          <Text style={styles.description}>{produto.nomeCategoria}</Text>
          <Tag tag = {produto.tag}/>
          <TextUILB marginT-8 grey40>Publicado {produto.created_at}</TextUILB>
          {produto.updated_at && <TextUILB marginT-8 grey40>Alterado {produto.updated_at}</TextUILB>}
          <TextUILB marginT-8 grey40>{`13 visualizações`}</TextUILB>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Tag = (props) => {
  return <TouchableOpacity>
          <Text style={{color: 'green'}}>{removeSpaceLowerCase('#' + props.tag)}</Text>
        </TouchableOpacity>
} 

const IconButton = ({iconNames , size, onPress}) =>{
  return <TouchableOpacity onPress={onPress}>
            <Icon name={iconNames} size={size} color="green"/>
          </TouchableOpacity>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    marginVertical: 20,
  },
  image: {
    height: 300,
    width: '100%'
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    marginBottom: 8,
    color: 'green'
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#787878',
    marginBottom: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
