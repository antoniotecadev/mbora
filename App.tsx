import 'expo-dev-client';
import React, {useCallback, useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {LogBox, Alert} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {AppNavigator} from './src/app';
import {configureDesignSystem} from './src/utils/designSystem';
import {hydrateStores, StoresProvider, useStores} from './src/stores';
import {initServices, ServicesProvider} from './src/services';
import { getValueItemAsync } from './src/utils/utilitario';
import * as Constants from 'expo-constants';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs(['Require']);

const API_URL = Constants.default.manifest.extra.API_URL;

export default (): JSX.Element => {

  const {user} = useStores();
  
  const startApp = useCallback(async () => {

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
  }, [startApp]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StoresProvider>
        <ServicesProvider><AppNavigator user={user}/></ServicesProvider>
      </StoresProvider>
    </GestureHandlerRootView>
  );
};

