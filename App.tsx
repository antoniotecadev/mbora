import 'expo-dev-client';
import React, {useCallback, useEffect, useRef} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {LogBox, Alert} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {AppNavigator} from './src/app';
import {configureDesignSystem} from './src/utils/designSystem';
import {hydrateStores, StoresProvider, useStores} from './src/stores';
import {initServices, ServicesProvider} from './src/services';
import { getValueItemAsync } from './src/utils/utilitario';
import * as Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs(['Require']);

const API_URL = Constants.default.manifest.extra.API_URL;

// Esse manipulador determina como seu aplicativo lida com as notificações que chegam enquanto o aplicativo está em primeiro plano.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default (): JSX.Element => {

  const {user} = useStores();

  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  
  const startApp = useCallback(async () => {
    // Esse ouvinte é acionado sempre que uma notificação é recebida enquanto o aplicativo está em primeiro plano.
    notificationListener.current = Notifications.addNotificationReceivedListener(async notification => {
      await Notifications.setBadgeCountAsync(1)
    });
    // Esse ouvinte é acionado sempre que um usuário toca ou interage com uma notificação (funciona quando um aplicativo é colocado em primeiro plano, em segundo plano ou morto).
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

    await hydrateStores();
    await initServices();
    configureDesignSystem();
    if (getValueItemAsync('token') === null){
      user.setAuth(false);
    } else {
      await checkUserAuthenticated();
    }
  }, []);

  const checkUserAuthenticated = async () => {
    try {
      let response = await fetch(API_URL + 'user/autenticated',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> Alert.alert('Token', error.message)),
        }
      });
      let rjd = await response.json();
      if (rjd.success) {
        user.setUserFirstName(rjd.data.first_name);
        user.setUserLastName(rjd.data.last_name);
        user.setUserTelephone(rjd.data.telephone);
        user.setUserEmail(rjd.data.email);
        user.setIMEI(rjd.data.imei);
        user.setAccountAdmin(rjd.data.account_admin);
        user.setAuth(true);
        await SplashScreen.hideAsync();
      } else {
        user.setAuth(false);
        await SplashScreen.hideAsync();
      }
    } catch (error) {
      Alert.alert('Ocorreu um erro', error.message);
    }
  }

  useEffect(() => {
    startApp();
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [startApp]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StoresProvider>
        <ServicesProvider><AppNavigator user={user}/></ServicesProvider>
      </StoresProvider>
    </GestureHandlerRootView>
  );
};

