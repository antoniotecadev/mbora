// import { ArrayIterator } from 'lodash';
// import React from 'react';
// import { StyleSheet, FlatList} from 'react-native';
// import {View, Text, Card, Spacings, BorderRadiuses} from 'react-native-ui-lib';
// import products from '../data/products';

// export default function Home() {

//   const renderItem = ({item} : {item: any}) => {
//     return (
//       <Card flex>
//         <Card.Section imageSource={{uri: item.mediaUrl}} imageStyle={styles.itemImage}/>
//         <View padding-s2>
//           <Text $textDefault>{item.name}</Text>
//           <Text $textDefault>{item.formattedPrice}</Text>
//           {item.inventory.status === 'Out of Stock' && (
//             <Text text90M $textDangerLight>
//               {item.inventory.status}
//             </Text>
//           )}
//         </View>
//       </Card>
//     );
//   };

//   return (
//     <FlatList<typeof products[0]>
//       ListHeaderComponent={
//         <Text h1 marginB-s5>
//           GridList
//         </Text>
//       }
//       data={products}
//       renderItem={renderItem}
//       // numColumns={2}
//       maxItemWidth={140}
//       itemSpacing={Spacings.s3}
//       listPadding={Spacings.s5}
//       // keepItemSize
//       contentContainerStyle={styles.list}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   list: {
//     paddingTop: Spacings.s5
//   },
//   itemImage: {
//     width: '100%',
//     height: 85,
//     borderRadius: BorderRadiuses.br10
//   }
// });

import _ from 'lodash';
import {View, Text, Image, Constants, Avatar, GridView, Card} from 'react-native-ui-lib';
import React, {Component} from 'react';
import {Alert, ScrollView} from 'react-native';
import products from '../data/products';

export default function Home(){
  return (
    <GridViewScreen/>
  );
}

class GridViewScreen extends Component {
  state = {
    dynamicLayout: _.flow(products => _.take(products, 3),
      (products: any[]) =>
        _.map(products, product => ({
          imageProps: {
            source: {
              uri: product.mediaUrl
            }
          },
          itemSize: {height: 90},
          title: 'Title',
          subtitle: 'subtitle',
          description: product.name,
          descriptionLines: 2,
          alignToStart: true,
          onPress: () => Alert.alert('Click!')
        })))(products),
    orientation: Constants.orientation
  };

  onLayout = () => {
    if (this.state.orientation !== Constants.orientation) {
      // Basically just for triggering render - can be any other variable
      // (Constants.orientation is already up-to-date and can be used directly)
      this.setState({
        orientation: Constants.orientation
      });
    }
  };

  render() {
    const {dynamicLayout} = this.state;

    return (
      <ScrollView onLayout={this.onLayout}>
        <View padding-page>
          <Text marginV-s5 text60BO>
            Dynamic itemSize
          </Text>
          <GridView numColumns={3} items={dynamicLayout} maxItemWidth={200}/>
        </View>
      </ScrollView>
    );
  }
}
