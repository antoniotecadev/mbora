import React, {createContext, useState} from 'react';
import { getValueItemAsync } from './utils/utilitario';
import { getProduct } from './services/ProductsService.js';
import { deleteItemAsync } from 'expo-secure-store';
import * as Constants from 'expo-constants';

export const CartContext = createContext();

export function CartProvider(props) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState({visible: false, title: null, message: null, color: null});
  const [visibleToast, setVisibleToast] = useState({visible: false, message: null, backgroundColor: null});
  
  function addItemToCart(produto, msg, bckClr) {
    // const product = getProduct(id);
    setVisibleToast({visible: true, message: msg, backgroundColor: bckClr});
    const product = produto;
    setItems((prevItems) => {
      const item = prevItems.find((item) => (item.id == product.id));
      if(!item) {
          return [...prevItems, {
              id: product.id,
              qty: 1,
              product,
              totalPrice: product.preco 
          }];
      }
      else { 
          return prevItems.map((item) => {
            if(item.id == product.id) {
              item.qty++;
              item.totalPrice += product.preco;
            }
            return item;
          });
      }
    });
  }

  function getItemsCount() {
      return items.reduce((sum, item) => (sum + item.qty), 0);
  }
  
  function getTotalPrice() {
      return items.reduce((sum, item) => (sum + item.totalPrice), 0);
  }
  
  function quantity(id, { isSum }) {
    setItems((prevItems) => { 
      return prevItems.map((item) => {
        if(item.id == id) {
          if(isSum) {
            item.qty++;
            item.totalPrice += item.product.preco;
          } else {
            item.qty--;
            item.totalPrice -= item.product.preco;
          }
        } 
        return item;
      });
    });
  }

  function removeItemToCart(id, msg, bckClr, {isAll}){
    if(isAll) {
      setItems([]);
    } else {
      setItems(items.filter(p=> p.id !== id));
    }
    setVisibleToast({visible: true, message: msg, backgroundColor: bckClr});
  }

  const encomendar = async (setLoading, imei, productId, productName, productQuantity, clientData)=> {
    setLoading({encomenda: true});
    try {
      let response = await fetch(Constants.default.manifest.extra.API_URL + 'produtos/mbora/encomenda',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
        },
        body: JSON.stringify({
          client_phone: clientData.telephone,
          client_address: clientData.address,
          client_info_ad: clientData.information,
          imei_contacts: imei,
          client_coordinate: clientData.coorLoc,
          id_produts_mbora: productId,
          prod_quant: productQuantity,
          product_name: productName,
        }),
      }
      );
        let rjd = await response.json();
        if(rjd.success) {
          setShowDialog({visible: true, title: 'Encomenda', message: productName + ' ' + rjd.data.message, color: 'green'});
          // setVisibleToast({visible: true, message: rjd.message, backgroundColor: 'green'});
          // alert(JSON.stringify(rjd.data.message, null, 2));
        } else {
          if (rjd.message == 'Erro de validação') {
              let messageError;
              if (rjd.data.message.imei_contacts != undefined){
                messageError = rjd.data.message.imei_contacts;
              } else {
                messageError = rjd.data.message.id_produts_mbora;
              }
              setShowDialog({visible: true, title: rjd.message, message: messageError[0], color: 'orangered'});
          } else if (rjd.message == 'Autenticação') {
            setShowDialog({visible: true, title: rjd.message, message: rjd.data.message, color: 'orange'});
            await deleteItemAsync('token');
            props.user.setAuth(false);
          } else {
            setShowDialog({visible: true, title: rjd.message, message: rjd.data.message, color: 'orangered'});
          }
      }
    } catch (error) {
      setLoading({encomenda: false});
      setShowDialog({visible: true, title: 'Erro', message: error.message, color: 'orangered'});
    }
  }
  
  return (
    <CartContext.Provider 
      value={{items, setItems, getItemsCount, addItemToCart, getTotalPrice, quantity, removeItemToCart, visibleToast, setVisibleToast, error, setError, showDialog, setShowDialog, encomendar}}>
      {props.children}
    </CartContext.Provider>
  );
}

