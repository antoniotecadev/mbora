import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { RootNavigator } from './screens';
import {
  getNavigationTheme,
  getThemeStatusBarBGColor,
  getThemeStatusBarStyle,
} from './utils/designSystem';
import { useServices } from './services';
import { CartProvider } from './CartContext.js';

export const AppNavigator = (): JSX.Element => {
  useColorScheme();
  const { nav } = useServices();

  return (
    <>
      <StatusBar barStyle={getThemeStatusBarStyle()} backgroundColor={getThemeStatusBarBGColor()} />
      <CartProvider>
        <NavigationContainer
          ref={nav.n}
          onReady={nav.onReady}
          onStateChange={nav.onStateChange}
          theme={getNavigationTheme()}
        >
          <RootNavigator />
        </NavigationContainer>
      </CartProvider>
    </>
  );
};
// import React from 'react';
// import { StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import { ProductsList } from './screens/ProductsList.js';
// import { ProductDetails } from './screens/ProductDetails.js';
// import { Cart } from './screens/Cart.js';
// import { CartIcon } from './components/CartIcon.js';
// import { CartProvider } from './CartContext.js';

// const Stack = createNativeStackNavigator();

// export const AppNavigator = (): JSX.Element => {
//   return (
//     <CartProvider>
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen name='Products' component={ProductsList} 
//           options={({ navigation }) => ({
//             title: 'Products',
//             headerTitleStyle: styles.headerTitle,
//             headerRight: () => <CartIcon navigation={navigation}/>
//           })}/>
//           <Stack.Screen name='ProductDetails' component={ProductDetails} 
//           options={({ navigation }) => ({
//             title: 'Product details',
//             headerTitleStyle: styles.headerTitle,
//             headerRight: () => <CartIcon navigation={navigation}/>,
//           })} />
//           <Stack.Screen name='Cart' component={Cart} 
//           options={({ navigation }) => ({
//             title: 'My cart',
//             headerTitleStyle: styles.headerTitle,
//             headerRight: () => <CartIcon navigation={navigation}/>, 
//            })} /> 
//         </Stack.Navigator>
//       </NavigationContainer>
//     </CartProvider>
//   );
// }

// const styles = StyleSheet.create({
//   headerTitle: {
//     fontSize: 20
//   }
// });


