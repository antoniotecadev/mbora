import { ModalScreenLayouts, ScreenLayouts, TabScreenLayouts } from '../services/navigation/types';

import Profile from './Profile';
import CompanyProfile from './CompanyProfile';
import ProductsList from './ProductsList';
import CompanyList from './CompanyList';
import SearchProductCompany from './SearchProductCompany';
import { ProductDetails } from './ProductDetails.js';
import { Carrinho } from './Carrinho.js';
import { Settings } from './settings';
import { genRootNavigator, genStackNavigator, genTabNavigator } from '../services/navigation/help';
import { screenDefaultOptions, tabBarDefaultOptions, badgeCartCount } from '../services/navigation/options';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ProfileEdit from './ProfileEdit';
import PreviewProfilePhoto from './PreviewProfilePhoto';
import { FindAccount, ListAccount, SendCode, ConfirmationAccount, CreateNewPassword } from './FindAccount';

// Describe your screens here
export type Tabs = 'Main' | 'Profile' | 'Cart' | 'Notification' | 'Company';
export type Modal = '';
export type Screen = 'SignInForm' | 'SignUpForm' | 'FindAccount' | 'ListAccount' | 'SendCode' | 'ConfirmationAccount' | 'CreateNewPassword' | 'Main' | 'Profile'| 'ProfileEdit' | 'PreviewProfilePhoto' | 'Settings' | 'ProductDetails' | 'Cart' | 'CompanyList' | 'CompanyProfile' | 'SearchProductCompany';

export type ModalProps = {
  ExampleModal: undefined;
  SearchProductCompany: undefined;
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
  FindAccount: {
    name: 'FindAccount',
    component: FindAccount,
    options: () => ({
      title: '',
      headerTintColor: 'green',
    }),
  },
  ListAccount: {
    name: 'ListAccount',
    component: ListAccount,
    options: () => ({
      title: '',
      headerTintColor: 'green',
    }),
  },
  SendCode: {
    name: 'SendCode',
    component: SendCode,
    options: () => ({
      title: '',
      headerTintColor: 'green',
    }),
  },
  ConfirmationAccount: {
    name: 'ConfirmationAccount',
    component: ConfirmationAccount,
    options: () => ({
      title: '',
      headerTintColor: 'green',
    }),
  },
  CreateNewPassword: {
    name: 'CreateNewPassword',
    component: CreateNewPassword,
    options: () => ({
      title: '',
      headerTintColor: 'green',
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
    name: 'Profile',
    component: Profile,
    options: () => ({
      title: 'Perfil',
      headerTintColor: 'orange',
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
  PreviewProfilePhoto: {
    name: 'PreviewProfilePhoto',
    component: PreviewProfilePhoto,
    options: () => ({
      title: 'Alterar foto de perfil',
      headerTintColor: 'orange',
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
      headerTintColor: 'orange',
      title: 'Detalhe de produto',
    }),
  },
  Cart: {
    name: 'Carrinho',
    component: Carrinho,
    options: () => ({
      headerTintColor: 'orange',
      title: 'Carrinho de encomenda',
    }),
  },
  CompanyList: {
    name: 'CompanyList',
    component: CompanyList,
    options: () => ({
      title: 'Empresas',
      headerTintColor: 'orange',
    }),
  },
  CompanyProfile: {
    name: 'CompanyProfile',
    component: CompanyProfile,
    options: () => ({
      title: '',
      headerTintColor: 'orange',
    }),
  },
  SearchProductCompany: {
    name: 'SearchProductCompany',
    component: SearchProductCompany,
    options: () => ({
      title: 'Pesquisa',
      headerTintColor: 'orange',
    }),
  },
};

const SigInStack = () => genStackNavigator([screens.SignInForm, screens.SignUpForm, screens.FindAccount, screens.ListAccount, screens.SendCode, screens.ConfirmationAccount, screens.CreateNewPassword]);
const HomeStack = () => genStackNavigator([screens.Main, screens.Profile, screens.ProductDetails, screens.Cart, screens.SearchProductCompany, screens.Settings, screens.CompanyProfile]);
const CartStack = () => genStackNavigator([screens.Cart]);
const CompanyStack = () => genStackNavigator([screens.CompanyList, screens.SearchProductCompany, screens.CompanyProfile, screens.ProductDetails]);
const ProfileStack = () => genStackNavigator([screens.Profile, screens.ProductDetails, screens.ProfileEdit, screens.PreviewProfilePhoto, screens.CompanyProfile]);

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
    name: 'ProfileNavigator',
    component: ProfileStack,
    options: () => ({
      title: 'Perfil',
      ...tabBarDefaultOptions('ProfileNavigator'),
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
// const modals: ModalScreenLayouts = {

// };

// Root Navigator
export const RootNavigator = ({auth}): JSX.Element => genRootNavigator(auth ? TabNavigator : SigInStack, []);