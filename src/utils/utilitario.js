import 'intl';
import 'intl/locale-data/jsonp/pt-AO';
export const currency = function (number) {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 2 }).format(number.slice(0, -2));
};

export const removeSpaceLowerCase  = function(txt) {
    return txt.replace(/\s/g, "");
}