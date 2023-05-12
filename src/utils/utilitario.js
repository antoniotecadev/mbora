import 'intl';
import 'intl/locale-data/jsonp/pt-AO';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { Colors } from 'react-native-ui-lib';

export const currency = function (price) {
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

export const numberFollowersAndViewsFormat = (numFoll, style) => {
    if(numFoll < 1000) {
        return numFoll;
    }
    if(style == 'facebook') {
        const numFormat = (numFoll / 1000).toFixed(1);
        return numFormat + 'k';
    }
    if(style == 'youtube') {
        const numFormat = numFoll.toLocaleString('en-US');
        if(numFoll >= 1000000) {
            return (numFoll / 1000000).toFixed(1).toString() + 'M';
        }
        return numFormat;
    }
    return numFoll.toString();
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