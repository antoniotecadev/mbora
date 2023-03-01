import 'intl';
import 'intl/locale-data/jsonp/pt-AO';
import { Alert } from "react-native";
import { getItemAsync, setItemAsync } from 'expo-secure-store';

export const currency = function (number) {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 }).format(number.slice(0, -2));
};

export const removeSpaceLowerCase  = function(txt) {
    return txt.replace(/\s/g, "");
}

export async function saveTokenId(key, token, user_id) {
    await setItemAsync(key, token);
    await setItemAsync('user_id', user_id);
  }

export async function getValueItemAsync(key) {
    let result = await getItemAsync(key);
    if (result) {
        return result;
    } else {
        return null;
    }
}