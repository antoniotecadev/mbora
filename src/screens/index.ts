import { ModalScreenLayouts, ScreenLayouts, TabScreenLayouts } from '../services/navigation/types';

import Perfil from './Perfil';
import CompanyProfile from './CompanyProfile';
import ProductsList from './ProductsList';
import CompanyList from './CompanyList';
import SearchProduct from './SearchProduct';
import { ProductDetails } from './ProductDetails.js';
import { Carrinho } from './Carrinho.js';
import { Settings } from './settings';
import { genRootNavigator, genStackNavigator, genTabNavigator } from '../services/navigation/help';
import { screenDefaultOptions, tabBarDefaultOptions, badgeCartCount } from '../services/navigation/options';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ProfileEdit from './ProfileEdit';

// Describe your screens here
export type Tabs = 'Main' | 'Profile' | 'Cart' | 'Notification' | 'Company';
export type Modal = 'SettingsModal';
export type Screen = 'SignInForm' | 'SignUpForm' | 'Main' | 'Profile'| 'ProfileEdit' | 'Settings' | 'ProductDetails' | 'Cart' | 'CompanyList' | 'CompanyProfile' | 'SearchProduct';

export type ModalProps = {
  ExampleModal: undefined;
  SearchProduct: undefined;
  SettingsModal: undefined;
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
  Profile: {
    name: 'Perfil',
    component: Perfil,
    options: () => ({
      title: 'Perfil',
      ...screenDefaultOptions(),
    }),
  },
  ProfileEdit: {
    name: 'ProfileEdit',
    component: ProfileEdit,
    options: () => ({
      title: 'Editar Perfil',
      headerTintColor: 'orange',
      headerShown: true
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
  CompanyList: {
    name: 'CompanyList',
    component: CompanyList,
    options: () => ({
      title: 'Empresas',
      ...screenDefaultOptions(),
    }),
  },
  CompanyProfile: {
    name: 'CompanyProfile',
    component: CompanyProfile,
    options: () => ({
      title: '',
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
const HomeStack = () => genStackNavigator([screens.Main, screens.Profile, screens.ProductDetails, screens.Cart, screens.SearchProduct]);
const SettingsStack = () => genStackNavigator([screens.Settings]);
const CartStack = () => genStackNavigator([screens.Cart]);
const CompanyStack = () => genStackNavigator([screens.CompanyList, screens.CompanyProfile]);
const ProfileStack = () => genStackNavigator([screens.Profile, screens.ProductDetails, screens.ProfileEdit]);

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
    component: CartStack,
    options: () => ({
      title: 'Notificação',
      ...tabBarDefaultOptions('NotificationNavigator'),
    }),
  },
  Company: {
    name: 'Company',
    component: CompanyStack,
    options: () => ({
      title: 'Empresa',
      ...tabBarDefaultOptions('CompanyNavigator'),
    }),
  },
};
const TabNavigator = () => genTabNavigator([tabs.Main, tabs.Profile, tabs.Cart, tabs.Notification, tabs.Company]);

// Modals
const modals: ModalScreenLayouts = {
  SettingsModal: {
    name: 'SettingsModal',
    component: SettingsStack,
    options: () => ({
      title: 'Configurações',
      headerTintColor: 'orange',
    }),
  },
};

// Root Navigator
export const RootNavigator = ({auth}): JSX.Element => genRootNavigator(auth ? TabNavigator : SigInStack, [modals.SettingsModal]);