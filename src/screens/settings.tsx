import React, {useMemo, useEffect, useState} from 'react';
import {Alert, Linking, ScrollView} from 'react-native';
import {View, ActionSheet, Text, TouchableOpacity} from 'react-native-ui-lib';
import {observer, useLocalObservable} from 'mobx-react';
import appInfo from '../../app.json';
import { deleteItemAsync } from 'expo-secure-store';

import {useConstants} from '../utils/constants';
import {useStores} from '../stores';

import {Section} from '../components/section';
import {Action} from '../components/action';

import { useNavigation } from '@react-navigation/native';
import { getValueItemAsync } from '../utils/utilitario';

type PickersStateKey = keyof Omit<PickersState, 'show' | 'hide'>;
type PickersState = {
  appearance: boolean;
  language: boolean;

  show: <T extends PickersStateKey>(what: T) => void;
  hide: <T extends PickersStateKey>(what: T) => void;
};

export const Settings: React.FC = observer(() => {
  const {ui, user} = useStores();
  const {links} = useConstants();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.goBack()}>
          <Text style={{color: 'orange', fontWeight: 'bold'}}>OK</Text>
        </TouchableOpacity>
      ),
    });
  }, [])

  const pickers: PickersState = useLocalObservable(() => ({
    appearance: false,
    language: false,

    show<T extends PickersStateKey>(what: T) {
      pickers[what] = true;
    },
    hide<T extends PickersStateKey>(what: T) {
      pickers[what] = false;
    },
  }));

  const doSomething = (action: string) => () => {
    Alert.alert(action);
  };

  const openLink = (link: string) => () => {
    // Linking.openURL(link);
  };

  const appearancePickOption = (option: UIAppearance) => () => {
    ui.setAppearanceMode(option);
    console.log(option);
  };

  const languagePickOption = (option: UILanguage) => () => {
    ui.setLanguage(option);
    console.log(option);
  };

  const appearanceActions: AppearanceAction[] = useMemo(
    () => [{name: 'System'}, {name: 'Light'}, {name: 'Dark'}],
    [],
  );
  const AppearanceActionSheet = useMemo(
    () => (
      <ActionSheet
        title={'Aparência'}
        cancelButtonIndex={appearanceActions.length}
        useNativeIOS
        options={[
          ...appearanceActions.map(action => ({
            label: action.name,
            onPress: appearancePickOption(action.name),
          })),
          {
            label: 'Cancel',
          },
        ]}
        visible={pickers.appearance}
        onDismiss={() => pickers.hide('appearance')}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pickers.appearance],
  );

  const languageActions: LanguageAction[] = useMemo(
    () => [{name: 'System'}, {name: 'English'}, {name: 'Russian'}],
    [],
  );
  const LanguageActionSheet = useMemo(
    () => (
      <ActionSheet
        title={'Linguagem'}
        cancelButtonIndex={languageActions.length}
        useNativeIOS
        options={[
          ...languageActions.map(action => ({
            label: action.name,
            onPress: languagePickOption(action.name),
          })),
          {
            label: 'Cancel',
          },
        ]}
        visible={pickers.language}
        onDismiss={() => pickers.hide('language')}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pickers.language],
  );

  const UINote = useMemo(
    () => (
      <View paddingH-s3 marginB-s4>
        <Text grey40>A alteração das opções da interface do usuário recarregará o aplicativo</Text>
      </View>
    ),
    [],
  );

  async function toLoginScreen() {
    await deleteItemAsync('token');
    user.setAuth(false);
  }

  const logout = async ()=> {
    setLoading(true);
    try {
      let response = await fetch('http://192.168.18.3/mborasystem-admin/public/api/mbora/logout/user',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> Alert.alert('Token', error.message)),
        },
      });
        let rjd = await response.json();
        if (rjd.success) {
          toLoginScreen();
        } else if (rjd.message == 'Autenticação') {
          toLoginScreen();
        } else {
          Alert.alert(rjd.message, rjd.data.message);
        }
      } catch (error) {
        Alert.alert(error.message);
      } finally {
        setLoading(false);
      }
  }

  return (
    <View flex bg-bgColor>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-s4>
          <Section bg title="UI">
            <Action
              title="Aparência"
              info={ui.appearanceName}
              onPress={() => pickers.show('appearance')}
              rightIcon="chevron-forward"
            />
            {AppearanceActionSheet}

            <Action
              title="Linguagem"
              info={ui.languageName}
              onPress={() => pickers.show('language')}
              rightIcon="chevron-forward"
            />
            {LanguageActionSheet}
          </Section>
          {UINote}

          <Section bg title="Geral">
            <View>
              <Action title="Partilha" icon="share-outline" onPress={doSomething('Share')} />
              <Action title="Estrela" icon="star-outline" onPress={doSomething('Rate')} />
              <Action title="Suporte" icon="mail-unread-outline" onPress={doSomething('Support')} />
            </View>
          </Section>

          <Section bg title="Links">
            <View>
              <Action title="Github" icon="logo-github" onPress={openLink(links.github)} />
              <Action title="Website" icon="earth-outline" onPress={openLink(links.website)} />
            </View>
          </Section>

          <Section bg title="Acerca">
            <View>
              <Action disabled title="App" info={appInfo.expo.name} />
              <Action disabled title="Versão" info={appInfo.expo.version} />
            </View>
          </Section>
          <Section bg title="">
            <View>
              <Action loading={loading} title="Terminar sessão" icon="log-out-outline" onPress={()=> logout()} />
            </View>
          </Section>
        </View>
      </ScrollView>
    </View>
  );
});
