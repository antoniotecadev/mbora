import React, { useContext } from 'react';
import { Platform, Text } from 'react-native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Colors, Badge, View } from 'react-native-ui-lib';

import { getHeaderBlurEffect } from '../../utils/designSystem';
import { Icon } from '../../components/icon';
import { CartIcon } from '../../components/CartIcon.js';

import { CartContext } from '../../CartContext';

export const screenDefaultOptions = (): NativeStackNavigationOptions => ({
  headerShadowVisible: false,
  headerTintColor: Colors.primary,

  // this setup makes large title work on iOS
  ...Platform.select({
    ios: {
      headerLargeTitle: false,
      headerTransparent: false,
      headerBlurEffect: getHeaderBlurEffect(), // this sets up blurred nav bar
      // if you'd like to have a solid color for a nav bar, then you should
      // set up `headerStyle: {backgroundColor: Colors.bg2Color}`
    },
  }),
});

export const tabBarDefaultOptions = (routeName: string): BottomTabNavigationOptions => ({
  headerShown: false,
  tabBarActiveTintColor: Colors.primary,
  tabBarInactiveTintColor: Colors.grey40,
  tabBarStyle: { backgroundColor: Colors.bgColor, borderTopWidth: 0, elevation: 0 },
  tabBarIcon: ({ focused, color, size }) => (
    <View>
      {routeName === 'CartNavigator' && <BadgeCartCount />}
      <Icon name={getIconName(routeName, focused)} size={size} color={color} />
    </View>
  ),
});

const BadgeCartCount = () => {
  const { getItemsCount } = useContext(CartContext);
  return (
    <Badge containerStyle={{ position: 'absolute', top: -4, right: -4 }} label={getItemsCount()} size={12} />
  );
}

const getIconName = (routeName: string, focused: boolean): string => {
  if (routeName === 'MainNavigator') {
    return focused ? 'home-sharp' : 'home-outline';
  }
  if (routeName === 'PerfilNavigator') {
    return focused ? 'person' : 'person-outline';
  }
  if (routeName === 'CartNavigator') {
    return focused ? 'cart' : 'cart-outline';
  }
  if (routeName === 'NotificationNavigator') {
    return focused ? 'notifications-sharp' : 'notifications-outline';
  }
  if (routeName === 'SettingsNavigator') {
    return focused ? 'cog' : 'cog-outline';
  }

  return 'list';
};
