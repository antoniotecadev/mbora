import React, { useContext, useCallback } from 'react';
import { Platform, TouchableOpacity, Alert } from 'react-native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Colors, Badge, View } from 'react-native-ui-lib';
import { getHeaderBlurEffect } from '../../utils/designSystem';
import { Icon } from '../../components/icon';
import { useServices } from '..';
import { CartContext } from '../../CartContext';

export const screenDefaultOptions = (): NativeStackNavigationOptions => ({
  // headerShadowVisible: false,
  headerTintColor: 'orange',
  headerRight: ()=> (
  <>
    <IconHeader screen='SearchProductCompany' icon='search-circle-sharp' size={40}/>
    <IconHeader screen='Settings' icon='settings-outline' size={32}/>
  </>),

  // this setup makes large title work on iOS
  // ...Platform.select({
    // ios: {
      // headerLargeTitle: true,
      // headerTransparent: false,
      // headerBlurEffect: getHeaderBlurEffect(), // this sets up blurred nav bar
      // if you'd like to have a solid color for a nav bar, then you should
      // set up `headerStyle: {backgroundColor: Colors.bg2Color}`
    // },
    // android: {
    //   headerTitleStyle: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //   },
    // }
  // }),
});

export const tabBarDefaultOptions = (routeName: string): BottomTabNavigationOptions => ({
  tabBarBadgeStyle: {fontSize: 8, backgroundColor: Colors.red20},
  headerShown: false,
  tabBarActiveTintColor: 'orange',
  tabBarInactiveTintColor: Colors.grey40,
  tabBarStyle: { backgroundColor: Colors.bgColor, borderTopWidth: 0, elevation: 0 },
  tabBarIcon: ({ focused, color, size }) => (
      <Icon name={getIconName(routeName, focused)} size={size} color={color} />
  ),
});

export const badgeCartCount = () => {
  const { getItemsCount } = useContext(CartContext);
  return getItemsCount();
};
// return (
//   <Badge backgroundColor={Colors.red20} containerStyle={{ position: 'absolute', top: -4, right: -4 }} label={String(getItemsCount())} size={12} />
// );

const IconHeader = ({ screen, icon, size })=> {
  const { nav } = useServices();
  const onPressShow = ()=> {
    nav.show(screen, {isCompany: false});
  }
  return (
    <TouchableOpacity onPress={onPressShow}>
      <Icon name={icon} size={size} color="orange"/>
    </TouchableOpacity>
  )
}

const getIconName = (routeName: string, focused: boolean): string => {
  if (routeName === 'MainNavigator') {
    return focused ? 'home-sharp' : 'home-outline';
  }
  if (routeName === 'ProfileNavigator') {
    return focused ? 'person' : 'person-outline';
  }
  if (routeName === 'CartNavigator') {
    return focused ? 'cart' : 'cart-outline';
  }
  if (routeName === 'NotificationNavigator') {
    return focused ? 'notifications-sharp' : 'notifications-outline';
  }
  if (routeName === 'CompanyNavigator') {
    return focused ? 'grid-sharp' : 'grid-outline';
  }

  return 'list';
};
