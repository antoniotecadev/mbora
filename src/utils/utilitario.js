import 'intl';
import 'intl/locale-data/jsonp/pt-AO';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { Colors } from 'react-native-ui-lib';
import { Alert } from 'react-native';
import * as Constants from 'expo-constants';

export const currency = function (price = 0) {
    let p1 = price.slice(0, -2); // Números antes dos 2 últimos
    let p2 = price.slice(-2); // 2 últimos números
    let priceFormat = p1 + '.' + p2;
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 }).format(priceFormat);
};

export const removeSpaceLowerCase  = function(txt) {
    return txt.replace(/\s/g, "");
}

export async function saveTokenId(key, token) {
    await setItemAsync(key, token);
}

export async function getValueItemAsync(key) {
    let result = await getItemAsync(key);
    if (result) {
        return result;
    } else {
        return null;
    }
}

export const getAppearenceColor = (appearanceName)=> {
    if (appearanceName === 'Light') {
        return 'white';
    } else if(appearanceName === 'Dark') {
        return Colors.dmBlack;
    } else {
        return Colors.getScheme() === 'light' ? 'white' : Colors.dmBlack;
    }
}

export const numberFollowersAndViewsFormat = (number = 0, style) => {
    if(number < 1000) {
        return number;
    }
    if(style == 'facebook') {
        const numFormat = (number / 1000).toFixed(1);
        return numFormat + 'k';
    }
    if(style == 'youtube') {
        const numFormat = number.toLocaleString('en-US');
        if(number >= 1000000) {
            return (number / 1000000).toFixed(1).toString() + 'M';
        }
        return numFormat;
    }
    return number.toString();
}

let arrayColor = [];
export const getRandomColor = (code)=> {
    let color = ''; 
    if (arrayColor[code] !== undefined) {
        color = arrayColor[code];
    } else {
        const letters = '9ABCDE';
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 5)];
        }
        arrayColor[code] = color;
    }
    return color;
}

export const getCompany = async(imei, navigation, screenBack, isProfileCompany)=> {
    try {
        let response =  await fetch(Constants.default.manifest.extra.API_URL + 'empresas/mbora/imei/' + imei, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> Alert.alert('Ocorreu um erro', error.message)),
            }
        });
        let responseJsonData = await response.json();
        navigation.navigate('CompanyProfile', {...responseJsonData[0], screenBack: screenBack, isProfileCompany: isProfileCompany});
    } catch (error) {
        Alert.alert('Ocorreu um erro', error.message);
    }
}

export async function sendPushNotification(exponentPushToken, title, body) {
    const message = {
      to: exponentPushToken,
      sound: 'default',
      title: title,
      body: body,
      // data: { extraData: '' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
}