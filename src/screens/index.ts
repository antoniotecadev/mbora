import { ModalScreenLayouts, ScreenLayouts, TabScreenLayouts } from '../services/navigation/types';

import Perfil from './Perfil';
import PerfilCantina from './PerfilCantina';
import ProductsList from './ProductsList';
import ListaCantinas from './ListaCantinas';
import SearchProduct from './SearchProduct';
import { ProductDetails } from './ProductDetails.js';
import { Carrinho } from './Carrinho.js';
import { Settings } from './settings';
import { Example } from './screen-sample';
import { genRootNavigator, genStackNavigator, genTabNavigator } from '../services/navigation/help';
import { screenDefaultOptions, tabBarDefaultOptions, badgeCartCount } from '../services/navigation/options';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

// Describe your screens here
export type Tabs = 'Main' | 'Profile' | 'Cart' | 'Notification' | 'Cantinas';
export type Modal = 'ExampleModal';
export type Screen = 'SignInForm' | 'SignUpForm' | 'Main' | 'Example' | 'Profile'|'Settings' | 'ProductDetails' | 'Cart' | 'ListaCantinas'|'PerfilCantina' | 'SearchProduct';

export type ModalProps = {
  ExampleModal: undefined;
  SearchProduct: undefined;
  ExampleScreenProps: undefined;
};
export type ScreenProps = {
  Main: undefined;
  Example: ExampleScreenProps;
  Settings: undefined;
  ProductDetails: undefined;
} & ModalProps;

// Screens
const screens: ScreenLayouts = {
  SignInForm: {
    name: 'SignInForm',
    component: SignInForm,
    options: () => ({
      title: 'Login',
      headerTintColor: 'orange',
      headerShown: false
    }),
  },
  SignUpForm: {
    name: 'SignUpForm',
    component: SignUpForm,
    options: () => ({
      title: 'Criar conta',
      headerTintColor: 'orange',
      headerShown: false
    }),
  },
  Main: {
    name: 'Main',
    component: ProductsList,
    options: () => ({
      title: 'Mbora',
      ...screenDefaultOptions(),
    }),
  },
  Example: {
    name: 'Example',
    component: Example,
    options: () => ({
      title: 'Example',
      ...screenDefaultOptions(),
    }),
  },
  Profile: {
    name: 'Perfil',
    component: Perfil,
    options: () => ({
      title: 'Perfil',
      ...screenDefaultOptions(),
    }),
  },
  Settings: {
    name: 'Settings',
    component: Settings,
    options: () => ({
      title: 'Configurações',
      headerTintColor: 'orange',
    }),
  },
  ProductDetails: {
    name: 'ProductDetails',
    component: ProductDetails,
    options: () => ({
      title: 'Detalhe de produto',
      ...screenDefaultOptions(),
    }),
  },
  Cart: {
    name: 'Carrinho',
    component: Carrinho,
    options: () => ({
      title: 'Carrinho de encomenda',
      ...screenDefaultOptions(),
    }),
  },
  ListaCantinas: {
    name: 'ListaCantinas',
    component: ListaCantinas,
    options: () => ({
      title: 'Cantinas',
      ...screenDefaultOptions(),
    }),
  },
  PerfilCantina: {
    name: 'PerfilCantina',
    component: PerfilCantina,
    options: () => ({
      title: 'Perfil cantina',
      ...screenDefaultOptions(),
    }),
  },
  SearchProduct: {
    name: 'SearchProduct',
    component: SearchProduct,
    options: () => ({
      title: 'Pesquisa',
      headerTintColor: 'orange',
    }),
  },
};

const SigInStack = () => genStackNavigator([screens.SignInForm, screens.SignUpForm]);
const HomeStack = () => genStackNavigator([screens.Main, screens.Example, screens.ProductDetails, screens.Cart, screens.SearchProduct, screens.Settings]);
const ExampleStack = () => genStackNavigator([screens.Example]);
const SettingsStack = () => genStackNavigator([screens.Settings]);
const ExampleModalStack = () => genStackNavigator([screens.Settings, screens.Example]);
const CartStack = () => genStackNavigator([screens.Cart]);
const CantinasStack = () => genStackNavigator([screens.ListaCantinas, screens.PerfilCantina]);
const ProfileStack = () => genStackNavigator([screens.Profile, screens.ProductDetails]);

// Tabs
const tabs: TabScreenLayouts = {
  Main: {
    name: 'MainNavigator',
    component: HomeStack,
    options: () => ({
      title: 'Casa',
      ...tabBarDefaultOptions('MainNavigator'),
    }),
  },
  Profile: {
    name: 'PerfilNavigator',
    component: ProfileStack,
    options: () => ({
      title: 'Perfil',
      ...tabBarDefaultOptions('PerfilNavigator'),
    }),
  },
  Cart: {
    name: 'CartNavigator',
    component: CartStack,
    options: () => ({
      title: 'Carrinho',
      tabBarBadge: badgeCartCount(),
      ...tabBarDefaultOptions('CartNavigator'),
    }),
  },
  Notification: {
    name: 'NotificationNavigator',
    component: ExampleStack,
    options: () => ({
      title: 'Notificação',
      ...tabBarDefaultOptions('NotificationNavigator'),
    }),
  },
  Cantinas: {
    name: 'CantinasNavigator',
    component: CantinasStack,
    options: () => ({
      title: 'Cantinas',
      ...tabBarDefaultOptions('CantinasNavigator'),
    }),
  },
};
const TabNavigator = () => genTabNavigator([tabs.Main, tabs.Profile, tabs.Cart, tabs.Notification, tabs.Cantinas]);

// Modals
const modals: ModalScreenLayouts = {
  ExampleModal: {
    name: 'ExampleModal',
    component: ExampleModalStack,
    options: () => ({
      title: 'ExampleModal',
    }),
  },
};

// Root Navigator
export const RootNavigator = ({ isSignedIn }): JSX.Element =>
  genRootNavigator(isSignedIn == 0 ? SigInStack : TabNavigator, [modals.ExampleModal]);
