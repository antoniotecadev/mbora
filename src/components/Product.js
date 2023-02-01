import React, { useState } from 'react';
import { View, StyleSheet, Share, TouchableOpacity, Text as Texto } from 'react-native';
import { Card, Text, Button, Colors, Avatar, Typography, ExpandableSection } from 'react-native-ui-lib';
import { currency, removeSpaceLowerCase } from '../utils/utilitario';

const featureIcon = require('../../assets/icons/star.png');
const shareIcon = require('../../assets/icons/share.png');

const imageProduct = require('../../assets/products/oleo.jpg');


const labelButton = { label: 'Add favoritos' };
const iconButton = { round: true, iconStyle: { tintColor: Colors.white } };

export function Product({ nome, preco, tag, urlImage, empresa, district, street, nomeProvincia, nomeCategoria, onPress }) {

  const statusColor = Colors.$textSuccess;

  const [buttonProps, setButtonProps] = useState(iconButton)

  const [expanded, setExpanded] = useState(false)
  const [top] = useState(false)

  const changeProps = () => {
    if (buttonProps === iconButton) {
      setButtonProps(labelButton);
      setTimeout(() => {
        setButtonProps(iconButton);
      }, 1000);
    }
  };

  function onExpand() {
    setExpanded(!expanded);
  }

  function getHeaderElement(nome, preco) {
    return (
      <View spread row maxWidth={180}>
        <Text text80 $textDefault>
          {nome}
        </Text>
        <Text text80 $textDefault green20 marginB-4>
          {currency(String(preco))}
        </Text>
      </View>
    );
  }

  const Tag = (props) => {
    return <TouchableOpacity>
            <Texto style={{color: 'green'}}>{removeSpaceLowerCase('#' + props.tag)}</Texto>
          </TouchableOpacity>
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
      alert(error.message);
    }
  };

  return (
    <Card style={styles.card} center onPress={onPress}>
      {/* <Card.Image style={styles.thumb} source={{ uri: urlImage }} /> */}
      <Card.Image style={styles.thumb} source= {imageProduct} />
      <ExpandableSection
        top={top}
        expanded={expanded}
        sectionHeader={getHeaderElement(nome, preco)}
        onPress={() => onExpand()}
      >
        <View maxWidth={180}>
          <View center>
            <Button
              text90
              label="Adicionar aos favoritos"
              size={Button.sizes.large}
              borderRadius={10}
              style={{ marginBottom: 5, backgroundColor: 'orange' }}
            />
            <Button
              text90
              marginB-10
              label="Partilhar"
              size={Button.sizes.large}
              borderRadius={10}
              style={{ backgroundColor: 'green' }}
            />
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Button
                size={'small'}
                backgroundColor = 'green'
                iconSource={featureIcon}
                {...buttonProps}
                onPress={changeProps}
                iconOnRight
                animateLayout
                animateTo={'left'}
              />
              <Button
                size={'small'}
                backgroundColor = 'green' 
                iconSource={shareIcon}
                {...iconButton}
                onPress={onShare}
              />
            </View>
            <Text marginT-8 text100 grey40>
              {`${nomeProvincia}, ${district} , ${street}`}
            </Text>
            <View style={styles.section}>
              <Text $textDefault style={{ ...Typography.text90 }}>{empresa}</Text>
              <Avatar source={{ uri: 'https://lh3.googleusercontent.com/-cw77lUnOvmI/AAAAAAAAAAI/AAAAAAAAAAA/WMNck32dKbc/s181-c/104220521160525129167.jpg' }}
                size={24}
                animate={true}
                imageProps={{ animationDuration: 1000 }}
                badgeProps={{ size: 6, borderWidth: 0, backgroundColor: Colors.$backgroundSuccessHeavy }}
              />
            </View>
            <Tag tag = {tag}/>
            <Tag tag = {nomeCategoria}/>
          </View>
        </View>
      </ExpandableSection>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '49%',
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
    marginVertical: 5,
  },
  thumb: {
    height: 210,
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
    marginBottom: 15,
    marginRight: 15
  },
  icon: {
    alignSelf: 'center'
  },
});
