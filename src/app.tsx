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

export const AppNavigator = ({auth}): JSX.Element => {
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
          theme={getNavigationTheme()}>
          <RootNavigator auth={auth}/>
        </NavigationContainer>
      </CartProvider>
    </>
  );
};

