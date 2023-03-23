import 'intl';
import 'intl/locale-data/jsonp/pt-AO';
import { Alert } from "react-native";
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { Colors } from 'react-native-ui-lib';

export const currency = function (number) {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 }).format(number.slice(0, -2));
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